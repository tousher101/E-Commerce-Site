"use client"
import { useEffect, useState } from 'react';
import OrderCard from '../../../component/OrderCard'
import { fetchWithAuth } from '../../../Utils/fetchWithAuth'
import Alert from '../../../Utils/Alert';
import AOS from 'aos';
import 'aos/dist/aos.css'
import { useRouter } from 'next/navigation';


export default function paidOrder(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
   const [orderData, setOrderData]=useState([]);
   const [totalOrder, setTotalOrder]=useState(0);
   const [totalPage, setTotalPage]=useState(0);
   const [page, setPage]=useState(1);
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);
   const [mode,setMode]=useState('today')
   
    const router=useRouter();

    const goDetails=(id)=>{
    router.push(`paidorder/${id}`)
   };

    const fetchData=async(page)=>{
      const endPoint= mode==='yesterday'?`${BaseURI}/api/admin/yesterdaypaidorders?page=${page}&limit=${20}`
       :mode==='week'?`${BaseURI}/api/admin/weeklypaidorders?page=${page}&limit=${20}`
       :mode==='currentmonth'?`${BaseURI}/api/admin/monthlypaidorders?page=${page}&limit=${20}`
       : mode==='year'?`${BaseURI}/api/admin/yearlypaidorders?page=${page}&limit=${20}`
       :`${BaseURI}/api/admin/todaypaidorders?page=${page}&limit=${20}`
   
       const res= await fetchWithAuth(endPoint)
       setOrderData(res.allOrders);
       setTotalOrder(res.totalOrders);
       setTotalPage(res.totalPage);
   };

   useEffect(()=>{
       AOS.init({
    duration:1000,once:false,mirror:false
     });
    AOS.refresh();
    fetchData(page)
   },[page,mode]);

    const handelNext=()=>{
    if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Paid Order Available'); setType('Error'); return}
   };
    return(
         <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto w-full overflow-hidden">
        <h1 className="text-center text-gray-500 my-[20px] text-3xl font-bold"> Paid <span className='text-green-500'>Order ({totalOrder})</span></h1>
        <div className='flex gap-2 items-center ml-[10px] justify-center'>
             <button onClick={()=>{setMode('today');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "today" ? "bg-gray-800 text-white" : "text-gray-600"
            } `}>Today</button>

             <button onClick={()=>{setMode('yesterday');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "yesterday" ? "bg-gray-800 text-white" : "text-gray-600"
            } `}>Yesterday</button>

             <button onClick={()=>{setMode('week');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "week" ? "bg-gray-800 text-white" : "text-gray-600"
            } `}>This Week</button>

          <button onClick={()=>{setMode('currentmonth');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "currentmonth" ? "bg-gray-800 text-white" : "text-gray-600"
            } `}>Current Month</button>


        <button onClick={()=>{setMode('year');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "year" ? "bg-gray-800 text-white" : "text-gray-600"
            }`}>This Year</button>
        </div>
        <div className='grid grid-cols-1 gap-1.5 items-center'>
        {orderData?.length>0? orderData?.map((order)=>(
        <div key={order.id} data-aos='slide-up'>
        <OrderCard photo={order?.items[0]?.product?.photos[0]?.url} orderId={order?.id} amount={order?.totalPrice} orderStatus={order?.status}
        paymentStatus={order?.payment?.status} paymentMethod={order?.payment?.paymentmethod} paymentCreate={order?.payment?.createdAt} userName={order?.user?.name}
        userEmail={order?.user?.email} userPhone={order?.user?.phone} orderCreate={order?.createdAt} goDetails={()=>{goDetails(order?.id)}}  />
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