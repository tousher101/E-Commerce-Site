const express=require('express');
const route=express.Router();
const Stripe=require('stripe')
const stripe=Stripe(process.env.STRIPE_SECRATE_KEY);
const prisma=require('../utils/prisma');
const genTrxCode=require('../utils/genTrxCode')

//WEBHOOK STRIP
route.post('/webhook' ,express.raw({ type: 'application/json' }), async (req, res) => {

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
    try {
      if(event.type==='checkout.session.completed'){
        const session= event.data.object;
        const location= session.metadata.location;
        const addressId= Number(session.metadata.addressId);
        const userId=Number(session.metadata.userId)


         const user= await prisma.user.findUnique({
                    where:{id:userId},
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
    
            
                
    
                let totalWeight=0
                let totalPrice=0
                for(const item of cart.items){
                    const product =await prisma.product.findUnique({
                        where:{id:item.productId}
                    });
                    if(!product) continue;
                    totalWeight+= product.weight * item.quantity
                    totalPrice+=product.price*item.quantity
                };
                const shippingFee = Math.round(shippingRate.baseFee+(totalWeight*shippingRate.perKgFee));
          
                   const bounsAmount= await prisma.refWallet.findFirst({
                    where:{userId},
                    select:{amount:true}
                });
                 const bonus= bounsAmount?bounsAmount.amount:0
                 const payment= await prisma.payment.create({
                    data:{
                       
                        status:'PAID',
                        amount:Math.round((totalPrice-bonus)+shippingFee),
                        currency:'PHP',
                        transactionId:(await genTrxCode()).toString(),
                        paymentmethod:'CARD'
                    }
                });


                 const order= await prisma.order.create({
                     data:{totalPrice:(totalPrice-bonus)+shippingFee, address:{connect:{id:Number(addressId)}},  user:{connect:{id:Number(userId)}}, payment:{connect:{id:Number(payment.id)}}, 
                     status:'CONFIRMED',
                    items:{
                    create: cart.items.map((item)=>({
                        product:{connect:{id:item.productId}} ,
                        quantity:item.quantity,
                        unitPrice:item.unitPrice,
                        totalPrice:Math.round(parseFloat(item.quantity*item.unitPrice)),
                        size:item.size,
                        color:item.color,
                        variant:item.variant
                    }))
                }},
                include:{items:true}
            });

              const existingWallet= await prisma.refWallet.findFirst({
                where:{userId}
            });
            if(existingWallet){
                 await prisma.refWallet.update({
                    where:{userId},
                    data:{amount:0}
                });
            }

             const existingOrder= await prisma.order.findMany({
                    where:{userId}
                });
                  const referredByUser= await prisma.user.findUnique({
                    where:{id:userId},
                    select:{ referredBy:true}
                  })
                  if(referredByUser.referredBy){
                  const referrer = await prisma.user.findUnique({
                 where: { referralCode: referredByUser.referredBy }, 
                  select: { id: true }
                     });
                      const referredId= parseInt(referrer.id)

         if(existingOrder.length ===1 && referredByUser.referredBy&& payment.status==='PAID'&&payment.paymentmethod==='CARD'){
                    let wallet= await prisma.refWallet.findFirst({
                        where:{userId:referredId}
                    });
                    if(!wallet){wallet= await prisma.refWallet.create({
                        data:{userId:referredId, amount:0}
                    })}
                       
                    await prisma.refWallet.update({
                    where:{id:wallet.id},
                    data:{amount:parseFloat(wallet.amount+50)}
                });
                let ownWallet= await prisma.refWallet.findFirst({
                  where:{userId}
                });
                if(!ownWallet){ownWallet=await prisma.refWallet.create({
                  data:{userId,amount:0}
                })}
                await prisma.refWallet.update({
                  where:{id:ownWallet.id},
                  data:{amount:parseFloat(ownWallet.amount+50)}
                })
              };

                };
                
               

                await prisma.cart.update({
                    where:{id:cart.id},
                    data:{status:'COMPLETED'}
                });
      

      }
   
            
    } catch (err) {
      console.error('❌ Failed to update user:', err.message);
    }
  

  res.json({ received: true });
});

module.exports=route