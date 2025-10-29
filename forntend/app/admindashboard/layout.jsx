"use client"
import Link from "next/link"
import { fetchWithAuth } from "../../Utils/fetchWithAuth"
import { useEffect, useState } from "react"


export default function layout({children}){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [data,setDate]=useState();
    const getAllCount=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/countorderstatus`)
        setDate(res)
    };
    useEffect(()=>{
        getAllCount()
    },[])

    return(
               <div className=" mx-[10px] overflow-hidden mb-[80px]">
            <div className="flex gap-3">
            <div className="flex flex-[20%] shadow-xl h-[750px] rounded-xl ">
                <div className="grid grid-cols-1 gap-2 p-3">
                        <div className="flex justify-center items-center my-[25px]">
                        <Link href={'/admindashboard/addproduct'}><button className="p-2.5 rounded-xl bg-gray-800 cursor-pointer text-white">+ Add Product</button></Link>
                        </div>
                    <div className="flex items-center gap-1">
                        <img className="w-[40px] h-[40px]" src="/task-management.gif"/>
                        <h1 className="  text-center text-xl font-semibold mb-[10px]">Manage Order</h1>
                    </div>
                
                    <div className="flex items-center  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/home.gif"/>
                        <Link href={'/admindashboard'}><h1 className="p-2 rounded-xl cursor-pointer ">Home</h1></Link>
                    </div>

                     <div className="flex items-center  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/shopping-cart.gif"/>
                        <Link href={'/admindashboard/productbycat'}><h1 className="p-2 rounded-xl cursor-pointer ">All Product</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/rfp.gif"/>
                         <Link href={'/admindashboard/orderrequest'}><h1 className="p-2 ">Order Request ({data?.totalPendingOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/hand-paper-check.gif"/>
                        <Link href={'/admindashboard/confirmedorder'}><h1 className="p-2">Confirmed Order ({data?.totalConfirmedOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/warehouse.gif"/>
                        <Link href={'/admindashboard/shippedorder'}><h1 className="p-2">Shipped Order ({data?.totalShippedOrder})</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/shippe.gif"/>
                        <Link href={'/admindashboard/deliveredorder'}><h1 className="p-2 ">Delivered Order ({data?.totalDeliveredOrder})</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/delivery.gif"/>
                        <Link href={'/admindashboard/cancelledorder'}><h1 className="p-2">Cancel Order ({data?.totalCancelOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/receipt.gif"/>
                        <Link href={'/admindashboard/paidorder'}><h1 className="p-2">Paid Order ({data?.totalPaidOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/cash-on-delivery.png"/>
                         <Link href={'/admindashboard/codorder'}><h1 className="p-2">COD Order ({data?.totalCODOrder})</h1></Link>
                    </div>
                       <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/ship.gif"/>
                         <Link href={'/admindashboard/manageshippingfee'}><h1 className="p-2">Manage Shipping Fee</h1></Link>
                    </div>
                </div>
            </div>
            <div className="flex-[80%]  justify-center shadow-xl">
                {children}
                    </div>
               
            </div>
              
        </div>      
        
    )
}