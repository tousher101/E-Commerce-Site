"use client"
import OrderCard from '../../../component/OrderCard'
import {fetchWithAuth} from '../../../Utils/fetchWithAuth'
import { useState, useEffect } from 'react'
import Alert from '../../../Utils/Alert'
import { useRouter } from 'next/navigation'
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function paidOrder(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
   const [orderData, setOrderData]=useState([]);
   const [totalOrder, setTotalOrder]=useState(0);
    const [page, setPage]=useState(1);
   const [totalPage, setTotalPage]=useState(0);
   const [msg,setMsg]=useState(null);
   const [type, setType]=useState(null);
   
    const router=useRouter()

   const getOrderData=async(page)=>{
    const res=await fetchWithAuth(`${BaseURI}/api/user/allpaidorder?page=${page}&limit=${20}`)
    setOrderData(res.paidOrder);
    setTotalOrder(res.totalPaidOrder);
    setTotalPage(res.totalPage);
   };
   useEffect(()=>{
       AOS.init({
        duration:1000,once:false,mirror:false
        });
        AOS.refresh();
    getOrderData(page);
   },[page]);

    const handelNext=()=>{
    if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Delivered Order Available'); setType('Error'); return}
   };

     const goDetails=(id)=>{
    router.push(`paidorder/${id}`)
   }

    return(
         <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className="w-full h-screen mx-auto overflow-hidden">
                <h1 className="text-center text-gray-500 my-[20px] text-3xl font-bold">Paid <span className='text-green-500'>Order ({totalOrder})</span></h1>
                <div className='grid grid-cols-1 gap-1.5 items-center'>
                {orderData?.length>0? orderData?.map((order)=>(
                <div key={order.id} data-aos='slide-up'>
                <OrderCard photo={order?.items?.product?.photos[0]?.url} orderId={order?.id} amount={order?.totalPrice} orderStatus={order?.status}
                paymentStatus={order?.payment?.status} paymentMethod={order?.payment?.paymentmethod} paymentCreate={order?.payment?.createdAt} userName={order?.user?.name}
                userEmail={order?.user?.email} userPhone={order?.user?.phone} orderCreate={order?.createdAt} goDetails={()=>{goDetails(order.id)}}   />
                </div>)) : <h1 className= 'text-center mt-50 text-4xl text-gray-500 font-semibold'> Paid Order Not Available</h1>}
                </div>
                    {totalPage>1&&<div className='flex justify-around items-center mb-[20px] mx-[10px]'>
                <button onClick={()=>{setPage((p)=>p-1)}} disabled={totalPage===1}  className='h-[40px] w-[100px] text-gray-600  cursor-pointer'>&larr; Previous</button>
                <h1 className='text-gray-600 text-sm'>Page {page} of {totalPage} pages</h1>
                <button onClick={handelNext}  className='h-[40px] w-[100px]  text-gray-600 cursor-pointer'>Next &rarr;</button>
            </div>}
                 </div>
                 </>
    )
}