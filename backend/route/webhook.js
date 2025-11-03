const express=require('express');
const route=express.Router();
const stripe=require('stripe')
(process.env.STRIPE_SECRATE_KEY);
const prisma=require('../utils/prisma');

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata.userId);
    const paymentId=Number(session.metadata.paymentId);
    const orderId=Number(session.metadata.orderId);

    if (!userId) {
      return res.status(400).send("Invalid user ID in metadata.");
    }
     if (!paymentId) {
      return res.status(400).send("Invalid payment ID in metadata.");
    }
     if (!orderId) {
      return res.status(400).send("Invalid order ID in metadata.");
    }


    try {
                const user= await prisma.user.findUnique({
                    where:{id:userId},
                    select:{referredBy:true}
                });
           
                const payment= await prisma.payment.findFirst({
                    where:{id:paymentId}
                });
              const updatePaymentStatus=  await prisma.payment.update({
                    where:{id:payment.id},
                    data:{status:'PAID'}
                });
                await prisma.order.update({
                    where:{id:orderId},
                    data:{status:'CONFIRMED'}
                })
              const existingOrder= await prisma.order.findMany({
                    where:{userId}
                });
                  const referrer = await prisma.user.findUnique({
                 where: { referralCode: user.referredBy }, 
                  select: { id: true }
                     });
                const referredId= parseInt(referrer.id)

         if(existingOrder.length <=1 && user.referredBy&& updatePaymentStatus.status==='PAID'&&payment.paymentmethod==='CARD'){
                    let wallet= await prisma.refWallet.findFirst({
                        where:{userId:referredId}
                    });
                    if(!wallet){wallet= await prisma.refWallet.create({
                        data:{userId:referredId, amount:0}
                    })}
                       
                    await prisma.refWallet.update({
                    where:{id:wallet.id},
                    data:{amount:parseFloat(wallet.amount+50)}
                })
                };
     
     
    

      console.log('✅ Premium user upgraded:', userId);
    } catch (err) {
      console.error('❌ Failed to update user:', err.message);
    }
  }

  res.json({ received: true });
});

module.exports=route