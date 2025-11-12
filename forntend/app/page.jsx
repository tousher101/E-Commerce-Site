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
import ProductStatusCard from '../component/ProductStatusCard'
import { useRouter } from 'next/navigation'

export default function Home() {
const BaseURI=process.env.NEXT_PUBLIC_API_URI;
const [products,setProducts]=useState([]);
const [page,setPage]=useState(1);
const [totalPage, setTotalPage]=useState(0);
const [msg, setMsg]=useState(null);
const [type, setType]=useState(null);
const [cookie, setCookie]=useState(false);
const [topSelling, setTopSelling]=useState([]);
const [topPopular, setTopPopular]=useState([]);
const router=useRouter();

const getAllProducts=async(page)=>{
  const res= await fetchWithAuth(`${BaseURI}/api/user/allproduct?page=${page}&limit=${28}`)
  setProducts(res.getAllProduct);
  setTotalPage(res.totalPage);

};

const getTopSelling=async()=>{
  const res= await fetchWithAuth(`${BaseURI}/api/user/gettopselling`)
  setTopSelling(res.topSelling)
};

const getTopPopular=async()=>{
  const res= await fetchWithAuth(`${BaseURI}/api/user/gettoppopular`)
  setTopPopular(res.topPopular)
}

useEffect(()=>{
  getAllProducts(page);
  getTopSelling();
  getTopPopular();
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
    <div className='max-w-[1380px] mx-auto overflow-hidden'>
      <Bannar/>
      <div className='max-w-[1380px] mx-[10px] overflow-hidden flex gap-5 justify-center items-center mt-[25px]'>
        <div className='flex-[50%] justify-center items-center'>
          <h1 className='text-center text-2xl font-bold text-gray-500 mb-[10px] '>Top Sell<span className='text-green-500'>ing Product</span></h1>
          <div className='grid grid-cols-1 justify-items-center gap-2'>
            {topSelling?.map((top)=>(
              <div key={top.id} onClick={()=>{router.push(`/${top.id}`)}} className='w-full cursor-pointer'>
                <ProductStatusCard name={top?.name} price={top?.price} originalPrice={top?.originalPrice} stock={top?.stock} photo={top?.photos[0].url} 
                review={top?._count?.comment} status={top?.productStatus} />
              </div>
                
            ))}
            

          </div>

        </div>


           <div className='flex-[50%] justify-center items-center'>
          <h1 className=' text-center text-2xl font-bold text-gray-500 mb-[10px] '>Top Pop<span className='text-green-500'>ular Product</span></h1>
          <div className='grid grid-cols-1 justify-items-center gap-2'>
                {topPopular?.map((top)=>(
              <div key={top.id} onClick={()=>{router.push(`${top.id}`)}} className='w-full cursor-pointer'>
                <ProductStatusCard name={top?.name} price={top?.price} originalPrice={top?.originalPrice} stock={top?.stock} photo={top?.photos[0].url} 
                review={top?._count?.comment} status={top?.productStatus} />
              </div>
                
            ))}

          </div>

        </div>

      </div>
      <Category/>
      <div className='mb-[60px]'>
      <h1 className='ml-[25px] text-3xl text-gray-500 font-bold'>Pro<span className='text-green-500'>ducts</span></h1>
      <div  className='flex flex-wrap justify-center  gap-2   '>
        {products?.map((pro)=>(
          <div key={pro.id} data-aos='fade-left'>
          <Products name={pro?.name} description={pro?.description} price={pro?.price} photos={pro?.photos[0]?.url} stock={pro?.stock}
           comment={pro?._count?.comment} originalPrice={pro?.originalPrice} productId={pro.id} sold={pro?.soldCount} />
           </div> ))}
      </div>
      
        {totalPage>1&&<div className='flex justify-around items-center mb-[20px] mx-[10px]'>
                <button onClick={()=>{setPage((p)=>p-1)}} disabled={totalPage===1}  className='h-[40px] w-[100px] text-gray-600  cursor-pointer'>&larr; Previous</button>
                <h1 className='text-gray-600 text-sm'>Page {page} of {totalPage} pages</h1>
                <button onClick={handelNext}  className='h-[40px] w-[100px]  text-gray-600 cursor-pointer'>Next &rarr;</button>
            </div>}
            </div>
     
      </div>
      {cookie&&<Cookie acceptCookie={()=>{
        sessionStorage.setItem('cookieaccepted','true')
        setCookie(false)}}  closeCookie={()=>{setCookie(false)}}/>}
      </>
  )
}
