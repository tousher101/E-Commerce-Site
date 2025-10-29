"use client"
import { useEffect, useState } from 'react';
import OrderCard from '../../../component/OrderCard'
import { fetchWithAuth } from '../../../Utils/fetchWithAuth'
import Alert from '../../../Utils/Alert';


export default function paidOrder(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
   const [orderData, setOrderData]=useState([]);
   const [totalOrder, setTotalOrder]=useState(0);
   const [totalPage, setTotalPage]=useState(0);
   const [page, setPage]=useState(1);
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);
   const [mode, setMode]=useState(null);

   const getOrderData=async(page)=>{
    const res=await fetchWithAuth(`${BaseURI}/api/admin/paidorder?page=${page}&limit=${20}`)
    setOrderData(res.getCancelledOrder);
    setTotalOrder(res.totalCancelledOrder);
    setTotalPage(res.totalPage);
    setMode(res.mode);
   };
   useEffect(()=>{
    getOrderData(page);
   },[page]);

    const handelNext=()=>{
    if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Paid Order Available'); setType('Error'); return}
   };
    return(
         <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto overflow-hidden">
        <h1 className="text-center text-gray-500 my-[20px] text-2xl font-semibold"> Paid Order ({totalOrder})</h1>
        <div className='grid grid-cols-1 gap-1.5 items-center'>
        {orderData?.length>0? orderData?.map((order)=>(
        <div key={order.id}>
        <OrderCard photo={order?.items?.product?.photos[0]?.url} orderId={order?.id} amount={order?.totalPrice} orderStatus={order?.status}
        paymentStatus={order?.payment?.status} paymentMethod={order?.payment?.paymentmethod} paymentCreate={order?.payment?.createdAt} userName={order?.user?.name}
        userEmail={order?.user?.email} userPhone={order?.user?.phone} mode={mode} trxId={order?.payment?.transactionId} orderCreate={order?.createdAt} />
        </div>)) : <h1 className= 'text-center mt-50 text-4xl text-gray-500 font-semibold'> Paid Order Not Available</h1>}
        </div>

        {totalPage>0&&<div className='flex justify-between mb-[20px] mx-[10px]'>
            <button onClick={()=>{setPage((p)=>p-1,1)}} disabled={totalPage<1}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Previous</button>
            <button onClick={handelNext}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Next</button>
        </div>}

        </div>
        </>
    )
}