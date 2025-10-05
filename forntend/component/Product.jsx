"use client"

import Image from 'next/image'
import Sold from '../public/sold.png'
import Review from '../public/review.png'
import { useEffect, useState } from 'react'
import Alert from '../Utils/Alert'
import {fetchWithAuth} from '../Utils/fetchWithAuth'



export default function Product({product, page, pages, totalProduct}){
   const [currentpage, setCurrentPage]=useState(page);
   const [productData, setProductData]=useState(product)
   const [totalPage, setTotalPage]=useState(pages)
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);
   const BaseURI= import.meta.NEXT_PUBLIC_API_URI
  
   useEffect(()=>{
    if(currentpage !==1){
       const fetchData= async()=>{
        const res = await fetchWithAuth(`${BaseURI}/api/user/allproduct?page=${currentpage}`)
        const data= await res.json();
        setProductData(data.getAllProduct);
        setTotalPage(data.totalPage);
       };
       fetchData();
    };
   },[currentpage]);

    const handleNext=()=>{
        if(currentpage<totalPage){setCurrentPage((p)=>p+1)}else{setMsg('No More Product Available'); setType('Error')}
    };
    
    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className="max-w-[1380px] mx-[10px] overflow-hidden grid grid-cols-1 mt-[15px] mb-[15px] shadow-xl">
            <h1 className="text-center font-semibold text-3xl mt-[50px]">All Products ({totalProduct})</h1>

            
                {productData?.map((pro)=>(
                         <div key={pro.id}  className=" grid grid-cols-5 gap-5 my-[10px]   ">
                <div className="h-[350px] w-[302px] border-1 border-gray-400 grid grid-cols-1 rounded-xl mb-[10px] hover:scale-102 duration-1000 ml-[5px]">
                    <div className='h-[180px] w-[300px] relative rounded-xl'>
                         <Image className='rounded-xl' src={pro.photos[0]} fill style={{objectFit:'cover'}} alt='productphoto' />
                    </div>

                    <div className='mx-[5px]'>
                    <h1 className='font-semibold text-m'>{pro.name}</h1>
                    <h2 className='text-sm'>{pro.description}</h2>
                    <h2 className='font-bold'>₱ {pro.price}</h2>
                    <h2 className='text-sm'>Stock({pro.stock})</h2>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className='flex items-center gap-1'>
                          <Image src={Sold} height={20} width={20} alt='sold-logo'/>
                            <h1 className='text-gray-500'>Sold({pro._sum.orderItem.quantity})</h1>
                        </div>
                        <div>
                            <h1 className='text-gray-500'>||</h1>
                        </div>
                        <div className='flex items-center justify-between gap-1'>
                            <Image src={Review} height={20} width={20} alt='review-logo'/>
                             <h2 className='text-gray-500'>Review ({pro._count.comment})</h2>
                        </div>
                         
                       
                    </div>
                
                    <div className='mx-[5px] flex justify-center'>
                        <button className='bg-gray-700 mt-[10px] rounded-xl h-[40px] w-[120px] cursor-pointer shadow-xl text-white'>Details</button>
                    </div>

                </div>
             

            </div>

                ))}
               <div className='flex justify-between mb-[20px] mx-[10px]'>
                <button onClick={()=>{setCurrentPage((p)=>Math.max(p-1, 1))}} disabled={currentpage<=1} className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Previous</button>
                <button onClick={handleNext} className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Next</button>
            </div>
           

        </div>
        </>
    )
}