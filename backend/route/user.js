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
});

//get all Product
route.get('/allproduct', async(req,res)=>{
    try{
        const totalProduct= await prisma.product.count();
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||15;
        const getAllProduct= await prisma.product.findMany({
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true,
                photos:true,
                size:true,
                color:true,
                category:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}

        });
        res.status(200).json({getAllProduct, totalProduct, totalPage:Math.ceil(totalProduct/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//getproduct By Category
//category: Mens Fashion
route.get('/mensfashion',async(req,res)=>{
    try{
        const totalMensProduct= await prisma.product.count({
            where:{category:'MENSFASHION'}
        });
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||15;
        const getMensProduct= await prisma.product.findMany({
            where:{category:'MENSFASHION'},
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true,
                photos:true,
                size:true,
                color:true,
                category:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({getMensProduct, totalMensProduct, totalPage:Math.ceil(totalMensProduct/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//category: Women Fashion
route.get('/womenfashion',async(req,res)=>{
    try{
        const totalMensProduct= await prisma.product.count({
            where:{category:'WOMENFASHION'}
        });
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||15;
        const getMensProduct= await prisma.product.findMany({
            where:{category:'WOMENFASHION'},
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true,
                photos:true,
                size:true,
                color:true,
                category:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({getMensProduct, totalMensProduct, totalPage:Math.ceil(totalMensProduct/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//category: Kids Fashion
route.get('/kidsfashion',async(req,res)=>{
    try{
        const totalMensProduct= await prisma.product.count({
            where:{category:'KIDSFASHION'}
        });
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||15;
        const getMensProduct= await prisma.product.findMany({
            where:{category:'KIDSFASHION'},
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true,
                photos:true,
                size:true,
                color:true,
                category:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({getMensProduct, totalMensProduct, totalPage:Math.ceil(totalMensProduct/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//category: Accessories
route.get('/accessories',async(req,res)=>{
    try{
        const totalMensProduct= await prisma.product.count({
            where:{category:'ACCESSORIES'}
        });
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||15;
        const getMensProduct= await prisma.product.findMany({
            where:{category:'ACCESSORIES'},
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true,
                photos:true,
                size:true,
                color:true,
                category:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({getMensProduct, totalMensProduct, totalPage:Math.ceil(totalMensProduct/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//category: Perfume
route.get('/perfume',async(req,res)=>{
    try{
        const totalMensProduct= await prisma.product.count({
            where:{category:'PERFUME'}
        });
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||15;
        const getMensProduct= await prisma.product.findMany({
            where:{category:'PERFUME'},
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                createdAt:true,
                updatedAt:true,
                photos:true,
                size:true,
                color:true,
                category:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({getMensProduct, totalMensProduct, totalPage:Math.ceil(totalMensProduct/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


module.exports=route