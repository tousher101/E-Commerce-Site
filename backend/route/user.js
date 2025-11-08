const express=require('express');
const route=express.Router();
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuthorize');;
const prisma=require('../utils/prisma');
const cloudinary=require('../utils/cloudinary');
const upload =require('../middle-wear/multar');
const genTrxCode=require('../utils/genTrxCode')





// Upload Profile Photo
route.post('/uploadprofilephoto',verification,roleAuthorize('USER','ADMIN'),upload.single('photo'),async(req,res)=>{
try{
    const photo=req.file
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
  return  res.status(200).json({msg:'Profile photo uploaded successfuly'})
}catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
});


//Get User Information
route.get('/userinfo',verification, async(req,res)=>{
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
                referralCode:true

            }
        });
     return   res.status(200).json({userInfo})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get all Product/ use on card
route.get('/allproduct', async(req,res)=>{
    try{
        const totalProduct= await prisma.product.count();
        const page= Number(req.query.page)||1;
         const limit=Number(req.query.limit)||28;
        const skip= (page-1)*limit
        const getAllProduct= await prisma.product.findMany({
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                },
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        for(let product of getAllProduct){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        }

    return  res.status(200).json({ getAllProduct, totalPage:Math.ceil(totalProduct/limit)})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get product/Details
route.get('/productdetails/:id',async(req,res)=>{
    try{
        const productId=Number(req.params.id)
        const productDetails= await prisma.product.findUnique({
            where:{id:productId},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                originalPrice:true,
                size:true,
                color:true,
                variant:true,
                weight:true
            }
        });

   
      return  res.status(200).json({productDetails})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//getproduct By Category
//category: Mens Fashion/Card
route.get('/mensfashion',async(req,res)=>{
    try{
        const totalMensProduct= await prisma.product.count({
            where:{category:'MENSFASHION'}
        });
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||16;
        const skip= (page-1)*limit
        const getMensProduct= await prisma.product.findMany({
            where:{category:'MENSFASHION'},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                }   
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
             for(let product of getMensProduct){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        }
     return   res.status(200).json({getMensProduct, totalMensProduct, totalPage:Math.ceil(totalMensProduct/limit)})
    }catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
});



//category: Women Fashion/card
route.get('/womenfashion',async(req,res)=>{
    try{
        const totalWomensProduct= await prisma.product.count({
            where:{category:'WOMENFASHION'}
        });
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||16;
        const skip= (page-1)*limit
        const getWomensProduct= await prisma.product.findMany({
            where:{category:'WOMENFASHION'},
           select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                }
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
            for(let product of getWomensProduct){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        }
        
      return  res.status(200).json({getWomensProduct, totalWomensProduct, totalPage:Math.ceil(totalWomensProduct/limit)})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//category: Kids Fashion/card
route.get('/kidsfashion',async(req,res)=>{
    try{
        const totalKidsProduct= await prisma.product.count({
            where:{category:'KIDSFASHION'}
        });
        const page= Number(req.query.page)||1;
         const limit=Number(req.query.limit)||16;
        const skip= (page-1)*limit
       
        const getKidsProduct= await prisma.product.findMany({
            where:{category:'KIDSFASHION'},
             select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                }
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

         for(let product of getKidsProduct){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        }
     return   res.status(200).json({getKidsProduct, totalKidsProduct, totalPage:Math.ceil(totalKidsProduct/limit)})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//category: Accessories/card
route.get('/accessories',async(req,res)=>{
    try{
        const totalAccessoriesProduct= await prisma.product.count({
            where:{category:'ACCESSORIES'}
        });
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||16;
        const skip= (page-1)*limit
        
        const getAccessoriesProduct= await prisma.product.findMany({
            where:{category:'ACCESSORIES'},
                 select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                }, 
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
         
        for(let product of getAccessoriesProduct){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        }
      return  res.status(200).json({getAccessoriesProduct, totalAccessoriesProduct, totalPage:Math.ceil(totalAccessoriesProduct/limit)})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//category: Perfume/card
route.get('/perfume',async(req,res)=>{
    try{
        const totalPerfumeProduct= await prisma.product.count({
            where:{category:'PERFUME'}
        });
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||16;
        const skip= (page-1)*limit
        
        const getPerfumeProduct= await prisma.product.findMany({
            where:{category:'PERFUME'},
               select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                },  
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        
        for(let product of getPerfumeProduct){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        }
       return res.status(200).json({getPerfumeProduct, totalPerfumeProduct, totalPage:Math.ceil(totalPerfumeProduct/limit)})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//DeshBoard (user)
    //count all orderStatus
    route.get('/allcount',verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            const totalPendingOrder= await prisma.order.count({
                where:{userId:user.id, status:'PENDING'}
            });
            const totalConfirmedOrder= await prisma.order.count({
                where:{userId:user.id, status:'CONFIRMED'}
            });
            const totalShippedOrder= await prisma.order.count({
                where:{userId:user.id, status:'SHIPPED'}
            });
            const totalDeliveredOrder= await prisma.order.count({
                where:{userId:user.id, status:'DELIVERED'}
            });
            const totalCancelOrder= await prisma.order.count({
                where:{userId:user.id, status:'CANCELLED'}
            });
            const totalPaidOrder= await prisma.order.count({
                where:{userId:user.id, payment:{status:'PAID'}}
            })
          return  res.status(200).json({totalPendingOrder,totalShippedOrder,totalCancelOrder, totalConfirmedOrder,totalDeliveredOrder,totalPaidOrder})
        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

    //get pending order/card
     route.get('/allpendingorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalPendingOrder=await prisma.order.count({
                where:{userId:user.id, status:'PENDING'}
            });
          
            const pendingOrder= await prisma.order.findMany({
                where:{userId:user.id, status:'PENDING'},
                select:{
                id:true,
                totalPrice:true,
                status:true,
                createdAt:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            product:{
                                select:{
                                    photos:true
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                            
                        }
                    }
            }
           
            });
          return  res.status(200).json({totalPendingOrder, pendingOrder})

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });
    
    

    //get all pending order/Details
    route.get('/pendingorderdetails/:id', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
                const orderId=Number(req.params.id)
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
          
            const pendingOrderDetails= await prisma.order.findFirst({
                where:{userId:user.id,id:orderId, status:'PENDING'},
                     select:{
                id:true,
                createdAt:true,
                address:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            id:true,
                         quantity:true,
                        unitPrice:true,
                        size:true,
                        variant:true,
                        color:true,
                            product:{
                                select:{
                                    name:true,
                                    photos:true,
                                    
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                             transactionId:true,
                             currency:true,
                             amount:true
                            
                        }
                    }
            }
           
            });
           
          return  res.status(200).json({ pendingOrderDetails, mode:'CheckOut'})

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });


    //get confirmed Order/card
     route.get('/allconfirmedorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalConfirmedOrder=await prisma.order.count({
                where:{userId:user.id, status:'CONFIRMED'}
            });
          
            const confirmedOrder= await prisma.order.findMany({
                where:{userId:user.id, status:'CONFIRMED'},
                select:{
                id:true,
                totalPrice:true,
                status:true,
                createdAt:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            product:{
                                select:{
                                    photos:true
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true
                        }
                    }
            }
           
            });
           return res.status(200).json({totalConfirmedOrder, confirmedOrder})

        }catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
    });


    
    
    //get confirmd Order/detais
    route.get('/confirmedorderdetails/:id', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const orderId=Number(req.params.id)
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
          
            const confirmedOrder= await prisma.order.findFirst({
                  where:{userId:user.id,id:orderId, status:'CONFIRMED'},
                     select:{
                id:true,
                createdAt:true,
                address:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            id:true,
                         quantity:true,
                        unitPrice:true,
                        size:true,
                        variant:true,
                        color:true,
                            product:{
                                select:{
                                    name:true,
                                    photos:true,
                                    
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                             transactionId:true,
                             currency:true,
                             amount:true
                            
                        }
                    }
                 }
              
            });
          return  res.status(200).json({confirmedOrder})

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

     //get shipped Order/card
     route.get('/allshippedorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const totalShippedOrder=await prisma.order.count({
                where:{userId:user.id, status:'SHIPPED'}
            });
          
            const shippedOrder= await prisma.order.findMany({
                where:{userId:user.id, status:'SHIPPED'},
                select:{
                id:true,
                totalPrice:true,
                status:true,
                createdAt:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            product:{
                                select:{
                                    photos:true
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true
                        }
                    }
            }
           
            });
          return  res.status(200).json({totalShippedOrder, shippedOrder})

        }catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
    });



    //get Shipped order/details
    route.get('/shippedorderdetails/:id', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
             const orderId=Number(req.params.id)
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const shippedOrder= await prisma.order.findFirst({
                where:{userId:user.id, id:orderId, status:'SHIPPED'},
                     select:{
                id:true,
                createdAt:true,
                address:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                        courier:{
                    select:{
                        courierName:true,
                        trakingNumber:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
                    items:{
                        select:{
                            id:true,
                         quantity:true,
                        unitPrice:true,
                        size:true,
                        variant:true,
                        color:true,
                            product:{
                                select:{
                                    name:true,
                                    photos:true,
                                    
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                             transactionId:true,
                             currency:true,
                             amount:true
                            
                        }
                    }
                 }
            });
           return res.status(200).json({ shippedOrder})

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

     //get delivered Order/card
     route.get('/alldeliveredorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}

             const page=Number( req.query.page) || 1;
            const limit=Number(req.query.limit) ||20;
            const skip=(page-1)*limit;
            const totalDeliveredOrder=await prisma.order.count({
                where:{userId:user.id, status:'DELIVERED'}
            });
          
            const deliveredOrder= await prisma.order.findMany({
                where:{userId:user.id, status:'DELIVERED'},
                select:{
                id:true,
                totalPrice:true,
                status:true,
                createdAt:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            product:{
                                select:{
                                    photos:true
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true
                        }
                    }
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
           
            });
           return res.status(200).json({totalDeliveredOrder, deliveredOrder, totalPage:Math.ceil(totalDeliveredOrder/limit)})

        }catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
    });

    
    
    //get Deliverd Order/details
    route.get('/deliveredorderdestials/:id', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const orderId=Number(req.params.id)
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const deliveredOrder= await prisma.order.findFirst({
                where:{userId:user.id,id:orderId, status:'DELIVERED'},
                 select:{
                id:true,
                createdAt:true,
                address:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                        courier:{
                    select:{
                        courierName:true,
                        trakingNumber:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
                    items:{
                        select:{
                            id:true,
                         quantity:true,
                        unitPrice:true,
                        size:true,
                        variant:true,
                        color:true,
                            product:{
                                select:{
                                    name:true,
                                    photos:true,
                                    
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                             transactionId:true,
                             currency:true,
                             amount:true
                            
                        }
                    }
                 }
            });
           return res.status(200).json({deliveredOrder })

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

    
     //get cancelled Order/card
     route.get('/allcancelledorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
             const page= Number(req.query.page) || 1;
            const limit=Number(req.query.limit) ||20;
            const skip=(page-1)*limit;
            const totalCancelledOrder=await prisma.order.count({
                where:{userId:user.id, status:'CANCELLED'}
            });
          
            const cancelledOrder= await prisma.order.findMany({
                where:{userId:user.id, status:'CANCELLED'},
                select:{
                id:true,
                totalPrice:true,
                status:true,
                createdAt:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            product:{
                                select:{
                                    photos:true
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true
                        }
                    }
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
           
            });
           return res.status(200).json({totalCancelledOrder,cancelledOrder, totalPage:Math.ceil(totalCancelledOrder/limit)})

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });


    //get Cancelled Order/details
      route.get('/cancelledorderdetails/:id', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
                const orderId=Number(req.params.id)
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const cancelleddOrder= await prisma.order.findFirst({
                where:{userId:user.id,id:orderId, status:'CANCELLED'},
               select:{
                id:true,
                createdAt:true,
                address:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            id:true,
                         quantity:true,
                        unitPrice:true,
                        size:true,
                        variant:true,
                        color:true,
                            product:{
                                select:{
                                    name:true,
                                    photos:true,
                                    
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                             transactionId:true,
                             currency:true,
                             amount:true
                            
                        }
                    }
                 }
            });
           return res.status(200).json({ cancelleddOrder})

        }catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
    });


        //get Paid Order/card
     route.get('/allpaidorder', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}

            const page=Number( req.query.page) || 1;
            const limit=Number(req.query.limit) ||20;
            const skip=(page-1)*limit;
            const totalPaidOrder=await prisma.order.count({
                where:{userId:user.id,payment:{status:'PAID'} }
            });
          
            const paidOrder= await prisma.order.findMany({
                where:{userId:user.id,payment:{status:'PAID'} },
                select:{
                id:true,
                totalPrice:true,
                status:true,
                createdAt:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                    items:{
                        select:{
                            product:{
                                select:{
                                    photos:true
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status:true,
                             paymentmethod:true,
                             createdAt:true
                        }
                    }
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
           
            });
           return res.status(200).json({totalPaidOrder,paidOrder, totalPage:Math.ceil(totalPaidOrder/limit), mode:'PAID'})

        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

    //get paid Order/details
      route.get('/paidorderdetails/:id', verification,roleAuthorize('USER'),async(req,res)=>{
        try{
                const orderId=Number(req.params.id)
              const user= await prisma.user.findUnique({
                where:{id:Number(req.user.id)}
            });
            if(!user){return res.status(404).json({msg:'User Not Found'})}
            const paidOrder= await prisma.order.findFirst({
                where:{userId:user.id,id:orderId, payment:{status:'PAID'}},
               select:{
                id:true,
                createdAt:true,
                address:true,
                     user:{
                        select:{
                            name:true,
                            email:true,
                            phone:true,
                            
                        }
                    },
                        courier:{
                    select:{
                        courierName:true,
                        trakingNumber:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
                    items:{
                        select:{
                            id:true,
                         quantity:true,
                        unitPrice:true,
                        size:true,
                        variant:true,
                        color:true,
                            product:{
                                select:{
                                    name:true,
                                    photos:true,
                                    
                                }
                            }
                        }
                    },
                    payment:{
                        select:{
                             status :true,
                             paymentmethod:true,
                             createdAt:true,
                             transactionId:true,
                             currency:true,
                             amount:true
                            
                        }
                    }
                 }
            });
           return res.status(200).json({ paidOrder})

        }catch(err){console.error(err);return res.status(500).json({msg: 'Server Error'})}
    });
    
    
    

    


    // Add to Cart Product
    route.post('/addtocart',verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const userId=Number(req.user.id)
            const {productId, size, color, quantity,variant}=req.body
            if(!quantity||!color||!size||!variant){return res.status(400).json({msg:'Please Add Quantity,Color, Size, Variant'})}
            let cart= await prisma.cart.findFirst({where:{userId, status:'PENDING'}});
            if(!cart){cart=await prisma.cart.create({data:{userId, status:'PENDING'}})};
            const existingItem = await prisma.cartItem.findFirst({
                where:{
                    cartId:cart.id,
                    productId,
                    size,
                    color,
                    variant
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
                    variant,
                    unitPrice: product.price,
                    totalPrice: product.price*quantity
                }
            });
        }
       
     return  res.status(200).json({msg:'Add to cart'})


        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

    //get all cart items
    route.get('/getallcartitems', verification, roleAuthorize('USER'),async(req,res)=>{
        try{
            const cartItems= await prisma.cart.findFirst({
                where:{userId:req.user.id, status:'PENDING'},
                select:{
                    id:true,
                    items:{
                        select:{
                            size:true,
                            color:true,
                            variant:true,
                            quantity:true,
                            product:{
                                select:{
                                    photos:true,
                                    name:true,
                                    price:true
                                }
                            }
                        }
                    },
                    createdAt:true,
                    updatedAt:true,
                }
            });
            if(!cartItems){return res.status(404).json({msg:'Cart Not Found'})}
       
           return res.status(200).json({cartItems, mode:'CheckOut'})
        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

    //count cartItem
    route.get('/totalcartitem',verification,roleAuthorize('USER'),async(req,res)=>{
        const userCart = await prisma.cart.findFirst({
         where: { userId: req.user.id, status:'PENDING' },
            });

        if (!userCart) return res.status(404).json({ msg: 'Cart not found' });

        const totalCartItems = await prisma.cartItem.count({
         where: { cartId: userCart.id },
            });
            res.status(200).json({ totalCartItems });

    })

    //Delete Cart item
    route.delete('/deletecartitem/:id',verification,roleAuthorize('USER'),async(req,res)=>{
        try{
            const {id}=req.params.id;
            const userId= req.user.id;
            const item= await prisma.cartItem.findFirst({
                where:{id, cart:{userId, status:'PENDING'}}
            });
            if(!item){return res.status(404).json({msg:'Cart Item Not Founded'})}
            await prisma.cartItem.delete({
                where:{id:item.id}
            });
            res.status(200).json({msg:'Cart Item Delete Successfully'})
        }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
    })


    //Create Order/COD order
    route.post('/checkout', verification, roleAuthorize('USER'), async(req,res)=>{
        
        try{
            const {location,addressId}=req.body;
            
            const userId=req.user.id
            const shippingRate= await prisma.shippingRate.findFirst({
                where:{location}
            });
            if(!shippingRate){return res.status(400).json({msg:'Shipping Not Available of This Area'})}
            if(!addressId){return res.status(400).json({msg:'Please Add Address'})}

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
            let shippingFee=0

            if (totalWeight <= 0.5) {
             shippingFee = Math.round(shippingRate.baseFee);
                } 
            else if (totalWeight > 0.5 && totalWeight < 1) {
            shippingFee = Math.round(shippingRate.perKgFee);
            } 
            else if (totalWeight >= 1) {
        shippingFee = Math.round(shippingRate.perKgFee * totalWeight);
                }

            
          
            // const shippingFee = Math.round(shippingRate.baseFee+(totalWeight*shippingRate.perKgFee));
            const bounsAmount= await prisma.refWallet.findFirst({
                where:{userId},
                select:{amount:true}
            });
            const bonus= bounsAmount?bounsAmount.amount:0
              const payment=await prisma.payment.create({
                                data:{
                                status:'UNPAID',
                                amount:Math.round((totalPrice-bonus)+shippingFee),
                                currency:'PHP',
                                transactionId:(await genTrxCode()).toString(),
                                paymentmethod:'COD'
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
                where:{userId},
                data:{amount:0}
            });};
        res.status(200).json({msg:'Order Placed Successfully'})
        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

// Preview Checkout

  route.get('/checkoutpreview/:location', verification, roleAuthorize('USER'), async(req,res)=>{
        try{
            const {location}=req.params
            const userId=req.user.id

            const cart= await prisma.cart.findFirst({
                where:{userId, status:'PENDING'},
                  select:{
                    id:true,
                    items:{
                        select:{
                            size:true,
                            color:true,
                            variant:true,
                            quantity:true,
                            product:{
                                select:{
                                    id:true,
                                    photos:true,
                                    name:true,
                                    price:true
                                }
                            }
                        }
                    },
                    
                }
            });

            let totalWeight=0
            let subtotal=0
         
            for(const item of cart.items){
                const product =await prisma.product.findUnique({
                    where:{id:item.product.id}
                });
                if(!product) continue;
                totalWeight+= product.weight * item.quantity
                subtotal+=product.price*item.quantity
             
            };
       

            const bonusAount= await prisma.refWallet.findFirst({
                where:{userId},
                select:{amount:true}
            });
            const bonus= bonusAount?bonusAount.amount:0

                let shippingFee=0;
            const shippingRate= await prisma.shippingRate.findFirst({
                where:{location}
            });

            if (totalWeight <= 0.5) {
             shippingFee = Math.round(shippingRate.baseFee);
                } 
            else if (totalWeight > 0.5 && totalWeight < 1) {
            shippingFee = Math.round(shippingRate.perKgFee);
            } 
            else if (totalWeight >= 1) {
        shippingFee = Math.round(shippingRate.perKgFee * totalWeight);
                }
           else{ return res.status(400).json({msg:'Shipping Not Available for This Area'})}

            res.status(200).json({items:cart, bonus, shippingFee:Math.ceil(shippingFee), itemPrice:subtotal, subtotal:(subtotal-bonus), total:(subtotal-bonus)+shippingFee,})


        }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
    });

//cancel Order By User
route.put('/cancelorder/:id',verification,roleAuthorize('USER'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);
        const userId=Number(req.user.id);
        if(!userId){return res.status(404).json({msg:'User Not Found'})}
        if(!orderId){return res.status(404).json({msg:'Order Not Found'})}
       const cancel= await prisma.order.update({
            where:{id:orderId,userId,status:'PENDING'},
            data:{status:'CANCELLED'}
        });

        if(!cancel){return res.status(400).json({msg:'Order Cancel Not Possible. Order On Processing'})}

        return res.status(200).json({msg:'Order Cancel Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
})


// get referral Account
route.get('/referral', verification, roleAuthorize('USER'),async(req,res)=>{
    try{
        const user= await prisma.user.findUnique({
            where:{id:req.user.id},
            select:{referredUser:{
                select:{
                    id:true,
                    name:true,
                    email:true,
                    phone:true,
                    createdAt:true,
                }
            }

            }
        });
        const totalRef= user.referredUser?user.referredUser.length:0
        const walletAmount= await prisma.refWallet.findUnique({
            where:{userId:req.user.id},
            select:{amount:true}
        });
        const wallet= walletAmount?walletAmount.amount:0
        res.status(200).json({user, totalRef, wallet})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


    //get All Shipping Fee
route.get('/getshippingfee', verification, roleAuthorize('USER'),async(req,res)=>{
    try{
        const rate= await prisma.shippingRate.findMany({
            select:{location:true, id:true}
        });
        return res.status(200).json({rate})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

// get related Product/card
route.get('/relatedproduct/:id',async(req,res)=>{
    try{
        const id=Number(req.params.id)
        const mainProduct= await prisma.product.findUnique({
            where:{id}
        });
        if(!mainProduct){return res.status(404).json({msg:'Product Not Found'})}
        
        const relatedProduct= await prisma.product.findMany({
          where: {
            category: mainProduct.category,
             NOT: { id: mainProduct.id },
                },
        select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                category:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                },
                order:{
                    select:{
                         quantity:true
                        }
                    }
                
            },
        orderBy:{createdAt:'desc'},
        take:8,
        });
    return    res.status(200).json({relatedProduct})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//add address by user
route.post('/addaddress', verification, roleAuthorize('USER'),async(req,res)=>{
    try{
        const {label,name,phone,line1,barangay,city,province,postalCode}=req.body;
        const userId=req.user.id
         if (!label||!name||!phone||!line1||!barangay||!city||!province||!postalCode){return res.status(400).json({msg:'All Field Required'})}
         await prisma.address.create({
            data:{
                userId,
                label,name,phone,line1,barangay,city,province,postalCode
            }
         });
       return  res.status(200).json({msg:'Address Add Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//Get All Address by user
route.get('/getalladdress',verification,roleAuthorize('USER'),async(req,res)=>{
    try{
        const userId=req.user.id
        const address= await prisma.address.findMany({
            where:{userId},
            select:{
              id:true, label:true,  name:true,phone:true,line1:true,barangay:true,city:true,province:true,postalCode:true
            }
        });
      return  res.status(200).json({address})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
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
        await prisma.comment.create({
            data:{comment, productId:product.id, userId:user.id}
        });
        res.status(200).json({msg:'Comment Added Successfully'})

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Get All Comment
route.get('/getallcomment/:id',async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit) ||10;
         const skip=(page-1)*limit;
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



// product Search for user

route.get("/search", async (req, res) => {
  try {
    const  {query}  = req.query;
    const page= Number(req.query.page)||1;
    const limit=Number(req.query.limit)||20;
    const skip=(page-1)*limit
    const take=limit

    if (!query || query.trim() === "") {
      return res.status(400).json({ msg: "Search query required" });
    }

    // Normalize the keyword (remove symbols, convert to lowercase)
    const keyword = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim().split(/\s+/);
   const conditions = [];
    const params = [];
    for (const kw of keyword) {
  const p = `%${kw}%`;
  conditions.push(`
    (REPLACE(LOWER(name), '''', '') LIKE ? 
     OR REPLACE(LOWER(description), '''', '') LIKE ? 
     OR REPLACE(LOWER(category), '''', '') LIKE ?)
  `);
  params.push(p, p, p);
}

const whereClause = conditions.join(" AND ");

  
    

const rawIds = await prisma.$queryRawUnsafe(
 `
  SELECT id FROM Product
  WHERE ${whereClause}
  ORDER BY createdAt DESC
  LIMIT ? OFFSET ?;
  `,
  ...params,
  take,
  skip
);
       const ids = rawIds.map((r) => r.id);

    if (ids.length === 0) {
      return res.json({ success: true, total: 0, totalPages: 0, results: [] });
    }

     const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                originalPrice:true,
                _count:{
                    select:{comment:true}
                },
            },
      orderBy: { createdAt: 'desc' },
    });
        for(let product of products){
            const soldData= await prisma.orderItem.aggregate({
                _sum:{quantity:true},
                where:{productId:product.id, order:{status:'DELIVERED'}}
            });
            const soldCount=soldData._sum.quantity || 0
            product.soldCount=soldCount
        };

    const [{ total }] = await prisma.$queryRawUnsafe(
        `
      SELECT COUNT(*) as total FROM Product WHERE ${whereClause};
    `,...params);
    const totalCount = Number(total);
  return  res.status(200).json({products, totalProduct:total, totalPage:Math.ceil(totalCount/take)});
  } catch (err) {
    console.error("Search Error:", err);
   return res.status(500).json({ msg: "Server Error" });
  }
});





  


module.exports=route