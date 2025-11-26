const express=require('express');
const route=express.Router();
const verification=require('../middle-wear/verification');
const roleAuthorize=require('../middle-wear/roleAuthorize');
const prisma=require('../utils/prisma');
const cloudinary=require('../utils/cloudinary');
const upload =require('../middle-wear/multar');
const { create } = require('domain');




//Add Product By Admin
route.post('/addproduct',verification,roleAuthorize('ADMIN'),upload.array('photos',5),async(req,res)=>{

const {name,description,stock, category, weight, barcode,basePrice,baseOriginalPrice }=req.body;
let {variants}=req.body
const photos=req.files


try{
    if(!name||!description||!stock||!category||!photos||!weight||!basePrice||!baseOriginalPrice){return res.status(400).json({msg:'Add All Required Field'})}
    if(typeof variants==='string'){variants=JSON.parse(variants)}
    const addproduct=await prisma.product.create({
        data:{name,description,stock:parseInt(stock,10),category, barcode,weight: parseFloat(weight),basePrice:parseFloat(basePrice),baseOriginalPrice:parseFloat(baseOriginalPrice),
            variants:{create:variants.map(v=>({
                variant:v.variant, color:v.color, price:parseFloat(v.price),originalPrice:parseFloat(v.originalPrice), size:v.size
            }))}
          
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
     
        const {name,description,basePrice,stock, weight, baseOriginalPrice,}=req.body
        if(!productId){return res.status(404).json({msg:'Product Not Found'})}
        await prisma.product.update({
            where:{id:productId},
            data:{name,description,basePrice,stock,
                weight,
                baseOriginalPrice
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
     
        res.status(200).json({totalPendingOrder,totalShippedOrder,totalConfirmedOrder })
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
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//make return order
route.put('/makereturnorder/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const orderId=Number(req.params.id)
        const order= await prisma.order.findUnique({
            where:{id:orderId}
        });
        if(!order){return res.status(404).json({msg:'Order Not Found'})}
        await prisma.order.update({
            where:{id:order.id},
            data:{status:'RETURN'}
        });
        return res.status(200).json({msg:'Order Return Successfully'})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
})



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
        const shippedOrder= await prisma.order.findUnique({
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


//get delivered order today/card
route.get('/todaydeliveredorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const totalOrders= await prisma.order.count({
            where:{status:'DELIVERED',createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:startOfToday, lt:endOfToday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get delivered order yesterday/card
route.get('/yesterdaydeliveredorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const totalOrders= await prisma.order.count({
            where:{status:'DELIVERED',createdAt:{gte:startOfYesterday, lt:endOfYesterday}} 
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:startOfYesterday, lt:endOfYesterday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get delivered order week/card
route.get('/weeklydeliveredorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
              const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{status:'DELIVERED',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get delivered order month/card
route.get('/monthlydeliveredorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
             const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

            const totalOrders= await prisma.order.count({
            where:{status:'DELIVERED',createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:currentStart, lt:currentEnd}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get delivered order year/card
route.get('/yearlydeliveredorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
         const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{status:'DELIVERED',createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'DELIVERED',createdAt:{gte:startOfYear, lt:endOfYear}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
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


//get cancelled order today/card
route.get('/todaycancelledorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const totalOrders= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:startOfToday, lt:endOfToday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get cancelled order yesterday/card
route.get('/yesterdaycancelledorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const totalOrders= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:startOfYesterday, lt:endOfYesterday}} 
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:startOfYesterday, lt:endOfYesterday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get cancelled order week/card
route.get('/weeklycancelledorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
              const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get cancelled order month/card
route.get('/monthlycancelledorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
             const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

            const totalOrders= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:currentStart, lt:currentEnd}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get cancelled order year/card
route.get('/yearlycancelledorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
         const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'CANCELLED',createdAt:{gte:startOfYear, lt:endOfYear}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
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

//get paid order today/card
route.get('/todaypaidorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const totalOrders= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfToday, lt:endOfToday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get paid order yesterday/card
route.get('/yesterdaypaidorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const totalOrders= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYesterday, lt:endOfYesterday}} 
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYesterday, lt:endOfYesterday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get paid order week/card
route.get('/weeklypaidorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
              const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{status:'PAID'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get paid order month/card
route.get('/monthlypaidorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
             const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

            const totalOrders= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{status:'PAID'},createdAt:{gte:currentStart, lt:currentEnd}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get paid order year/card
route.get('/yearlypaidorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
         const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYear, lt:endOfYear}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
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


//get cod order today/card
route.get('/todaycodorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const totalOrders= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfToday, lt:endOfToday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get cod order yesterday/card
route.get('/yesterdaycodorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const totalOrders= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYesterday, lt:endOfYesterday}} 
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYesterday, lt:endOfYesterday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get cod order week/card
route.get('/weeklycodorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
              const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get cod order month/card
route.get('/monthlycodorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
             const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

            const totalOrders= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:currentStart, lt:currentEnd}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get cod order year/card
route.get('/yearlycodorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
         const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYear, lt:endOfYear}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
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



//get return order today/card
route.get('/todayretunorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const totalOrders= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'RETURN',createdAt:{gte:startOfToday, lt:endOfToday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get return order yesterday/card
route.get('/yesterdayreturnorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const totalOrders= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:startOfYesterday, lt:endOfYesterday}} 
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'RETURN',createdAt:{gte:startOfYesterday, lt:endOfYesterday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get return order week/card
route.get('/weeklyreturnorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
              const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'RETURN',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get return order month/card
route.get('/monthlyreturnorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
             const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

            const totalOrders= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'RETURN',createdAt:{gte:currentStart, lt:currentEnd}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get return order year/card
route.get('/yearlyreturnorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
         const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{status:'RETURN',createdAt:{gte:startOfYear, lt:endOfYear}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get return Order/details
route.get('/getreturnorderdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
       const orderId=Number(req.params.id)
        const returnOrder= await prisma.order.findUnique({
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
        res.status(200).json({returnOrder})
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


        const currentMonthConfirmedOrder= await prisma.order.count({
            where:{createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const prevMonthConfirmedOrder = await prisma.order.count({
            where:{createdAt:{gte:prevStart, lt:prevEnd}}
        });

        const currentConfirmedOrder= currentMonthConfirmedOrder ||0;
        const prevConfirmedOrder = prevMonthConfirmedOrder || 0;
        const orderConfirmedGrowth = prevConfirmedOrder==0?100:((currentConfirmedOrder-prevConfirmedOrder)/prevConfirmedOrder)*100;


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

        const currentMonthCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'}, createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const prevMonthCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'}, createdAt:{gte:prevStart, lt:prevEnd}}
        });
        const currentCODOrder=currentMonthCODOrder ||0;
        const prevCODOrder=prevMonthCODOrder || 0;
        const orderCODGrowth= prevCODOrder==0?100:((currentCODOrder-prevCODOrder)/prevCODOrder)*100;


        const currentMontPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'}, createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const prevMonthPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'}, createdAt:{gte:prevStart, lt:prevEnd}}
        });
        const currentPaidOrder= currentMontPaidOrder ||0;
        const prevPaidOrder=prevMonthPaidOrder||0;
        const orderPaidGrowth= prevPaidOrder==0?100:((currentPaidOrder-prevPaidOrder)/prevPaidOrder)*100;


        const currentMonthReturnOrder= await prisma.order.count({
            where:{status:'RETURN', createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const prevMonthReturnOrder= await prisma.order.count({
            where:{status:'RETURN', createdAt:{gte:prevStart, lt:prevEnd}}
        });
        const currentReturnOrder=currentMonthReturnOrder ||0;
        const prevReturnOrder=prevMonthReturnOrder ||0;
        const orderReturnGrowth=prevReturnOrder==0?100:((currentReturnOrder-prevReturnOrder)/prevReturnOrder)*100;


        res.status(200).json({growth:growth.toFixed(2), current, prev, 
           orderConfirmedGrowth:orderConfirmedGrowth.toFixed(2),
            currentConfirmedOrder, prevConfirmedOrder, orderDeliverdGrowth:orderDeliverdGrowth.toFixed(2), 
            currentDeliverdOrder, prevDeliverdOrder,orderCancelledGrowth:orderCancelledGrowth.toFixed(2),
            currentCancelledOrder, prevCancelledOrder, orderCODGrowth:orderCODGrowth.toFixed(2), currentCODOrder,prevCODOrder,
            orderPaidGrowth:orderPaidGrowth.toFixed(2), currentPaidOrder, prevPaidOrder, orderReturnGrowth:orderReturnGrowth.toFixed(2),
            currentReturnOrder, prevReturnOrder

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
                basePrice:true,
                stock:true,
                photos:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true,
                barcode:true
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
                basePrice:true,
                stock:true,
                photos:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true,
                barcode:true
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
                basePrice:true,
                stock:true,
                photos:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true,
                barcode:true
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
                basePrice:true,
                stock:true,
                photos:true,
                barcode:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true
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
                basePrice:true,
                stock:true,
                photos:true,
                barcode:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true
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
});

//make top selling product
route.put('/maketopselling/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId=Number(req.params.id)
        const product= await prisma.product.findUnique({
            where:{id:productId},
        });
        if(!product){return res.status(404).json({msg:'Product Already Top Selling'})};
        await prisma.product.update({
            where:{id:product.id},
            data:{productStatus:'TOP_SELLING'}
        });
        return res.status(200).json({msg:'Product Status Change To Top Selling Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//make top popular product
route.put('/maketoppopuler/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId=Number(req.params.id)
        const product= await prisma.product.findUnique({
            where:{id:productId},
        });
        if(!product){return res.status(404).json({msg:'Product Already To Popular'})};
        await prisma.product.update({
            where:{id:product.id},
            data:{productStatus:'MOST_POPULER'}
        });
        return res.status(200).json({msg:'Product Status Change To Top Popular Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

// make none the product status
route.put('/makechangeproductstatus/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId=Number(req.params.id)
        const product= await prisma.product.findUnique({
            where:{id:productId},
        });
        if(!product){return res.status(404).json({msg:'Product Already Default'})};
        await prisma.product.update({
            where:{id:product.id},
            data:{productStatus:'NONE'}
        });
        return res.status(200).json({msg:'Product Status Change Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//searchProduct by Barcode Number mens
route.get('/searchproductbybarcodemens',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const {barCode}= req.query
        const searchProduct= await prisma.product.findFirst({
            where:{barcode:barCode,category:'MENSFASHION'},
           select:{
                id:true,
                name:true,
                description:true,
                basePrice:true,
                stock:true,
                photos:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true,
                barcode:true
            }
        });
        if(!searchProduct){return res.status(404).json({msg:'Product Not Found'})}
        return res.status(200).json({searchProduct})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//searchProduct by Barcode Number womens
route.get('/searchproductbybarcodewomens',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const {barCode}= req.query
        const searchProduct= await prisma.product.findFirst({
            where:{barcode:barCode,category:'WOMENFASHION'},
           select:{
                id:true,
                name:true,
                description:true,
                basePrice:true,
                stock:true,
                photos:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true,
                barcode:true
            }
        });
        if(!searchProduct){return res.status(404).json({msg:'Product Not Found'})}
        return res.status(200).json({searchProduct})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//searchProduct by Barcode Number kids
route.get('/searchproductbybarcodekids',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const {barCode}= req.query
        const searchProduct= await prisma.product.findFirst({
            where:{barcode:barCode,category:'KIDSFASHION'},
           select:{
                id:true,
                name:true,
                description:true,
                basePrice:true,
                stock:true,
                photos:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true,
                barcode:true
            }
        });
        if(!searchProduct){return res.status(404).json({msg:'Product Not Found'})}
        return res.status(200).json({searchProduct})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//searchProduct by Barcode Number accessories
route.get('/searchproductbybarcodeaccessories',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const {barCode}= req.query
        const searchProduct= await prisma.product.findFirst({
            where:{barcode:barCode,category:'ACCESSORIES'},
           select:{
                id:true,
                name:true,
                description:true,
                basePrice:true,
                stock:true,
                photos:true,
               barcode:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true
            }
        });
        if(!searchProduct){return res.status(404).json({msg:'Product Not Found'})}
        return res.status(200).json({searchProduct})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//searchProduct by Barcode Number prefume
route.get('/searchproductbybarcodeprefume',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const {barCode}= req.query
        const searchProduct= await prisma.product.findFirst({
            where:{barcode:barCode,category:'PERFUME'},
           select:{
                id:true,
                name:true,
                description:true,
                basePrice:true,
                stock:true,
                photos:true,
                barcode:true,
                weight:true,
                updatedAt: true,
                createdAt:true,
                baseOriginalPrice:true,
                productStatus:true
            }
        });
        if(!searchProduct){return res.status(404).json({msg:'Product Not Found'})}
        return res.status(200).json({searchProduct})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get all order today
route.get('/dailyallorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const totalOrders= await prisma.order.count({
            where:{createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{createdAt:{gte:startOfToday, lt:endOfToday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//get all order yesterday
route.get('/yesterdayallorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

            const totalOrders= await prisma.order.count({
            where:{createdAt:{gte:startOfYesterday, lt:endOfYesterday}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{createdAt:{gte:startOfYesterday, lt:endOfYesterday}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get all order week
route.get('/weeklyallorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
              const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});



//get all order month
route.get('/monthlyallorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

            const totalOrders= await prisma.order.count({
            where:{createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{createdAt:{gte:currentStart, lt:currentEnd}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get all order year
route.get('/yearlyallorders',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
         const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

            const totalOrders= await prisma.order.count({
            where:{createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const page= Number(req.params.page||1);
        const limit= Number(req.params.limit||20);
        const skip=(page-1)*limit

        const allOrders= await prisma.order.findMany({
            where:{createdAt:{gte:startOfYear, lt:endOfYear}},
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
            take:limit,
            skip:skip,
            orderBy:{createdAt:'desc'}
        });

        return res.status(200).json({totalOrders, allOrders, totalPage:Math.ceil(totalOrders/limit)})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//get All Order/details
route.get('/getallorderdetails/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
       const orderId=Number(req.params.id)
        const allOrder= await prisma.order.findUnique({
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
        res.status(200).json({allOrder})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//report for today
route.get('/todayreport',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));

        const totalSale= await prisma.order.aggregate({
            _sum:{totalPrice: true},
            where:{status: "DELIVERED", createdAt:{gte:startOfToday, lt:endOfToday}}
        });

        const totalDeliveredOrder= await prisma.order.count({
        where:{status: "DELIVERED", createdAt:{gte:startOfToday, lt:endOfToday}} 
        });

        const totalOrder= await prisma.order.count({
            where:{createdAt:{gte:startOfToday, lt:endOfToday}}
        });

        const totalAmountorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{createdAt:{gte:startOfToday, lt:endOfToday}}
        });

        const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:startOfToday, lt:endOfToday}}
        });
        const totalAmountofCancelledorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'CANCELLED',createdAt:{gte:startOfToday, lt:endOfToday}}
        });

        const totalCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfToday, lt:endOfToday} }
        });

        const totalAmountOfCODOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfToday, lt:endOfToday} }
        });

          const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfToday, lt:endOfToday} }
        });

        const totalAmountOfPaidOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{status:'PAID'},createdAt:{gte:startOfToday, lt:endOfToday} }
        });

          const totalReturnOrder= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:startOfToday, lt:endOfToday} }
        });

        const totalAmountOfReturnOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'RETURN',createdAt:{gte:startOfToday, lt:endOfToday} }
        });

          const totalShippedOrder= await prisma.order.count({
            where:{status:'SHIPPED',createdAt:{gte:startOfToday, lt:endOfToday} }
        });

        const totalAmountOfShippedOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'SHIPPED',createdAt:{gte:startOfToday, lt:endOfToday} }
        });

        
       return res.status(200).json({totalSale, totalDeliveredOrder, totalOrder, totalAmountorder,totalCancelledOrder,totalAmountofCancelledorder,
        totalReturnOrder,totalAmountOfReturnOrder,totalCODOrder,totalAmountOfCODOrder,totalPaidOrder,totalAmountOfPaidOrder,totalShippedOrder,totalAmountOfShippedOrder,mode:'today'
       })

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//report for Yesterday
route.get('/yesterdayreport',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
          const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
                const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

        const totalSale= await prisma.order.aggregate({
            _sum:{totalPrice: true},
            where:{status: "DELIVERED", createdAt:{gte:startOfYesterday, lt:endOfYesterday}}
        });

        const totalDeliveredOrder= await prisma.order.count({
        where:{status: "DELIVERED", createdAt:{gte:startOfYesterday, lt:endOfYesterday}} 
        });

        const totalOrder= await prisma.order.count({
            where:{createdAt:{gte:startOfYesterday, lt:endOfYesterday}}
        });

        const totalAmountorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{createdAt:{gte:startOfYesterday, lt:endOfYesterday}}
        });

        const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:startOfYesterday, lt:endOfYesterday}}
        });
        const totalAmountofCancelledorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'CANCELLED',createdAt:{gte:startOfYesterday, lt:endOfYesterday}}
        });

        const totalCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYesterday, lt:endOfYesterday} }
        });

        const totalAmountOfCODOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYesterday, lt:endOfYesterday} }
        });

          const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYesterday, lt:endOfYesterday} }
        });

        const totalAmountOfPaidOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYesterday, lt:endOfYesterday} }
        });

          const totalReturnOrder= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:startOfYesterday, lt:endOfYesterday} }
        });

        const totalAmountOfReturnOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'RETURN',createdAt:{gte:startOfYesterday, lt:endOfYesterday} }
        });

          
       return res.status(200).json({totalSale, totalDeliveredOrder, totalOrder, totalAmountorder,totalCancelledOrder,totalAmountofCancelledorder,
        totalReturnOrder,totalAmountOfReturnOrder,totalCODOrder,totalAmountOfCODOrder,totalPaidOrder,totalAmountOfPaidOrder})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//report for week
route.get('/weekreport',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
           const curr = new Date();
                const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // Monday start
                firstDayOfWeek.setHours(0, 0, 0, 0);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                lastDayOfWeek.setHours(23, 59, 59, 999);

        const totalSale= await prisma.order.aggregate({
            _sum:{totalPrice: true},
            where:{status: "DELIVERED", createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });

        const totalDeliveredOrder= await prisma.order.count({
        where:{status: "DELIVERED", createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}} 
        });

        const totalOrder= await prisma.order.count({
            where:{createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });

        const totalAmountorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });

        const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });
        const totalAmountofCancelledorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'CANCELLED',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek}}
        });

        const totalCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek} }
        });

        const totalAmountOfCODOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek} }
        });

          const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek} }
        });

        const totalAmountOfPaidOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{status:'PAID'},createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek} }
        });

          const totalReturnOrder= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek} }
        });

        const totalAmountOfReturnOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'RETURN',createdAt:{gte:firstDayOfWeek, lt:lastDayOfWeek} }
        });

          
       return res.status(200).json({totalSale, totalDeliveredOrder, totalOrder, totalAmountorder,totalCancelledOrder,totalAmountofCancelledorder,
        totalReturnOrder,totalAmountOfReturnOrder,totalCODOrder,totalAmountOfCODOrder,totalPaidOrder,totalAmountOfPaidOrder})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//report for month
route.get('/monthreport',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
    const today= new Date();
        const currentMonth= today.getMonth()+1;
        const currentYear = today.getFullYear();

        let prevMonth= currentMonth -1;
        let prevYear= currentYear
        if(prevMonth===0){prevMonth= 12; prevYear= currentYear-1}

        const currentStart= new Date(currentYear, currentMonth -1, 1);
        const currentEnd = new Date(currentYear, currentMonth,1);

        const totalSale= await prisma.order.aggregate({
            _sum:{totalPrice: true},
            where:{status: "DELIVERED", createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const totalDeliveredOrder= await prisma.order.count({
        where:{status: "DELIVERED", createdAt:{gte:currentStart, lt:currentEnd}} 
        });

        const totalOrder= await prisma.order.count({
            where:{createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const totalAmountorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:currentStart, lt:currentEnd}}
        });
        const totalAmountofCancelledorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'CANCELLED',createdAt:{gte:currentStart, lt:currentEnd}}
        });

        const totalCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:currentStart, lt:currentEnd} }
        });

        const totalAmountOfCODOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:currentStart, lt:currentEnd} }
        });

          const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:currentStart, lt:currentEnd} }
        });

        const totalAmountOfPaidOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{status:'PAID'},createdAt:{gte:currentStart, lt:currentEnd} }
        });

          const totalReturnOrder= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:currentStart, lt:currentEnd} }
        });

        const totalAmountOfReturnOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'RETURN',createdAt:{gte:currentStart, lt:currentEnd} }
        });

          
       return res.status(200).json({totalSale, totalDeliveredOrder, totalOrder, totalAmountorder,totalCancelledOrder,totalAmountofCancelledorder,
        totalReturnOrder,totalAmountOfReturnOrder,totalCODOrder,totalAmountOfCODOrder,totalPaidOrder,totalAmountOfPaidOrder})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});


//report for Year
route.get('/yearreport',verification, roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

        const totalSale= await prisma.order.aggregate({
            _sum:{totalPrice: true},
            where:{status: "DELIVERED", createdAt:{gte:startOfYear, lt:endOfYear}}
        });

        const totalDeliveredOrder= await prisma.order.count({
        where:{status: "DELIVERED", createdAt:{gte:startOfYear, lt:endOfYear}} 
        });

        const totalOrder= await prisma.order.count({
            where:{createdAt:{gte:startOfYear, lt:endOfYear}}
        });

        const totalAmountorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{createdAt:{gte:startOfYear, lt:endOfYear}}
        });

        const totalCancelledOrder= await prisma.order.count({
            where:{status:'CANCELLED',createdAt:{gte:startOfYear, lt:endOfYear}}
        });
        const totalAmountofCancelledorder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'CANCELLED',createdAt:{gte:startOfYear, lt:endOfYear}}
        });

        const totalCODOrder= await prisma.order.count({
            where:{payment:{paymentmethod:'COD'},createdAt:{gte: startOfYear, lt:endOfYear} }
        });

        const totalAmountOfCODOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{paymentmethod:'COD'},createdAt:{gte:startOfYear, lt:endOfYear} }
        });

          const totalPaidOrder= await prisma.order.count({
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYear, lt:endOfYear} }
        });

        const totalAmountOfPaidOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{payment:{status:'PAID'},createdAt:{gte:startOfYear, lt:endOfYear} }
        });

          const totalReturnOrder= await prisma.order.count({
            where:{status:'RETURN',createdAt:{gte:startOfYear, lt:endOfYear} }
        });

        const totalAmountOfReturnOrder= await prisma.order.aggregate({
            _sum:{totalPrice:true},
            where:{status:'RETURN',createdAt:{gte:startOfYear, lt:endOfYear} }
        });

          
       return res.status(200).json({totalSale, totalDeliveredOrder, totalOrder, totalAmountorder,totalCancelledOrder,totalAmountofCancelledorder,
        totalReturnOrder,totalAmountOfReturnOrder,totalCODOrder,totalAmountOfCODOrder,totalPaidOrder,totalAmountOfPaidOrder})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

// get all variant by product
route.get('/allvariant/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const productId=Number(req.params.id)
        const allVariants= await prisma.variants.findMany({
            where:{productId},
            select:{
                price:true,originalPrice:true, size:true,color:true,variant:true, id:true
            }
        });
        return res.status(200).json({allVariants})

    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//delete Varient by product
route.delete('/deletevariant/:id',verification,roleAuthorize('ADMIN'),async(req,res)=>{
    try{
        const id=Number(req.params.id)
        const variants= await prisma.variants.findUnique({
            where:{id}
        });
        if(!variants){res.status(404).json({msg:'Variants Not Found'})}
        await prisma.variants.delete({
            where:{id}
        });
        res.status(200).json({msg:'Variant Delete Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});

//edit variant by product
route.put('/editvariant/:id',verification,roleAuthorize('ADMIN'), async(req,res)=>{
    try{
        const id=Number(req.params.id);
        const {price,originalPrice ,size,color,variant}=req.body;
        const variants= await prisma.variants.findUnique({
            where:{id}
        });
        if(!variants){res.status(404).json({msg:'Variants Not Found'})};
        await prisma.variants.update({
            where:{id},
            data:{price:parseFloat(price), originalPrice:parseFloat(originalPrice) ,size, color,variant}
        });
        return res.status(200).json({msg:'Variant Update Successfully'})
    }catch(err){console.error(err); return res.status(500).json({msg: 'Server Error'})}
});











module.exports=route