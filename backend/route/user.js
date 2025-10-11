const express=require('express');
const route=express.Router();
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuth');
const prisma=require('../utils/prisma');
const cloudinary=require('../utils/cloudinary');
const upload =require('../middle-wear/multar');



// Upload Profile Photo
route.post('/uploadprofilephoto',verification,roleAuthorize('USER'),upload.single('photo'),async(req,res)=>{
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

//get all Product/ use on card
route.get('/allproduct', async(req,res)=>{
    try{
        const totalProduct= await prisma.product.count();
        const page= Number(req.query.page)||1;
        const skip= (page-1)*limit
        const limit=Number(req.query.limit)||30;
        const getAllProduct= await prisma.product.findMany({
            select:{
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                _count:{
                    select:{comment:true}
                },
                _sum:{
                    orderItem:{
                        quantity:true
                    }
                }
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

//DeshBoard (user)
    //count all orderStatus
    route.get('/allcount',verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            const totalPendingOrder= await prisma.order.count({
                where:{user:user.id, status:'PENDING'}
            });
            const totalConfirmedOrder= await prisma.order.count({
                where:{user:user.id, status:'CONFIRMED'}
            });
            const totalShippedOrder= await prisma.order.count({
                where:{user:user.id, status:'SHIPPED'}
            });
            const totalDeliveredOrder= await prisma.order.count({
                where:{user:user.id, status:'DELIVERED'}
            });
            const totalCancelOrder= await prisma.order.count({
                where:{user:user.id, status:'CANCELLED'}
            });
            res.status(200).json({totalPendingOrder,totalShippedOrder,totalCancelOrder, totalConfirmedOrder,totalDeliveredOrder})
        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

    //get all pending order
    route.get('/allpendingorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalPendingOrder=await prisma.order.count({
                where:{user:user.id, status:'PENDING'}
            });
            const page=Number(req.query.page) ||1;
            const limit=Number(req.query.limit) ||15;
            const skip=(page-1)*limit
            const pendingOrder= await prisma.order.findMany({
                where:{user:user.id, status:'PENDING'},
                select:{
                    id:true,
                    items:true,
                    total:true,
                    status:true,
                    address:true,
                    createdAt:true,
                    shippingFee:true,
                    payment:{
                        select:{
                            paymentmethod:true,
                            status:true
                        }
                    }

                },
                take:limit,
                skip:skip,
                orderBy:{createdAt:'desc'}
            });
            res.status(200).json({totalPendingOrder, pendingOrder, totalPage:Math.ceil(totalPendingOrder/limit)})

        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

    //get confirmd Order
    route.get('/allconfirmedorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalconfirmedOrder=await prisma.order.count({
                where:{user:user.id, status:'CONFIRMED'}
            });
            const page=Number(req.query.page) ||1;
            const limit=Number(req.query.limit) ||15;
            const skip=(page-1)*limit
            const confirmedOrder= await prisma.order.findMany({
                where:{user:user.id, status:'CONFIRMED'},
                select:{
                    id:true,
                    items:true,
                    total:true,
                    status:true,
                    address:true,
                    createdAt:true,
                    shippingFee:true,
                    payment:{
                        select:{
                            paymentmethod:true,
                            status:true
                        }
                    }

                },
                take:limit,
                skip:skip,
                orderBy:{createdAt:'desc'}
            });
            res.status(200).json({totalconfirmedOrder, confirmedOrder, totalPage:Math.ceil(totalConfirmedOrder/limit)})

        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

    //get Shipped order
    route.get('/allshippedorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalShippedOrder=await prisma.order.count({
                where:{user:user.id, status:'SHIPPED'}
            });
            const page=Number(req.query.page) ||1;
            const limit=Number(req.query.limit) ||15;
            const skip=(page-1)*limit
            const shippedOrder= await prisma.order.findMany({
                where:{user:user.id, status:'SHIPPED'},
                select:{
                    id:true,
                    items:true,
                    total:true,
                    status:true,
                    address:true,
                    createdAt:true,
                    shippingFee:true,
                    payment:{
                        select:{
                            paymentmethod:true,
                            status:true
                        }
                    }

                },
                take:limit,
                skip:skip,
                orderBy:{createdAt:'desc'}
            });
            res.status(200).json({totalShippedOrder, shippedOrder, totalPage:Math.ceil(totalShippedOrder/limit)})

        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

    //get Deliverd Order
    route.get('/alldeliveredorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalDeliveredOrder=await prisma.order.count({
                where:{user:user.id, status:'DELIVERED'}
            });
            const page=Number(req.query.page) ||1;
            const limit=Number(req.query.limit) ||15;
            const skip=(page-1)*limit
            const deliveredOrder= await prisma.order.findMany({
                where:{user:user.id, status:'SHIPPED'},
                select:{
                    id:true,
                    items:true,
                    total:true,
                    status:true,
                    address:true,
                    createdAt:true,
                    shippingFee:true,
                    payment:{
                        select:{
                            paymentmethod:true,
                            status:true
                        }
                    }

                },
                take:limit,
                skip:skip,
                orderBy:{createdAt:'desc'}
            });
            res.status(200).json({totalDeliveredOrder, deliveredOrder, totalPage:Math.ceil(totalDeliveredOrder/limit)})

        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

    //get Cancelled Order
      route.get('/allcancelledorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalCancelledOrder=await prisma.order.count({
                where:{user:user.id, status:'CANCELLED'}
            });
            const page=Number(req.query.page) ||1;
            const limit=Number(req.query.limit) ||15;
            const skip=(page-1)*limit
            const cancelleddOrder= await prisma.order.findMany({
                where:{user:user.id, status:'CANCELLED'},
                select:{
                    id:true,
                    items:true,
                    total:true,
                    status:true,
                    address:true,
                    createdAt:true,
                    shippingFee:true,
                    payment:{
                        select:{
                            paymentmethod:true,
                            status:true
                        }
                    }

                },
                take:limit,
                skip:skip,
                orderBy:{createdAt:'desc'}
            });
            res.status(200).json({totalCancelledOrder, cancelleddOrder, totalPage:Math.ceil(totalCancelledOrder/limit)})

        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });


    // Add to Cart Product
    route.post('/addtocart',verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const {productId, userId, size, color, quantity}=req.body
            let cart= await prisma.cart.findFirst({where:{userId, status:'PENDING'}});
            if(!cart){cart=await prisma.cart.create({where:{userId, status:'PENDING'}})};
            const existingItem = await prisma.cartItem.findFirst({
                where:{
                    cartId:cart.id,
                    productId,
                    size,
                    color
                }
            });
            if(existingItem){await prisma.cartItem.update({
                where:{id:existingItem.id},
                data:{quantity:existingItem.quantity+quantity}
            })} else{const product = await prisma.product.findUnique({
                where:{id:productId}
            });
             await prisma.cartItem.create({
                data:{
                    cartId:cart.id,
                    productId,
                    size,
                    color,
                    quantity,
                    unitPrice: product.price,
                    totalPrice: product.price*quantity
                }
            });
        }
        const totalCartItems= await prisma.cartItem.count({
            where:{cartId:cart.id, status:'PENDING'}
        })
       res.status(200).json({msg:'Add to cart', totalCartItems})


        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

    //get all cart items
    route.get('/getallcartitems', verification, roleAuthorize('USER'),async(req,res)=>{
        try{
            const cartItems= await prisma.cart.findFirst({
                where:{userId:req.user.id, status:'PENDING'},
                select:{
                    id:true,
                    items: true,
                    createdAt:true,
                    updatedAt:true,
                }
            });
            if(!cartItems){return res.status(404).json({msg:'Cart Not Found'})}
            res.status(200).json({cartItems})
        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });


    //Create Order
    route.post('/checkout', verification, roleAuthorize('USER'), async(req,res)=>{
        try{
            const {location, paymentmethod}=req.body
            const userId=req.user.id
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

            const order= await prisma.order.create({
                data:{userId,totalPrice:totalPrice+shippingFee, status:'PENDING', addressId:address.id,
                    paymentStatus:'UNPAID',paymentmethod,
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

            res.status(200).json({msg:'Order Placed Successfully', orderId:order.id, address, shippingFee, paymentmethod, order})


        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });

// Preview Checkout

  route.get('/checkoutpreview', verification, roleAuthorize('USER'), async(req,res)=>{
        try{
            const {location}=req.params
            const userId=req.user.id

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
            let subtotal=0
            for(const item of cart.items){
                const product =await prisma.product.findUnique({
                    where:{id:item.productId}
                });
                if(!product) continue;
                totalWeight+= product.weight * item.quantity
                subtotal+=product.price*item.quantity
            };
            let shippingFee=0;
            const shippingRate= await prisma.shippingRate.findFirst({
                where:{location}
            });
           if(shippingRate){shippingFee = shippingRate.baseFee + (totalWeight * shippingRate.perKgFee)}
           else{res.status(400).json({msg:'Shipping Not Available for This Area'})}

            res.status(200).json({items:cart.items, shippingFee, address, total:subtotal+shippingFee})


        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    });














    //get All Shipping Fee
route.get('/getshippingfee', verification, roleAuthorize('USER'),async(req,res)=>{
    try{
        const rate= await prisma.shippingRate.findMany();
        res.status(200).json({rate})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
})

    //payment intigration (Stripe)


module.exports=route