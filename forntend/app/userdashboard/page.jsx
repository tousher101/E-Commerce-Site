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
        
        <div     className='grid grid-cols-1  mx-[10px] overflow-hidden '>
            <h1 className="text-center text-3xl font-semibold text-gray-500 my-[30px]">Your Dashboard</h1>
            <UserDashBoardCard pendingOrder={data?.totalPendingOrder} confirmedOrder={data?.totalConfirmedOrder} shippedOrder={data?.totalShippedOrder}
            deliveredOrder={data?.totalDeliveredOrder} paidOrder={data?.totalPaidOrder} cancelledOrder={data?.totalCancelOrder}  />
        </div>
    )
}