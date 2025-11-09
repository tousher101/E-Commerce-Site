"use client"
import { useState,useEffect } from "react";
import Product from "../../component/Product"
import Alert from '../../Utils/Alert';
import {fetchWithAuth} from '../../Utils/fetchWithAuth'

export default function prefume() {
const [currentpage, setCurrentPage]=useState(1);
   const [productData, setProductData]=useState([]);
   const [totalPage, setTotalPage]=useState(0);
   const [allproduct, setAllproduct]=useState(0);
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);
   const BaseURI=process.env.NEXT_PUBLIC_API_URI
  
   const getProduct=async(page)=>{
    const res=await fetchWithAuth(`${BaseURI}/api/user/perfume?page=${page}&limit=${16}`)
    setProductData(res.getPerfumeProduct);
    setTotalPage(res.totalPage);
    setAllproduct(res.totalPerfumeProduct)
   };
   useEffect(()=>{
    getProduct(currentpage)
   },[currentpage])
  

    const handleNext=()=>{
        if(currentpage<totalPage){setCurrentPage((p)=>p+1)}else{setMsg('No More Product Available'); setType('Error')}
    };
    
    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=' max-w-[1380px] mx-[10px] overflow-hidden'>
            <h1 className="text-gray-500 ml-[20px] font-bold text-3xl mt-[25px]">Prefume <span className="text-green-500">Product ({allproduct})</span> </h1>
            <div className="flex flex-wrap justify-center gap-1">
            {productData?.map((pro)=>(
            <div key={pro.id}>
            <Product name={pro.name} description={pro.description} price={pro.price} stock={pro.stock} photos={pro.photos[0]?.url}
            sold={pro.soldCount} comment={pro._count.comment} productId={pro.id} originalPrice={pro?.originalPrice} />
            </div>
            ))}
            </div>
              {totalPage>1&&<div className='flex justify-between mb-[20px] mx-[10px]'>
                <button onClick={()=>{setCurrentPage((p)=>p-1,1)}} disabled={totalPage<1}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Previous</button>
                <button onClick={handleNext} className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Next</button>
            </div>}
        </div>
        </>
        )
}