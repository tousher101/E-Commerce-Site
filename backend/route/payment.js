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
        const {location,addressId}=req.body;
        const userId=req.user.id;
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
                    where:{id:addressId}
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
                       
                        status:'UNPAID',
                        amount:Math.round((totalPrice-bonus)+shippingFee),
                        currency:'PHP',
                        transactionId:(await genTrxCode()).toString(),
                        paymentmethod:'CARD'
                    }
                });


                 const order= await prisma.order.create({
                     data:{totalPrice:(totalPrice-bonus)+shippingFee, address:{connect:{id:Number(addressId)}},  user:{connect:{id:Number(userId)}}, payment:{connect:{id:Number(payment.id)}}, 
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

                await prisma.cart.update({
                    where:{id:cart.id},
                    data:{status:'COMPLETED'}
                });
                   const existingWallet= await prisma.refWallet.findFirst({
                where:{userId}
            });
            if(existingWallet){
                 await prisma.refWallet.update({
                    where:{userId:user.referredBy},
                    data:{amount:0}
                });
            }

               

                const paymentAmount= await prisma.payment.findUnique({
            where:{id:payment.id},
            select:{amount:true},
        })
    

        const session= await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode:'payment',
            line_items: [
        {
          price_data: {
            currency: 'php',
            product_data: {
              name: 'e-Commarce Payment'
            },
            unit_amount: paymentAmount?.amount*100
            
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user?.id?.toString() || '0',
        paymentId:payment?.id?.toString(),
        orderId:order?.id?.toString()
      },
    
      success_url: 'http://localhost:3000/paymentsuccess',
      cancel_url: 'http://localhost:3000/paymentfaild',
        });
         res.json({ url: session.url });
    }catch(err){console.error(err); res.status(500).json({msg: 'Stripe session creation failed'})}
});

module.exports=route
