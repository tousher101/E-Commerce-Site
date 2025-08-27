const express=require('express');
const route=express.Router();
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuth');
const prisma=require('../utils/prisma');
const cloudinary=require('../utils/cloudinary');
const upload =require('../middle-wear/multar');



// Upload Profile Photo
route.post('/uploadprofilephoto',verification,roleAuthorize('USER'),upload('photo'),async(req,res)=>{
try{
    const {photo}=req.file
    const user= await prisma.user.findUnique({
        where:{id:Number(req.user.id)}
    });
    if(!user){return res.status(404).json({msg:'User Not Found'})}
    if(user?.publicId){await cloudinary.uploader.destroy(user.publicId)}
   const result= await cloudinary.uploader.upload(photo.path,{
        folder:'E-Commerce/user-Profile',
        width: 80,
        height:80,
        crop:'fit'
    });
    await prisma.user.update({
        where:{id:Number(req.user.id)},
        data:{photo:result.secure_url, publicId:result.public_id}
    });
    const fs=require('fs');
    fs.unlink(req.file.path, (err)=>{if(err)console.error(err);})
    res.status(200).json({msg:'Profile photo uploaded successfuly'})
}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Get User Information
route.get('/userinfo',verification,roleAuthorize('USER'), async(req,res)=>{
    try{
        const user= await prisma.user.findUnique({
            where:{id:Number(req.user.id)}
        });
        if(!user){return res.status(404).json({msg:'User Not Found'})}
        const userInfo= await prisma.user.findUnique({
            where:{id:Number(req.user.id)},
            select:{
                name:true,
                email:true,
                phone:true,
                photo:true,
                role:true,
                orders:true,
                carts:true,
                address:true,

            }
        })
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
})


module.exports=route