"use client"
import OrderCard from '../../../component/OrderCard'
import {fetchWithAuth} from '../../../Utils/fetchWithAuth'
import { useState, useEffect } from 'react'

export default function shippedOrder(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
   const [orderData, setOrderData]=useState([]);
   const [totalOrder, setTotalOrder]=useState(0);

   const getOrderData=async()=>{
    const res=await fetchWithAuth(`${BaseURI}/api/user/allshippedorder`)
    setOrderData(res.shippeddOrder);
    setTotalOrder(res.totalShippedOrder)
   };
   useEffect(()=>{
    getOrderData();
   },[]);

    return(
       <div className=" mx-auto overflow-hidden">
        <h1 className="text-center text-gray-500 my-[20px] text-2xl font-semibold">Shipped Order ({totalOrder})</h1>
        <div className='grid grid-cols-1 gap-1.5 items-center'>
        {orderData?.length>0? orderData?.map((order)=>(
        <div key={order.id}>
        <OrderCard photo={order?.items?.product?.photos[0]?.url} orderId={order?.id} amount={order?.totalPrice} orderStatus={order?.status}
        paymentStatus={order?.payment?.status} paymentMethod={order?.payment?.paymentmethod} paymentCreate={order?.payment?.createdAt} userName={order?.user?.name}
        userEmail={order?.user?.email} userPhone={order?.user?.phone} orderCreate={order?.createdAt} />
        </div>)) : <h1 className= 'text-center mt-50 text-4xl text-gray-500 font-semibold'> Shipped Order Not Available</h1>}
        </div>
         </div>
    )
}