"use client"
import { useEffect, useState } from "react";
import {useUserInfo} from "../../../context/userInfo"
import Alert from "../../../Utils/Alert"
import { fetchWithAuth } from "../../../Utils/fetchWithAuth";
import { maskText } from "../../../Utils/maskText";
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function referral(){
    const BASEURI=process.env.NEXT_PUBLIC_API_URI;
    const FRONTENDURI='http://localhost:3000'
    const {userInfo}=useUserInfo();
    const text= `${FRONTENDURI}/signup?ref=${userInfo?.referralCode}`;
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [refData, setRefData]=useState(null);

    const getReferralData=async()=>{
        const res=await fetchWithAuth(`${BASEURI}/api/user/referral`)
        setRefData(res);
    };

    useEffect(()=>{
          
          AOS.init({
            duration:1000,once:false,mirror:false
          });
          AOS.refresh();
        getReferralData();
    },[])

    const copyToClipboard=()=>{
    navigator.clipboard.writeText(text);
    setMsg('Copy To Clipboard');
    setType('Sucess')
    }
    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" w-full mx-auto  overflow-hidden ">
           <h1 className="text-center text-3xl text-gray-500 font-bold my-[30px]">Referral <span className="text-green-500">Dashboard</span></h1>
           <div className="w-full mb-[10px] lg:flex md:flex grid grid-cols-1 lg:justify-center md:justify-center justify-items-center items-center  gap-2">
            <h1 className="text-center">Your Referral Code:</h1>
            <h1 className="border-1 border-gray-300 p-2 rounded-xl">{text}</h1>
            
            <button onClick={copyToClipboard} className="border-1 ml-[10px] rounded-xl border-gray-300 p-1 cursor-pointer"><img className="h-[35px] w-[35px]" src="/copy.gif"/></button>
           </div>
           <div className="flex justify-center flex-wrap gap-5 mt-[30px] w-full">
            <div data-aos='flip-left' className="text-xl font-semibold h-[100px] grid grid-cols-1 justify-items-center items-center p-4 rounded-xl bg-gradient-to-r from-[#f7fdf6] to-[#77f55e] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a]">
                <h1>Bonus Amout</h1>
                <h2> ₱ {refData?.wallet}</h2>
            </div>
            <div data-aos='flip-right' className="text-xl font-semibold h-[100px] grid grid-cols-1 justify-items-center items-center p-4 rounded-xl bg-gradient-to-r from-[#38c538] to-[#53e960] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a]">
                <h1>Total Referred</h1>
                <h2>{refData?.totalRef}</h2>
            </div>
           </div>
           <div className="my-[30px]">
            <h1 className="text-center text-3xl text-gray-500 font-bold">Referred <span className="text-green-500">User</span></h1>
            
            <div className="grid grid-cols-1 gap-2 mt-[20px]">

            {refData?.user?.referredUser?.map((ref)=>(
                <div data-aos='slide-up' key={ref?.id} className="border-1 border-gray-300 rounded-xl bg-red-400 lg:flex md:flex  lg:justify-around md:justify-around grid grid-cols-1 justify-items-center p-1 w-full  ">
                <h1>{maskText(ref?.name)}</h1>
                <h2>{maskText(ref?.email)}</h2>
                <h3>{maskText(ref?.phone)}</h3>
                <h3>{new Date(ref?.createdAt).toDateString()}</h3>
            </div>
            ))}

            
          

            </div>
           </div>
        </div>
        </>
    )
}