const express=require('express');
const route=express.Router();
const stripe=require('stripe')
(process.env.STRIPE_SECRATE_KEY);
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuthorize');


//Stripe Intigration
route.post('/create-checkout-session',verification,roleAuthorize('USER'), async(req,res)=>{
    try{
        const {location,addressId, paymentAmount}=req.body;
          const userId=req.user.id;
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
            unit_amount: Number(paymentAmount)*100
            
          },
          quantity: 1,
        },
      ],
      metadata: {
        location: String(location) ,
        addressId: String(addressId),
        userId:String(userId)
      },
    
      success_url: 'https://touchandtake.onrender.com/paymentsuccess',
      cancel_url: 'https://touchandtake.onrender.com/paymentfaild',
        });
         res.json({ url: session.url });
    }catch(err){console.error(err); res.status(500).json({msg: 'Stripe session creation failed'})}
});

module.exports=route
