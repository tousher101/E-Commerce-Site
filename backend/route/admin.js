const express=require('express');
const route=express.Router();
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuth');
const prisma=require('../utils/prisma');
const cloudinary=require('../utils/cloudinary');
const upload =require('../middle-wear/multar');




//Add Product By Admin
route.post('/addproduct',verification,roleAuthorize('ADMIN'),upload.array('photos',5),async(req,res)=>{
const {name,description,price,stock,size,color, category}=req.body;
const photos=req.files

try{
    if(!name||!description||!price||!stock||!category||!photos){return res.status(400).json({msg:'Add All Required Field'})}
    const addproduct=await prisma.product.create({
        data:{name,description,price:parseFloat(price),stock:parseInt(stock,10),category, size, color}
    });
    for(const photo of photos){const result=await cloudinary.uploader.upload(photo.path,{
        folder:'E-Commerce/Product-Photos',
        width:300,
        height:300,
        crop:'fit'
    });
    await prisma.productphotos.create({
        data:{url:result.secure_url, publicId:result.public_id,productId:addproduct.id}
    });
        const fs=require('fs/promises');
      try{
        await fs.unlink(file.path);
      }catch(error){console.warn('File not found or already deleted');}
};
 res.status(200).json({msg:'Product Added Successfully'})

}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Delete Product
route.delete('/deleteproduct/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId= Number(req.params.id)
        const product= await prisma.product.findUnique({
            where:{id:productId}
        });
        if(!product){return res.status(404).json({msg:'Product Not Found'})}
        const photos= await prisma.productphotos.findUnique({
            where:{productId}
        });
        for(const photo of photos){await cloudinary.uploader.destroy(photo.publicId)};
        await prisma.productphotos.deleteMany({
            where:{productId}
        });
        await prisma.product.delete({
            where:{id:productId}
        });
        res.status(200).json({msg:'Product Deleted Sucessfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Edit Product
route.put('/editproduct/:id', verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId=Number(req.params.id)
        const {name,description,price,stock,size,color}=req.body
        if(!productId){return res.status(404).json({msg:'Product Not Found'})}
        await prisma.product.update({
            where:{id:productId},
            data:{name,description,price:parseFloat(price),stock:parseInt(stock,10),size,color}
        });
        res.status(200).json({msg:'Product Edit Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//count all order status
route.get('/countorderstatus',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const totalPendingOrder= await prisma.order.count({
            where:{status:'PENDING'}
        });
        const totalShippedOrder= await prisma.order.count({
            where:{status:'SHIPPED'}
        });
        const totalDeliveredOrder=await prisma.order.count({
            where:{status:'DELIVERED'}
        });
        const totalCancelOrder=await prisma.order.count({
            where:{status:'CANCELLED'}
        });
        res.status(200).json({totalPendingOrder,totalShippedOrder,totalDeliveredOrder,totalCancelOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get order Request
route.get('/getorderrequest',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const totalReq= await prisma.order.count({
            where:{status:'PENDING'}
        });
        const orderReq= await prisma.order.findMany({
            where:{status:'PENDING'},
            select:{
                id:true,
                address:true,
                createdAt:true,
                items:true,
                total:true,
                    user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    payment:{
                        select:{
                            id:true,
                            status:true,
                            amount:true,
                            paymentmethod:true
                        }
                    }
                }
            
        });
        res.status(200).json({orderReq, totalReq})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//accepet Order
route.put('/acceptorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);
        const order=await prisma.order.findUnique({
            where:{id:orderId}
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}
        await prisma.order.update({
            where:{id:order, status:'PENDING'},
            data:{status:'CONFIRMED'}
        });
        res.status(200).json({msg:'Order Confirmed Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Cancel Order
route.put('/cancelorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);
        const order=await prisma.order.findUnique({
            where:{id:orderId}
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}
        await prisma.order.update({
            where:{id:order, status:'PENDING'},
            data:{status:'CANCELLED'}
        });
        res.status(200).json({msg:'Order Cancel Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Shipped Order
route.put('/shippedorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);
        const order=await prisma.order.findUnique({
            where:{id:orderId}
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}
         await prisma.order.update({
            where:{id:order, status:'PENDING'},
            data:{status:'SHIPPED'}
        });
        res.status(200).json({msg:'Order Shipped Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Delivered Order
route.put('/deliverdorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);
        const order=await prisma.order.findUnique({
            where:{id:orderId}
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}
        await prisma.order.update({
            where:{id:order, status:'PENDING'},
            data:{status:'DELIVERED'}
        });
        res.status(200).json({msg:'Order Delivered Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get all confirmed order
route.get('/getconfirmedorder',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const totalConOrder= await prisma.order.count({
            where:{status:'CONFIRMED'}
        });
        const conOrder= await prisma.order.findMany({
            where:{status:'CONFIRMED'},
            select:{
                id:true,
                address:true,
                createdAt:true,
                items:true,
                total:true,
                    user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    payment:{
                        select:{
                            id:true,
                            status:true,
                            amount:true,
                            paymentmethod:true
                        }
                    }
                }
            
        });
        res.status(200).json({totalConOrder, conOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get Shipped Order
route.get('/getshippedorder',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const totalShippedOrder= await prisma.order.count({
            where:{status:'SHIPPED'}
        });
        const shippedOrder= await prisma.order.findMany({
            where:{status:'SHIPPED'},
            select:{
                id:true,
                address:true,
                createdAt:true,
                items:true,
                total:true,
                    user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    payment:{
                        select:{
                            id:true,
                            status:true,
                            amount:true,
                            paymentmethod:true
                        }
                    }
                }
            
        });
        res.status(200).json({totalShippedOrder, shippedOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get all delivered order
route.get('/getdeliveredorder',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const totalDelOrder= await prisma.order.count({
            where:{status:'DELIVERED'}
        });
        const delOrder= await prisma.order.findMany({
            where:{status:'DELIVERED'},
            select:{
                id:true,
                address:true,
                createdAt:true,
                items:true,
                total:true,
                    user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    payment:{
                        select:{
                            id:true,
                            status:true,
                            amount:true,
                            paymentmethod:true
                        }
                    }
                }
            
        });
        res.status(200).json({delOrder, totalDelOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get Cancel Order
route.get('/getcancelorder',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const totalCanOrder= await prisma.order.count({
            where:{status:'CANCELLED'}
        });
        const canOrder= await prisma.order.findMany({
            where:{status:'CANCELLED'},
            select:{
                id:true,
                address:true,
                createdAt:true,
                items:true,
                total:true,
                    user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    payment:{
                        select:{
                            id:true,
                            status:true,
                            amount:true,
                            paymentmethod:true
                        }
                    }
                }
            
        });
        res.status(200).json({canOrder, totalCanOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

// review product
route.post('/reviewproduct/:id',verification, async(req,res)=>{
    try{
       const {comment}=req.body;
       if(!comment){return res.status(400).json({msg:'Invalid Comment'})};
        const user= await prisma.user.findUnique({
            where:{id:Number(req.user.id)}
        });
        if(!user){return res.status(404).json({msg:'User Not Found'})};
        const product=await prisma.product.findUnique({
            where:{id:Number(req.params.id)}
        });
        if(!product){return res.status(404),json({msg:'Product Not Found'})};
        await prisma.coment.create({
            data:{comment, productId:product.id, userId:user.id}
        });
        res.status(200).json({msg:'Comment Added Successfully'})

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Delete Review By Admin
route.delete('/deletereview/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const commentId=Number(req.params.id);
        const comment= await prisma.comment.findUnique({
            where:{id:commentId}
        })
        if(!comment){return res.status(404).json({msg:'Commnet Not Found'})};
        await prisma.comment.delete({
            where:{id:commentId}
        });
        res.status(200).json({msg:'Comment Delete Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Get All Comment
route.get('/getallcomment/:id',async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const skip=(page-1)*limit;
        const limit=Number(req.query.limit) ||10;
        const productId=Number(req.params.id)
        const totalComment= await prisma.comment.count({
            where:{productId}
        });
        const allcomment= await prisma.comment.findMany({
            where:{productId},
            select:{
                id:true,
                comment:true,
                createdAt:true,
                user:{
                    select:{
                        name:true,
                        photo:true,
                        role: true,
                    }
                }
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({allcomment, totalComment, totalPage:Math.ceil(totalComment/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


module.exports=route