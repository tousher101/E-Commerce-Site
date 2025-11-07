"use client"
import { useEffect, useState } from 'react';
import OrderCard from '../../../component/OrderCard'
import { fetchWithAuth } from '../../../Utils/fetchWithAuth'
import Alert from '../../../Utils/Alert';
import AOS from 'aos';
import 'aos/dist/aos.css'
import { useRouter } from 'next/navigation';


export default function codOrder(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
   const [orderData, setOrderData]=useState([]);
   const [totalOrder, setTotalOrder]=useState(0);
   const [totalPage, setTotalPage]=useState(0);
   const [page, setPage]=useState(1);
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);
   const [mode, setMode]=useState('CurrentMonth')
    const router=useRouter();

      const goDetails=(id)=>{
    router.push(`codorder/${id}`)
   };

    const fetchData=async(page)=>{
    const endPoint= mode==='PreviousMonth'?`${BaseURI}/api/admin/previousmonthcodorder?page=${page}&limit=${20}`
    :`${BaseURI}/api/admin/currentmonthcodorder?page=${page}&limit=${20}`
    const res= await fetchWithAuth(endPoint)
    setOrderData(res.getCodOrder);
    setTotalOrder(res.totalCodOrder);
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
    if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More COD Order Available'); setType('Error'); return}
   };

    return(
         <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto overflow-hidden">
        <h1 className="text-center text-gray-500 my-[20px] text-2xl font-semibold"> Cahs On Delivery Order ({totalOrder})</h1>
        <div className='flex gap-2 items-center ml-[10px] justify-center'>
          <button onClick={()=>{setMode('CurrentMonth');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "CurrentMonth" ? "bg-gray-800 text-white" : "text-gray-600"
            } `}>Current Month</button>
        <button onClick={()=>{setMode('PreviousMonth');}} className={`p-2 border-1 border-gray-300 rounded-sm text-gray-600 cursor-pointer ${
              mode === "PreviousMonth" ? "bg-gray-800 text-white" : "text-gray-600"
            }`}>Previous Month</button>
        </div>
        <div className='grid grid-cols-1 gap-1.5 items-center'>
        {orderData?.length>0? orderData?.map((order)=>(
        <div key={order.id} data-aos='slide-up'>
        <OrderCard photo={order?.items[0]?.product?.photos[0]?.url} orderId={order?.id} amount={order?.totalPrice} orderStatus={order?.status}
        paymentStatus={order?.payment?.status} paymentMethod={order?.payment?.paymentmethod} paymentCreate={order?.payment?.createdAt} userName={order?.user?.name}
        userEmail={order?.user?.email} userPhone={order?.user?.phone} orderCreate={order?.createdAt} goDetails={()=>{goDetails(order.id)}} />
        </div>)) : <h1 className= 'text-center mt-50 text-4xl text-gray-500 font-semibold'> Cahs On Delivery Order Not Available</h1>}
        </div>

        {totalPage>1&&<div className='flex justify-between mb-[20px] mx-[10px]'>
            <button onClick={()=>{setPage((p)=>p-1)}} disabled={totalPage<=1}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Previous</button>
            <button onClick={handelNext}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Next</button>
        </div>}

        </div>
        </>
    )
}