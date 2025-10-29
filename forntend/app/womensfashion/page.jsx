"use client"
import { useState,useEffect } from "react";
import Product from "../../component/Product"
import Alert from '../../Utils/Alert';
import {fetchWithAuth} from '../../Utils/fetchWithAuth'
export default function womenFashion(){
 const [currentpage, setCurrentPage]=useState(1);
   const [productData, setProductData]=useState([]);
   const [totalPage, setTotalPage]=useState(0);
   const [allproduct, setAllproduct]=useState(0);
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);
   const BaseURI=process.env.NEXT_PUBLIC_API_URI
  
   const getProduct=async(page)=>{
    const res=await fetchWithAuth(`${BaseURI}/api/user/womenfashion?page=${page}&limit=${16}`)
    setProductData(res.getWomensProduct);
    setTotalPage(res.totalPage);
    setAllproduct(res.totalWomensProduct)
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
        <div className=' mx-[10px] overflow-hidden'>
            <h1 className="text-center font-semibold text-3xl mt-[50px]">Women's Product ({allproduct})</h1>
            <div className="grid grid-cols-4 gap-1">
            {productData?.map((pro)=>(
            <div key={pro.id}>
            <Product name={pro.name} description={pro.description} price={pro.price} stock={pro.stock} photos={pro?.photos[0]?.url}
            sold={pro.order.quantity} comment={pro._count.comment} productId={pro.id} />
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