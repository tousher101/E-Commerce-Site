const express=require('express');
const route=express.Router();
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuthorize');
const prisma=require('../utils/prisma');
const cloudinary=require('../utils/cloudinary');
const upload =require('../middle-wear/multar');




//Add Product By Admin
route.post('/addproduct',verification,roleAuthorize('ADMIN'),upload.array('photos',5),async(req,res)=>{
const size=JSON.parse(req.body.size);
const color=JSON.parse(req.body.color);
const variant=JSON.parse(req.body.variant)
const {name,description,price,stock, category, weight, barcode, originalPrice}=req.body;
const photos=req.files

try{
    if(!name||!description||!price||!stock||!category||!photos||!weight||!originalPrice){return res.status(400).json({msg:'Add All Required Field'})}
    const addproduct=await prisma.product.create({
        data:{name,description,price:parseFloat(price),stock:parseInt(stock,10),category, barcode,
            size, 
            color,
            variant,
            weight: parseFloat(weight),
            originalPrice:parseFloat(originalPrice)
        }
    });
    for(const photo of photos){const result=await cloudinary.uploader.upload(photo.path,{
        folder:'E-Commerce/Product-Photos',
        width:1000,
        height:1000,
        crop:'fit'
    });
    await prisma.productPhotos.create({
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
        const id= Number(req.params.id)
        const product= await prisma.product.findFirst({
            where:{id}
        });
        if(!product){return res.status(404).json({msg:'Product Not Found'})}
        const photos= await prisma.productPhotos.findMany({
            where:{productId:id}
        });
        for(const photo of photos){await cloudinary.uploader.destroy(photo.publicId)};
        await prisma.productPhotos.deleteMany({
            where:{productId:id}
        });
        await prisma.product.delete({
            where:{id}
        });
        res.status(200).json({msg:'Product Deleted Sucessfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Edit Product
route.put('/editproduct/:id', verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId=Number(req.params.id);
     
        const {name,description,price,stock, weight, originalPrice, size,color,variant}=req.body
        if(!productId){return res.status(404).json({msg:'Product Not Found'})}
        await prisma.product.update({
            where:{id:productId},
            data:{name,description,price,stock,
                size,
                color,
                weight,
                variant,
                originalPrice
            }
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
           const totalConfirmedOrder= await prisma.order.count({
            where:{status:'CONFIRMED'}
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
        const totalPaidOrder= await prisma.payment.count({
            where:{status:'PAID'}
        });
        const totalCODOrder=await prisma.payment.count({
            where:{paymentmethod:'COD'}
        });
        res.status(200).json({totalPendingOrder,totalShippedOrder,totalDeliveredOrder,totalCancelOrder, totalConfirmedOrder, totalCODOrder,totalPaidOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});



// Request Order/Card
route.get('/requestorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const reqOrder= await prisma.order.findMany({
            where:{status:'PENDING'},
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
            },
            orderBy:{createdAt:'desc'}
        });
        const totalOrder= await prisma.order.count({
            where:{status:'PENDING'}
        })
        res.status(200).json({reqOrder, totalOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get order Request/details
route.get('/getorderrequestdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);

        const orderReq= await prisma.order.findUnique({
            where:{id:orderId},
                    select:{
                id:true,
                createdAt:true,
                address:{
                     select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },
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
        res.status(200).json({orderReq,mode:'ReqOrder'})
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
            where:{id:order.id},
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
            where:{id:order.id},
            data:{status:'CANCELLED'}
        });
        res.status(200).json({msg:'Order Cancel Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

// Make Shipped Order
route.put('/makeshippedorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        
        const orderId=Number(req.params.id);
        const {courierId,trackingNumber}=req.body
        const order=await prisma.order.findUnique({
            where:{id:orderId}
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}

      
         await prisma.order.update({
            where:{id:order.id},
            data:{status:'SHIPPED', trackingNumber, courier:{connect:{id:Number(courierId)}}}
        });
        res.status(200).json({msg:'Order Shipped Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Make Delivered Order
route.put('/makedeliverdorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id);
        const order=await prisma.order.findUnique({
            where:{id:orderId},
            select:{
                items:{
                    select:{
                        quantity:true,
                        productId:true
                    }
                }
            }
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}
        await prisma.order.update({
            where:{id:orderId},
            data:{status:'DELIVERED'}
        });
        for(let item of order.items){
            await prisma.product.update({
                where:{id:item.productId},
                data:{stock:{decrement:item.quantity}}
            })
        }

     

        res.status(200).json({msg:'Order Delivered Successfully & Stock Updated'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});



//get all confirmed order/card
route.get('/confirmedorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const getconfirmedorder= await prisma.order.findMany({
            where:{status:'CONFIRMED'},
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
            orderBy:{createdAt:'desc'}
        });
        const totalConfirmedOrder= await prisma.order.count({
            where:{status:'CONFIRMED'}
        })
        res.status(200).json({getconfirmedorder, totalConfirmedOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get  confirmed order/details
route.get('/getconfirmedorderdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
     const orderId=Number(req.params.id)
        const conOrder= await prisma.order.findUnique({
            where:{id:orderId},
            select:{
                id:true,
                createdAt:true,
                address:{
                     select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },
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
        res.status(200).json({ conOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get all shipped order/card
route.get('/shippedorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const getShippedorder= await prisma.order.findMany({
            where:{status:'SHIPPED'},
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
            orderBy:{createdAt:'desc'}
        });
        const totalShippedOrder= await prisma.order.count({
            where:{status:'SHIPPED'}
        })
        res.status(200).json({getShippedorder, totalShippedOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get Shipped Order/details
route.get('/getshippedorderdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
       const orderId=Number(req.params.id)
        const shippedOrder= await prisma.order.findMany({
            where:{id:orderId},
           select:{
                id:true,
                createdAt:true,
                trackingNumber:true,
                 updatedAt:true,
                address:{
                     select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },
                courier:{
                    select:{
                        courierName:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
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
        res.status(200).json({shippedOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get all deliverd order/card/currentMonth
route.get('/currentmonthdeliverdorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
          const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalDeliveredOrder= await prisma.order.count({
            where:{status:'DELIVERED',
            createdAt:{gte:currentStart, lt: currentEnd}
            }
        });
        const getDeliveredOrder= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:currentStart, lt: currentEnd}},
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
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getDeliveredOrder, totalDeliveredOrder, totalPage:Math.ceil(totalDeliveredOrder/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get all deliverd order/card/prevMonth
route.get('/previousmonthdeliverdorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
          const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const prevStart= new Date(prevYear, prevMonth-1, 1);
        const prevEnd = new Date(currentYear, currentMonth-1 ,1)

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalDeliveredOrder= await prisma.order.count({
            where:{status:'DELIVERED',
            createdAt:{gte:prevStart, lt: prevEnd}
            }
        });
        const getDeliveredOrder= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:prevStart, lt: prevEnd}},
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
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getDeliveredOrder, totalDeliveredOrder, totalPage:Math.ceil(totalDeliveredOrder/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});




//get all delivered order/details
route.get('/getdeliveredorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
      const orderId=Number(req.params.id)
        const delOrder= await prisma.order.findUnique({
            where:{id:orderId},
            select:{
                id:true,
                createdAt:true,
                 trackingNumber:true,
                 updatedAt:true,
                address:{
                     select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },    courier:{
                    select:{
                        courierName:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
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
        res.status(200).json({delOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get all cancelled order/card/current Month
route.get('/currentmonthcancelledorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
         const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED', createdAt:{gte:currentStart,lt:currentEnd}}
        });
        const getCancelledOrder= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:currentStart,lt:currentEnd}},
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
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getCancelledOrder, totalCancelledOrder, totalPage:Math.ceil(totalCancelledOrder/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get all cancelled order/card/Prev Month
route.get('/previousmonthcancelledorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
          const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const prevStart= new Date(prevYear, prevMonth-1, 1);
        const prevEnd = new Date(currentYear, currentMonth-1 ,1)

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED', createdAt:{gte:prevStart,lt:prevEnd}}
        });
        const getCancelledOrder= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:prevStart,lt:prevEnd}},
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
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getCancelledOrder, totalCancelledOrder, totalPage:Math.ceil(totalCancelledOrder/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get Cancel Order/details
route.get('/getcancelorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
       const orderId=Number(req.params.id)
        const canOrder= await prisma.order.findUnique({
            where:{id:orderId},
           select:{
                id:true,
                createdAt:true,
                address:{
                     select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },
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
        res.status(200).json({canOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get Paid Order/card/currentMonth
route.get('/currentmonthpaidorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);
        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID',createdAt:{gte:currentStart, lt:currentEnd}}}
        });
        const getPaidOrder= await prisma.order.findMany({
            where:{payment:{status:'PAID',createdAt:{gte:currentStart, lt:currentEnd}}},
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
                                paymentmethod:true,
                                status:true,
                                createdAt:true
                        }
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getPaidOrder, totalPaidOrder, totalPage:Math.ceil(totalPaidOrder/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get Paid Order/card/prevMonth
route.get('/previousmonthpaidorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

       const prevStart= new Date(prevYear, prevMonth-1, 1);
        const prevEnd = new Date(currentYear, currentMonth-1 ,1)

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID',createdAt:{gte:prevStart, lt:prevEnd}}}
        });
        const getPaidOrder= await prisma.order.findMany({
            where:{payment:{status:'PAID',createdAt:{gte:prevStart, lt:prevEnd}}},
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
                                paymentmethod:true,
                                status:true,
                                createdAt:true
                        }
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getPaidOrder, totalPaidOrder, totalPage:Math.ceil(totalPaidOrder/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});



//get paid Order/details
route.get('/getpaidorderdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
       const orderId=Number(req.params.id)
        const paidOrder= await prisma.order.findUnique({
            where:{id:orderId},
           select:{
                id:true,
                createdAt:true,
                  trackingNumber:true,
                 updatedAt:true,
                address:{
                     select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },
                    courier:{
                    select:{
                        courierName:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
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
        res.status(200).json({paidOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get COD order/ card/currentMonth
route.get('/currentmonthcodorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
           const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalCodOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD',createdAt:{gte:currentStart,lt:currentEnd}}}
        });
        const getCodOrder= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD',createdAt:{gte:currentStart,lt:currentEnd}}},
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
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getCodOrder, totalCodOrder, totalPage:Math.ceil(totalCodOrder/limit), mode:'PAID'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get COD order/ card/previousMonth
route.get('/previousmonthcodorder', verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
           const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const prevStart= new Date(prevYear, prevMonth-1, 1);
        const prevEnd = new Date(currentYear, currentMonth-1 ,1)

        const page= Number(req.query.page||1);
        const limit=Number(req.query.limit||20);
         const skip= (page-1)*limit;
            const totalCodOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD',createdAt:{gte:prevStart,lt:prevEnd}}}
        });
        const getCodOrder= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD',createdAt:{gte:prevStart,lt:prevEnd}}},
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
                    },
                    
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });

        res.status(200).json({getCodOrder, totalCodOrder, totalPage:Math.ceil(totalCodOrder/limit), mode:'PAID'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//get COD Order/details
route.get('/getcodorderdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
       const orderId=Number(req.params.id)
        const codOrder= await prisma.order.findUnique({
            where:{id:orderId},
           select:{
                id:true,
                createdAt:true,
                 trackingNumber:true,
                 updatedAt:true,
                address:{
                    select:{
                        label:true,
                        name:true,
                        phone:true,
                        line1:true,
                        province:true,
                        city:true,
                        barangay:true,
                        postalCode:true,
                    }
                },
                    courier:{
                    select:{
                        courierName:true,
                        createdAt:true,
                        courierLink:true
                    }
                },
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
        res.status(200).json({codOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Delete Review by admin
route.delete('/deletereview/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const commentId=Number(req.params.id);
        const userId=Number(req.user.id)
  
  
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









// Admin dashboard (Monthly data)

route.get('/getmonthlydata', verification, roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);
        const prevStart= new Date(prevYear, prevMonth-1, 1);
        const prevEnd = new Date(currentYear, currentMonth-1 ,1)

        const currentMonthSales= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'DELIVERED', 
                createdAt:{gte:currentStart, lt: currentEnd}
            }
        });

        const prevMonthSales = await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'DELIVERED', 
                createdAt:{gte: prevStart, lt: prevEnd}
            }
        });

        const current = currentMonthSales._sum.totalPrice || 0;
        const prev = prevMonthSales._sum.totalPrice || 0;
        const growth =  prev===0?100:((current-prev)/prev)*100;



         const currentMonthPendingOrder= await prisma.order.count({
            where:{status:'PENDING'}
        });

        const confOrder= await prisma.order.count({
            where:{status:'CONFIRMED'}
        })


        const currentMonthConfirmedOrder= await prisma.order.count({
            where:{createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const prevMonthConfirmedOrder = await prisma.order.count({
            where:{createdAt:{gte:prevStart, lt:prevEnd}}
        });

        const currentConfirmedOrder= currentMonthConfirmedOrder ||0;
        const prevConfirmedOrder = prevMonthConfirmedOrder || 0;
        const orderConfirmedGrowth = prevConfirmedOrder==0?100:((currentConfirmedOrder-prevConfirmedOrder)/prevConfirmedOrder)*100;


        const currentMonthShippedOrder= await prisma.order.count({
            where:{status:'SHIPPED'}
        });

        

     
        


        const currentMonthDeliverdOrder= await prisma.order.count({
            where:{status:'DELIVERED', createdAt:{gte: currentStart, lt:currentEnd}}
        });

        const prevMonthDeliverdOrder = await prisma.order.count({
            where:{status:'DELIVERED',createdAt:{gte:prevStart, lt:prevEnd}}
        });

        const currentDeliverdOrder= currentMonthDeliverdOrder ||0;
        const prevDeliverdOrder = prevMonthDeliverdOrder || 0;
        const orderDeliverdGrowth = prevDeliverdOrder==0?100:((currentDeliverdOrder-prevDeliverdOrder)/prevDeliverdOrder)*100;


        
        const currentMonthCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED', createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const prevMonthCancelledOrder = await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:prevStart, lt:prevEnd}}
        });

        const currentCancelledOrder= currentMonthCancelledOrder ||0;
        const prevCancelledOrder = prevMonthCancelledOrder || 0;
        const orderCancelledGrowth = prevCancelledOrder==0?100:((currentCancelledOrder-prevCancelledOrder)/prevCancelledOrder)*100;


        res.status(200).json({growth:growth.toFixed(2), current, prev, 
           currentMonthPendingOrder, orderConfirmedGrowth:orderConfirmedGrowth.toFixed(2),
            currentConfirmedOrder, prevConfirmedOrder,  currentMonthShippedOrder, confOrder,
            orderDeliverdGrowth:orderDeliverdGrowth.toFixed(2), currentDeliverdOrder, prevDeliverdOrder,
            orderCancelledGrowth:orderCancelledGrowth.toFixed(2),currentCancelledOrder, prevCancelledOrder

        });
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//montly sales data for chart
route.get('/chartdata',verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{

        const now = new Date();
  const year = now.getFullYear();

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];


  let salesData = [];

  for (let i = 0; i < 12; i++) {
    const start = new Date(year, i, 1);
    const end = new Date(year, i + 1, 1);

    const sales = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        status: "DELIVERED",
        createdAt: { gte: start, lt: end }
      }
    });

    salesData.push({
      month: monthNames[i],
      total: sales._sum.totalPrice || 0
    });
  }
  res.status(200).json({salesData})

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//add Shipping Rate
route.post('/addshippingrate', verification, roleAuthorize('ADMIN'), async(req,res)=>{
    
    try{
        const {location,baseFee, perKgFee}=req.body
        if(!location||!baseFee||!perKgFee){return res.status(400).json({msg:'All Field Required'})}
         await prisma.shippingRate.create({
            data:{location,baseFee,perKgFee}
        });
        res.status(200).json({msg:'Shipping Fee Added Sucessfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


    //get All Shipping Fee
route.get('/getshippingfee', verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const rate= await prisma.shippingRate.findMany({
            select:{
                id:true,
                location:true,
                baseFee:true,
                perKgFee:true
            }
        });
        res.status(200).json({rate})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Edit Shipping Fee Rate
route.put('/editshippingfeerate/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const shippingFeeId= Number(req.params.id);
        const {location,baseFee,perKgFee}=req.body;
        const shippingFee= await prisma.shippingRate.findFirst({
            where:{id:shippingFeeId}
        });
        if(!shippingFee){return res.status(404).json({msg:'Shipping Fee Not Found'})}
        await prisma.shippingRate.update({
            where:{id:shippingFeeId},
            data:{
                location, baseFee,perKgFee
            }
        });
        res.status(200).json({msg:'Shipping Fee Update Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Delete Shipping Fee Rate
route.delete('/deleteshippingfeerate/:id', verification, roleAuthorize('ADMIN'),async(req,res)=>{
   
    try{
        const shippingFeeId=Number(req.params.id);
        const shippingFee= await prisma.shippingRate.findFirst({
            where:{id:shippingFeeId}
        });
        if(!shippingFee){return res.status(404).json({msg:'Shipping Rate Not Found'})}
        await prisma.shippingRate.delete({
            where:{id:shippingFeeId}
        });
        res.status(200).json({msg:'Shipping Fee Rate Delete Successfully'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get product by category(mens fashion)
route.get('/adminmensfashion',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||20;
        const skip= (page-1)*limit
        const totalMensFashion= await prisma.product.count({
            where:{category:'MENSFASHION'}
        });
        const getMensFashion= await prisma.product.findMany({
            where:{category:'MENSFASHION'},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                size:true,
                color:true,
                variant:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                originalPrice:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({totalMensFashion, getMensFashion, totalPage:Math.ceil(totalMensFashion/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get product by category(womens fashion)
route.get('/adminwomensfashion',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||20;
        const skip= (page-1)*limit
        const totalWomensFashion= await prisma.product.count({
            where:{category:'WOMENFASHION'}
        });
        const getWomensFashion= await prisma.product.findMany({
            where:{category:'WOMENFASHION'},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                size:true,
                color:true,
                variant:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                originalPrice:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({totalWomensFashion, getWomensFashion, totalPage:Math.ceil(totalWomensFashion/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get product by category(kids fashion)
route.get('/adminkidsfashion',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||20;
        const skip= (page-1)*limit
        const totalKidsFashion= await prisma.product.count({
            where:{category:'KIDSFASHION'}
        });
        const getKidsFashion= await prisma.product.findMany({
            where:{category:'KIDSFASHION'},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                size:true,
                color:true,
                variant:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                originalPrice:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({totalKidsFashion, getKidsFashion, totalPage:Math.ceil(totalKidsFashion/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get product by category(Accessories)
route.get('/adminaccessories',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||20;
        const skip= (page-1)*limit
        const totalAccessoriesFashion= await prisma.product.count({
            where:{category:'ACCESSORIES'}
        });
        const getAccessoriesFashion= await prisma.product.findMany({
            where:{category:'ACCESSORIES'},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                size:true,
                color:true,
                variant:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                originalPrice:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({totalAccessoriesFashion, getAccessoriesFashion, totalPage:Math.ceil(totalAccessoriesFashion/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get product by category(Perfume)
route.get('/adminperfume',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const page= Number(req.query.page)||1;
        const limit=Number(req.query.limit)||20;
        const skip= (page-1)*limit
        const totalPerfumeFashion= await prisma.product.count({
            where:{category:'PERFUME'}
        });
        const getPerfumeFashion= await prisma.product.findMany({
            where:{category:'PERFUME'},
            select:{
                id:true,
                name:true,
                description:true,
                price:true,
                stock:true,
                photos:true,
                size:true,
                color:true,
                variant:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                originalPrice:true
            },
            skip:skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        });
        res.status(200).json({totalPerfumeFashion, getPerfumeFashion, totalPage:Math.ceil(totalPerfumeFashion/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Add courier Company
route.post('/addcourier',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const {courierName, courierLink}=req.body
        if(!courierLink||!courierName){return res.status(400).json({msg:'Courier Name & Link Need'})}
        await prisma.courier.create({
            data:{courierName,courierLink}
        });
        return res.status(200).json({msg:'Courier Service Create Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});
//Delete courier Company
route.delete('/deletecourier/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const courierId=Number(req.params.id)
        const courier= await prisma.courier.findUnique({
            where:{id:courierId}
        });
        if(!courier){return res.status(404).json({msg:'Courier Service Not Found'})}
        await prisma.courier.delete({
            where:{id:courier.id}
        });
        return res.status(200).json({msg:'Courier Service Delete Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get all courier service 
route.get('/getallcourier',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const courier= await prisma.courier.findMany({
            select:{
                id:true,
                courierName:true,
                courierLink:true
            }
        });
        return res.status(200).json({courier})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
})



module.exports=route