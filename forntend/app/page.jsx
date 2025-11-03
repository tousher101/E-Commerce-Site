"use client"
import { useEffect, useState } from 'react'
import Bannar from '../component/Bannar'
import Category from '../component/Category'
import Products from '../component/Product'
import { fetchWithAuth } from '../Utils/fetchWithAuth'
import Alert from '../Utils/Alert'
import AOS from 'aos';
import 'aos/dist/aos.css'
import Cookie from '../component/Cookie'

export default function Home() {
const BaseURI=process.env.NEXT_PUBLIC_API_URI;
const [products,setProducts]=useState([]);
const [page,setPage]=useState(1);
const [totalPage, setTotalPage]=useState(0);
const [msg, setMsg]=useState(null);
const [type, setType]=useState(null);
const [cookie, setCookie]=useState(false);

const getAllProducts=async(page)=>{
  const res= await fetchWithAuth(`${BaseURI}/api/user/allproduct?page=${page}&limit=${28}`)
  setProducts(res.getAllProduct);
  setTotalPage(res.totalPage);

};

useEffect(()=>{
  getAllProducts(page)
  AOS.init({
    duration:1000,once:false,mirror:false
  });
  AOS.refresh();
  
  
},[page])

useEffect(()=>{
  const cookeiAccepted= sessionStorage.getItem('cookieaccepted')
  if(!cookeiAccepted){setCookie(true)}

},[])
const handelNext=()=>{
  if(page<totalPage){setPage((p)=>p+1)} else{setMsg('No More Product Available'); setType('Error'); return}
}
  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <div className=' mx-auto overflow-hidden'>
      <Bannar/>
      <Category/>
      <div data-aos='fade-left' className='mb-[60px]'>
      <h1 className='text-center text-3xl text-gray-500 font-semibold'>All Products</h1>
      <div  className='grid grid-cols-4 gap-1 '>
        {products?.map((pro)=>(
          <div key={pro.id}>
          <Products name={pro?.name} description={pro?.description} price={pro?.price} photos={pro?.photos[0]?.url} stock={pro?.stock}
           comment={pro?._count?.comment} originalPrice={pro?.originalPrice} productId={pro.id} sold={pro?.soldCount} />
           </div> ))}
      </div>
      
        {totalPage>1&&<div className='flex justify-between mb-[20px] mx-[10px]'>
                <button onClick={()=>{setPage((p)=>p-1,1)}} disabled={totalPage<1}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Previous</button>
                <button onClick={handelNext}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Next</button>
            </div>}
            </div>
     
      </div>
      {cookie&&<Cookie acceptCookie={()=>{
        sessionStorage.setItem('cookieaccepted','true')
        setCookie(false)}}  closeCookie={()=>{setCookie(false)}}/>}
      </>
  )
}
