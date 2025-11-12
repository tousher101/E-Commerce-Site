"use client"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "../../Utils/fetchWithAuth"
import AOS from 'aos';
import 'aos/dist/aos.css'

import UserDashBoardCard from "../../component/UserDashboardCard"
export default function userDashboard(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI
    const [data, setData]=useState(null);

    const getCountData=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/allcount`)
        setData(res);
    }
    useEffect(()=>{
          AOS.init({
            duration:1000,once:false,mirror:false
          });
          AOS.refresh();
        getCountData();
        
    },[]);

    return(
        
        <div     className='grid grid-cols-1  overflow-hidden w-full'>
            <h1 className="text-center text-3xl font-bold text-gray-500 my-[25px]">Your <span className="text-green-500">Dashboard</span></h1>
            <UserDashBoardCard pendingOrder={data?.totalPendingOrder} confirmedOrder={data?.totalConfirmedOrder} shippedOrder={data?.totalShippedOrder}
            deliveredOrder={data?.totalDeliveredOrder} paidOrder={data?.totalPaidOrder} cancelledOrder={data?.totalCancelOrder}  />
        </div>
    )
}