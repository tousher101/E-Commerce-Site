"use client"
import { useEffect, useState } from 'react';
import AdminCard from '../../component/AdminCard'
import Chart from '../../component/Chart'
import {fetchWithAuth} from '../../Utils/fetchWithAuth'

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
    getChartData();
    getCardData();
},[]);


    return (
        
        <div className='grid grid-cols-1  mx-auto overflow-hidden '>
           <h1 className="text-center text-3xl font-semibold text-gray-500 my-[30px]">Admin Dashboard</h1>
            <Chart chartData={chartData}/>
            <AdminCard prevSales={cardData?.prev} currSales={cardData?.current} salesGrowth={cardData?.growth} prevOrder={cardData?.prevConfirmedOrder}
            currOrder={cardData?.currentConfirmedOrder} orderGrowth={cardData?.orderConfirmedGrowth} prevPendingOrder={cardData?.prevMonthPendingOrder} 
            currPendingOrder={cardData?.currentMonthPendingOrder} pendingOrderGrowth={cardData?.orderPendingGrowth} prevShippedOrder={cardData?.prevShippedOrder} 
            currShippendOrder={cardData?.currentMonthShippedOrder} shippedOrderGrowth={cardData?.orderShippedGrowth} prevDeliveredOrder={cardData?.prevDeliverdOrder}
            currDeliveredOrder={cardData?.currentDeliverdOrder} deliveredOrderGrwoth={cardData?.orderDeliverdGrowth} prevCancelledOrder={cardData?.prevCancelledOrder}
            currCancelledOrder={cardData?.currentCancelledOrder} cancelledOrderGrowth={cardData?.orderCancelledGrowth} />
            </div>
    )
    
}