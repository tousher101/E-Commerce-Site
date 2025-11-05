"use client"
import { useEffect, useState } from 'react';
import AdminCard from '../../component/AdminCard'
import Chart from '../../component/Chart'
import {fetchWithAuth} from '../../Utils/fetchWithAuth'
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function  admindashboard(){
const BaseURI= process.env.NEXT_PUBLIC_API_URI;
const [cardData, setCardData]=useState(null);
const [chartData, setChartData]=useState(null);

const getCardData=async()=>{
    const res=await fetchWithAuth(`${BaseURI}/api/admin/getmonthlydata`)
    setCardData(res)
    
};

const getChartData=async()=>{
    const res= await fetchWithAuth(`${BaseURI}/api/admin/chartdata`)
    setChartData(res?.salesData)
}
useEffect(()=>{
      AOS.init({
        duration:1000,once:false,mirror:false
            });
        AOS.refresh();
    getChartData();
    getCardData();
         
},[]);


    return (
        
        <div className='grid grid-cols-1  mx-auto overflow-hidden '>
           <h1 className="text-center text-3xl font-semibold text-gray-500 my-[30px]">Admin Dashboard</h1>
           <div data-aos='fade-up' className='h-[400px] w-full'>
            <Chart chartData={chartData}  />
           </div>
            
            
            <AdminCard prevSales={cardData?.prev} currSales={cardData?.current} salesGrowth={cardData?.growth} prevOrder={cardData?.prevConfirmedOrder}
            currOrder={cardData?.currentConfirmedOrder} orderGrowth={cardData?.orderConfirmedGrowth} 
            currPendingOrder={cardData?.currentMonthPendingOrder}   
            currShippendOrder={cardData?.currentMonthShippedOrder} prevDeliveredOrder={cardData?.prevDeliverdOrder}
            currDeliveredOrder={cardData?.currentDeliverdOrder} deliveredOrderGrwoth={cardData?.orderDeliverdGrowth} prevCancelledOrder={cardData?.prevCancelledOrder}
            currCancelledOrder={cardData?.currentCancelledOrder} cancelledOrderGrowth={cardData?.orderCancelledGrowth} confOrder={cardData?.confOrder} />
            </div>
    )
    
}