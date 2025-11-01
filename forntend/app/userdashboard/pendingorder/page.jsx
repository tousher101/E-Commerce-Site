"use client"
import OrderCard from '../../../component/OrderCard'
import {fetchWithAuth} from '../../../Utils/fetchWithAuth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function pendingOrder(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
   const [orderData, setOrderData]=useState([]);
   const [totalOrder, setTotalOrder]=useState(0);
   const router=useRouter();

   const getOrderData=async()=>{
    const res=await fetchWithAuth(`${BaseURI}/api/user/allpendingorder`)
    setOrderData(res.pendingOrder);
    setTotalOrder(res.totalPendingOrder)
   };
   useEffect(()=>{
      AOS.init({
    duration:1000,once:false,mirror:false
     });
    AOS.refresh();
    
    getOrderData();
   },[]);

   const goDetails=(id)=>{
    router.push(`pendingorder/${id}`)
   }

  
   
    return(
        <div className=" mx-auto overflow-hidden">
        <h1 className="text-center text-gray-500 my-[20px] text-2xl font-semibold">Pending Order ({totalOrder})</h1>
        <div className='grid grid-cols-1 gap-1.5 items-center'>
        {orderData?.length>0? orderData?.map((order)=>(
        <div key={order.id} data-aos='slide-up'  >
        <OrderCard photo={order?.items[0]?.product?.photos[0]?.url} orderId={order?.id} amount={order?.totalPrice} orderStatus={order?.status}
        paymentStatus={order?.payment?.status} paymentMethod={order?.payment?.paymentmethod} paymentCreate={order?.payment?.createdAt} userName={order?.user?.name}
        userEmail={order?.user?.email} userPhone={order?.user?.phone} orderCreate={order?.createdAt} goDetails={()=>{goDetails(order.id)}} />
        </div>)) : <h1 className= 'text-center mt-50 text-4xl text-gray-500 font-semibold'> Pending Order Not Available</h1>}
        </div>
        </div>
    )
}