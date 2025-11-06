const express=require('express');
const route=express.Router();
const {body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma=require('../utils/prisma')
const ACCESS_TOKEN_SECRATE=process.env.JWT_ACCESS_SECRATE
const REFRESH_TOKEN_SECRATE= process.env.JWT_REFRESH_SECRATE
const verification=require('../middle-wear/verification')
const refCodeGen = require('../utils/refCodeGen');


//Create User/SignUp
route.post('/createuser',[body('email','Enter Valid Email').isEmail(), body('name','Enter Valid Name').isLength({min:3}),
body('password', 'Enter Valid Password').isLength({min:5}), body('phone').isLength({max:10,min:10})],async(req,res)=>{
    const errors = validationResult(req); 
        if (!errors.isEmpty()) {
         return res.status(400).json({ msg: 'Something Went Wrong. Check Your Information', errors: errors.array() });}
         try{
          
            const {name,email,password,phone,referralCode}=req.body;
            const dupUser= await prisma.user.findFirst({
                where:{OR:[{email},{phone}]}
            });
            if(dupUser){return res.status(400).json({msg:'User Already Exisit'})};
            const salt= await bcrypt.genSalt(8);
            const secPass = await bcrypt.hash(password,salt);
            const userCount= await prisma.user.count();
            const adminCount=userCount===0?'ADMIN':'USER';
            const myReferralCode= await refCodeGen(prisma,name);
            let referredBy=null;
            if(referralCode){
                const refUser= await prisma.user.findUnique({
                    where:{referralCode}
                });
                if(refUser){referredBy=refUser.referralCode}
            }
            const newUser=await prisma.user.create({
                data:{name, email,password:secPass, phone, role:adminCount,referralCode:myReferralCode,
                    referredBy
                }
            });
        
          return  res.status(200).json({msg:'Account Create Successfully'})
         }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//Login With Valid User:
route.post('/signin',[body('email','Enter Valid Email').isEmail(), body('password', 'Password Cannot be Blank').exists()], 
async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user= await prisma.user.findUnique({
            where:{email}
        });
        if(!user){return res.status(404).json({msg:'User Not Found'})};
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){return res.status(400).json({msg:'Invalid Email or Password'})};
        const payload = {id:user.id, role:user.role};
        const accessToken=jwt.sign(payload,ACCESS_TOKEN_SECRATE,{expiresIn:'15m'});
        const refreshToken= jwt.sign(payload, REFRESH_TOKEN_SECRATE,{expiresIn:'7d'})
        res.cookie('refreshToken',refreshToken,{httpOnly:true, secure: false //true in Production
            ,sameSite: 'lax', //'none' in production
        path:'/', maxAge: 7 * 24 * 60 * 60 * 1000})
       return res.status(200).json({accessToken, role:user.role})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//Refresh Token Route
route.post('/refresh', async(req,res)=>{
    try{
        const refreshToken= req.cookies.refreshToken
        if(!refreshToken){return res.status(401).json({msg:'No Refresh Token'})}
         const decode= jwt.verify(refreshToken,REFRESH_TOKEN_SECRATE)
         const payload= {id:decode.id, role:decode.role}
            
        
        const accessToken=jwt.sign(payload,ACCESS_TOKEN_SECRATE,{expiresIn:'15m'});
      return  res.status(200).json({accessToken})

    }catch(err){console.error(err); return res.status(403).json({msg: 'Invalid Refresh Token'})}
});

// LogOut for valid user
route.post('/logout', async(req,res)=>{
    try{
        res.clearCookie("refreshToken",{
            httpOnly:true,
             secure: false, //true in Production
            sameSite: 'lax', //'none' in production
            path:'/'
        });
      return  res.status(200).json({msg:'Logout Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
})

//Secrate add admin
route.put('/addadmin', async(req,res)=>{
    const {name,email,password,secretCode,phone}=req.body
      if (secretCode !== process.env.ADMIN_SECRET_CODE) {
    return res.status(401).json({ msg: "❌ Invalid admin secret code!" });}
   
    const existing = await prisma.user.findFirst({ where: {OR:[ {email}, {phone} ]} });
  if (existing) {
    return res.status(401).json({ msg: "⚠️ User with this email or phone already exists." });}
     const myReferralCode= await refCodeGen(prisma,name);
    const salt= await bcrypt.genSalt(10)
                const secPass=await bcrypt.hash(password,salt)
                    await prisma.user.create({ data:{
                    name, email, phone,password:secPass, role:'ADMIN', referralCode:myReferralCode }});
              return  res.status(201).json({msg:'Admin create success fully'})
   
});

//change password
route.put('/changepassword',verification,async(req,res)=>{
   
    try{
    const {newPassword,currentPassword}=req.body
    
    const user = await prisma.user.findUnique({
        where:{id: req.user.id},
    });
  
    const decodePassword= await bcrypt.compare(currentPassword,user.password)
    if(!decodePassword){return res.status(400).json({msg:'Current Password Not Match'})}
    if(!user){return res.status(404).json({msg:'User not found'})}
    const salt= await bcrypt.genSalt(8);
    const secPass= await bcrypt.hash(newPassword,salt)
    await prisma.user.update({
        where:{id:user.id},
        data:{password:secPass}
    });
   return res.status(200).json({msg:'Password changed Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



module.exports=route