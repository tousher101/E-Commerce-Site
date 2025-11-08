"use client"
import { fetchWithAuth } from "../../../Utils/fetchWithAuth"
import Alert from "../../../Utils/Alert"
import { useEffect, useState } from "react"
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function manageCourier(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI
    const [msg,setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [courierName, setCourierName]=useState('');
    const [courierLink, setCourierLink]=useState('');
    const [courierData, setCourierData]=useState([]);

    const submitCourier=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/addcourier`,{
            method:'POST',
            body:JSON.stringify({courierLink,courierName})
        });
        setMsg(res.msg); setType('Success');setCourierName('');setCourierLink(''); getAllCourier()
    };
    
    const getAllCourier=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/getallcourier`)
        setCourierData(res.courier)
    };

    useEffect(()=>{
           AOS.init({
         duration:1000,once:false,mirror:false
         });
        AOS.refresh();
        getAllCourier()
    },[])

    const deleteCourier=async(id)=>{
        const res =await fetchWithAuth(`${BaseURI}/api/admin/deletecourier/${id}`,{
            method:'DELETE'
        })
        setMsg(res.msg); setType('Success'); getAllCourier()
    }


    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className="overflow-hidden mx-auto">
            <div className="grid grid-cols-1 justify-center mx-[10px]" data-aos='silde-up'>
                <input value={courierName} onChange={(e)=>{setCourierName(e.target.value)}} type="text" placeholder="Courier Company Name" className="border-1 border-gray-500 rounded-xl p-2"/>
                <input value={courierLink} onChange={(e)=>{setCourierLink(e.target.value)}} type="text" placeholder="Courier Company Website Link" className="border-1 border-gray-500 rounded-xl p-2"/>
            </div>
            <div className="flex justify-center mt-[20px]">
                <button onClick={submitCourier} className="text-white p-2 rounded-sm bg-blue-500 cursor-pointer">Submit</button>
            </div>

            <div className="mx-[10px] mt-[30px]">
                <h1 className="text-center text-2xl text-gray-400 font-semibold">Active Courier Service List</h1>
                <div className="grid grid-cols-1 gap-2" data-aos='slide-up'>
                    {courierData?.map((cou)=>(
                            <div key={cou.id}>
                         <div className=' flex justify-items-center items-center'>
                                <h1>{cou?.courierName}</h1>
                            </div>
                            <div className='flex items-center justify-items-center'>
                                <h1>{cou?.courierLink}</h1>
                            </div>
                            <div className="flex gap-2.5 items-center">
                             <button onClick={()=>{deleteCourier(cou.id)}}  className="border-1 border-gray-300 p-2 rounded-xl cursor-pointer" ><img className="h-[35px] w-[30px]" src="/bin.gif"/></button>
                            </div>
                            </div>
                    ))}
                           

                </div>

            </div>

        </div>
        </>
    )
}