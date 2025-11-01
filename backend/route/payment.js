const express=require('express');
const route=express.Router();
const stripe=require('stripe')
(process.env.STRIPE_SECRATE_KEY);
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuthorize');
const prisma=require('../utils/prisma');

const genTrxCode=require('../utils/genTrxCode')

//Stripe Intigration
route.post('/create-checkout-session',verification,roleAuthorize('USER'), async(req,res)=>{
    try{
        const {cartItems}=req.body
        const line_items=cartItems.map(item=>({
            price_data:{
                currency:'php',
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
                quantity:item.quantity
        }));

        const session= await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode:'payment',
            line_items,
      metadata: {
        userId: req.user?.id?.toString() || '0',
        amount: (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)).toString()
      },
    
      success_url: 'http://localhost:5173/home/paymentsuccess',
      cancel_url: 'http://localhost:5173/home/paymentfaild',
        });
         res.json({ url: session.url });
    }catch(err){console.error(err); res.status(500).json({msg: 'Stripe session creation failed'})}
});


//WEBHOOK STRIP
route.post('/webhook', async (req, res) => {

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata.userId);
    const amount= parseFloat(session.metadata.amount)

    if (!userId) {
      return res.status(400).send("Invalid user ID in metadata.");
    }

    try {
     const {location}=req.body
         const user= await prisma.user.findUnique({
                    where:{id:userId},
                    select:{referredBy:true}
                });
                const shippingRate= await prisma.shippingRate.findFirst({
                    where:{location}
                });
                if(!shippingRate){return res.status(400).json({msg:'Shipping Not Available of This Area'})}
    
                const cart= await prisma.cart.findFirst({
                    where:{userId, status:'PENDING'},
                    include:{items:true}
                });
                if(!cart || cart.items.length===0){return res.status(404).json({msg:'Cart Is Empty'})}
    
                const address= await prisma.address.findFirst({
                    where:{userId}
                });
                if(!address){res.status(400).json({msg:'Please Add Shipping Address'})}
                
    
                let totalWeight=0
                let totalPrice=0
                for(const item of cart.items){
                    const product =await prisma.product.findUnique({
                        where:{id:item.productId}
                    });
                    if(!product) continue;
                    totalWeight+= product.weight * item.quantity
                    totalPrice+=item.totlaPrice
                };
                const shippingFee = shippingRate.baseFee+(totalWeight*shippingRate.perKgFee);
                const existingOrder= await prisma.order.findMany({
                    where:{id:userId}
                });
                   const bounsAmount= await prisma.refWallet.findFirst({
                    where:{userId:user.referredBy},
                    select:{amount:true}
                });
                 const bonus= bounsAmount?bounsAmount.amount:0
                 const order= await prisma.order.create({
                    data:{userId,totalPrice:(totalPrice-bonus)+shippingFee, status:'CONFIRMED', addressId:address.id,
                        payment:payment.id,
                        items:{
                        create: cart.items.map((item)=>({
                            productId: item.productId,
                            quantity:item.quantity,
                            unitPrice:item.unitPrice,
                            totalPrice:item.totalPrice
                        }))
                    }},
                    include:{items:true}
                });
                await prisma.cart.update({
                    where:{id:cart.id},
                    data:{status:'COMPLETED'}
                });
                await prisma.refWallet.update({
                    where:{userId:user.referredBy},
                    data:{amount:0}
                });

                const payment= await prisma.payment.create({
                    data:{
                        orderId:order.id,
                        status:'PAID',
                        amount:amount,
                        currency:'PHP',
                        transactionId:genTrxCode(),
                        paymentmethod:'CARD'
                    }
                })
                
                if(existingOrder.length===0 && user.referredBy&& payment.status==='PAID'&&payment.paymentmethod==='CARD'){
                    const referredId= parseInt(user.referredBy)
                    let wallet=await prisma.refWallet.findUnique({
                        where:{userId:referredId}
                    });
                    if(!wallet){wallet= await prisma.refWallet.create({
                        data:{userId:referredId, amount:0}
                    })}
                       const bonus=50;
                    await prisma.refWallet.update({
                    where:{id:wallet.id},
                    data:{amount:wallet.amount+bonus}
                })
                }
     res.status(200).json({msg:'Order Placed Successfully'})
    

      console.log('✅ Premium user upgraded:', userId);
    } catch (err) {
      console.error('❌ Failed to update user:', err.message);
    }
  }

  res.json({ received: true });
});










module.exports=route
