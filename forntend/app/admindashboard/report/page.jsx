"use client"
import { useState,useEffect } from "react";
import { fetchWithAuth } from "../../../Utils/fetchWithAuth";


export default function report(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI
    const [mode, setMode]=useState('today');

    const [reportData, setReportData]=useState(null)


    const fetchData=async(page)=>{
      const endPoint= mode==='yesterday'?`${BaseURI}/api/admin/yesterdayreport`
       :mode==='week'?`${BaseURI}/api/admin/weekreport`
       :mode==='currentmonth'?`${BaseURI}/api/admin/monthreport`
       : mode==='year'?`${BaseURI}/api/admin/yearreport`
       :`${BaseURI}/api/admin/todayreport`
   
       const res= await fetchWithAuth(endPoint)
        setReportData(res)
   };

   const printReport=()=>{
    window.print();
   }

   useEffect(()=>{
    fetchData();
   },[mode])


    return(
        <div className="w-full overflow-hidden ">
            <h1 className="text-center text-gray-500 font-bold text-3xl">Rep<span className="text-green-500">ort</span></h1>
                <div className='flex flex-wrap gap-2 items-center ml-[10px] justify-center mt-[25px]'>
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

            <button onClick={printReport} className="h-[35px] w-[35px] border-1 border-gray-400 rounded-sm cursor-pointer ml-[25px] block print:hidden"><img src="/printer.gif" className="h-[30px] w-[30px]"/></button>
        </div>
           

           <div className="p-4">
      

      <table className="min-w-full border border-gray-300 ">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b text-left">Description</th>
            <th className="p-2 border-b text-center">Total Order</th>
            <th className="p-2 border-b text-center">Total Amount</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td className="text-left p-2">Total Sales</td>
                <td className="text-center">{reportData?.totalDeliveredOrder}</td>
                <td className="text-center">₱{reportData?.totalSale?._sum?.totalPrice||0}</td>
            </tr>
             <tr>
                <td className="text-left p-2">Total  Orders</td>
                <td className="text-center">{reportData?.totalOrder}</td>
                <td className="text-center">₱{reportData?.totalAmountorder?._sum?.totalPrice||0}</td>
            </tr>
            <tr>
                <td className="text-left p-2">Total Delivered Orders</td>
                <td className="text-center">{reportData?.totalDeliveredOrder}</td>
                <td className="text-center">₱{reportData?.totalSale?._sum?.totalPrice||0}</td>
            </tr>
            <tr>
                <td className="text-left p-2">Total Returnd Orders</td>
                <td className="text-center">{reportData?.totalReturnOrder}</td>
                <td className="text-center">₱{reportData?.totalAmountOfReturnOrder?._sum?.totalPrice||0}</td>
            </tr>
              <tr>
                <td className="text-left p-2">Total COD Orders</td>
                <td className="text-center">{reportData?.totalCODOrder}</td>
                <td className="text-center">₱{reportData?.totalAmountOfCODOrder?._sum?.totalPrice||0}</td>
            </tr>
                <tr>
                <td className="text-left p-2">Total Paid Orders</td>
                <td className="text-center">{reportData?.totalPaidOrder}</td>
                <td className="text-center">₱{reportData?.totalAmountOfPaidOrder?._sum?.totalPrice||0}</td>
            </tr>
                <tr>
                <td className="text-left p-2">Total Cancelled Orders</td>
                <td className="text-center">{reportData?.totalCancelledOrder}</td>
                <td className="text-center">₱{reportData?.totalAmountofCancelledorder?._sum?.totalPrice||0}</td>
            </tr>

              {reportData?.mode==='today'&&<tr>
                <td className="text-left p-2">Total Shipped Orders</td>
                <td className="text-center">{reportData?.totalShippedOrder}</td>
                <td className="text-center">₱{reportData?.totalAmountOfShippedOrder?._sum?.totalPrice||0}</td>
            </tr>}
        
        </tbody>
      </table>
    </div>

        </div>
    )
}