"use client"
import { useEffect, useState } from "react";
import ProductSummary from "../../../../component/ProductSummary"
import { useParams } from "next/navigation"
import { fetchWithAuth } from "../../../../Utils/fetchWithAuth";
import AOS from 'aos';
import Link from "next/link";
import 'aos/dist/aos.css'



export default function confirmedOrderDetails(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const params=useParams();
    const {id}=params
   
    
    const [detailsData, setDetailsData]=useState(null)
   
    const getDetailsData=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/deliveredorderdestials/${id}`)
        setDetailsData(res.deliveredOrder );
     
    
    };


    useEffect(()=>{
              AOS.init({
            duration:1000,once:false,mirror:false
             });
            AOS.refresh();
        getDetailsData(id);
    },[])
    return(
       <>
   
    <div className="mx-auto overflow-hidden grid grid-cols-1 w-full">
            <div className="grid grid-cols-1 justify-items-center mt-[15px]  mx-[10px]" data-aos='fade-up'>
                 <h1 className="  text-xl mb-[15px] text-gray-400 font-semibold">Order Summary</h1>
                 <div className="grid grid-cols-1 gap-2">
                    {detailsData?.items?.map((item)=>(
                        <div key={item.id}>
                        <ProductSummary  name={item?.product?.name} photo={item?.product?.photos[0]?.url} size={item?.size} price={item?.unitPrice} quantity={item?.quantity} variant={item?.variant} color={item?.color}/>
                        </div>
                    ))}
                        
                        
                 </div>
             
            </div>

            <div className=" mx-[10px] my-[15px]"  data-aos='fade-up'>
                <h1 className=" text-center text-xl text-gray-400 font-semibold mb-[15px]">Shipping Address</h1>
                <div className=" w-full text-sm">
               <div className="grid grid-cols-1 gap-1 border-1 p-3 rounded-xl border-gray-400 ">
                <h1 className="bg-blue-500 rounded-sm p-2 w-[60px] text-white text-center">{detailsData?.address?.label}</h1>
                <h1>{detailsData?.address?.name}</h1>
                <h1>{detailsData?.address?.phone}</h1>
                
                <div className="flex gap-1">
                    <h1>{detailsData?.address?.line1}</h1>
                    <h1>{detailsData?.address?.barangay}</h1>
                </div>
                <div className="flex gap-1">
                    <h1>{detailsData?.address?.city}-</h1>
                    <h1>{detailsData?.address?.postalCode}</h1>
                </div>
                <h1>{detailsData?.address?.province}</h1>
               </div>
                </div>
            </div>
              <div className=" mx-[10px] my-[15px]"  data-aos='fade-up'>
                <h1 className=" text-center text-xl text-gray-400 font-semibold mb-[15px]">Shipping Information</h1>
                <div className=" w-full text-sm">
               <div className="grid grid-cols-1 gap-1 border-1 p-3 rounded-xl border-gray-400 ">
                <h1>Courier Name : {detailsData?.courier?.courierName}</h1>
                <h1>Tracking Link : <Link href={`${detailsData?.courier?.courierLink}`} ><span>{detailsData?.courier?.courierLink}</span></Link> </h1>
                 <h1>Tracking Number :  {detailsData?.trackingNumber} </h1>
                 <h1>Shipping Date:{new Date(detailsData?.updatedAt).toDateString()}</h1>
               </div>
                </div>
            </div>

              <div className=" mx-[10px] my-[15px]"  data-aos='fade-up'>
                <h1 className=" text-center text-xl text-gray-400 font-semibold mb-[15px]">Payment Summary</h1>
                <div className=" w-full text-sm">
               <div className="grid grid-cols-1 gap-1 border-1 p-3 rounded-xl border-gray-400 ">
                <h1>Transection No : {detailsData?.payment?.transactionId}</h1>
                <h1 className="font-semibold">Payment Amount : ₱{detailsData?.payment?.amount} <span className="text-xs text-[11px] text-gray-400">(*Including Shipping Fee)</span></h1>
                
                 <div className="flex gap-1 justify-between mr-[10px]">
                    <h1 className="font-semibold">Payment Method : {detailsData?.payment?.paymentmethod}</h1>
                    <h1 className="font-semibold">Payment Status : {detailsData?.payment?.status}</h1>
                    <h1>Currancy : {detailsData?.payment?.currency}</h1>
                </div>
                 <h1>Created At : {new Date(detailsData?.payment?.createdAt).toDateString()}</h1>
               </div>
                </div>
            </div>
             <div className=" mx-[10px] my-[15px]"  data-aos='fade-up'>
                <h1 className=" text-center text-xl text-gray-400 font-semibold mb-[15px]">User Information</h1>
                <div className=" w-full text-sm">
               <div className="grid grid-cols-1 gap-1 border-1 p-3 rounded-xl border-gray-400 ">
                <h1>Name : {detailsData?.user?.name}</h1>
                <h1>Email : {detailsData?.user?.email}</h1>
                 <h1>Phone : {detailsData?.user?.phone} </h1>
               </div>
                </div>
            </div>

        

    </div>
           
        </>
    )
}