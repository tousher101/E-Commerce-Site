"use client"
import Link from "next/link"
import { fetchWithAuth } from "../../Utils/fetchWithAuth"
import { useState } from "react"
import ChangePasswordModal from '../../component/ChangePasswordModal'
import Alert from "../../Utils/Alert"
export default function layout({children}){
    const [changePassModal,setChangePassModal]=useState(false);
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
     const [currentPassword, setCurrentPassword]=useState('');
    const [newPassword, setNewPassword]=useState('');
    const [confirmNewPass, setConfirmNewPass]=useState('');

    const changePassword=async()=>{
    if(newPassword!==confirmNewPass){setMsg('Confirm Password Not Match'); setType('Error'); return}
    const res= await fetchWithAuth(`${BaseURI}/api/auth/changepassword`,{
        method:'PUT',
        body:JSON.stringify({newPassword,currentPassword})
    });
    setMsg(res.msg); setType('Success'); setNewPassword(''); setCurrentPassword(''); setConfirmNewPass(''); setChangePassModal(false)

};
    return(
        <>
             <div className=" mx-[10px] overflow-hidden mb-[80px]">
            <div className="flex gap-3">
            <div data-aos='slide-up' className="flex flex-[20%] shadow-xl h-[650px] rounded-xl ">
                <div className="grid grid-cols-1 gap-2 p-3">
                        <div className="grid grid-cols-1 justify-items-center items-center my-[25px] gap-3">
                       <button onClick={()=>{setChangePassModal(true)}} className="p-2.5 rounded-xl bg-gray-800 cursor-pointer text-white">Change Password</button>
                        </div>
                    <div className="flex items-center gap-1">
                        <img className="w-[40px] h-[40px]" src="/task-management.gif"/>
                        <h1 className="  text-center text-xl font-semibold mb-[10px]">Manage Order</h1>
                    </div>
                
                    <div className="flex items-center  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/home.gif"/>
                        <Link href={'/userdashboard'}><h1 className="p-2 rounded-xl cursor-pointer ">Home</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/rfp.gif"/>
                         <Link href={'/userdashboard/pendingorder'}><h1 className="p-2 ">Pending Order</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/hand-paper-check.gif"/>
                        <Link href={'/userdashboard/confirmedorder'}><h1 className="p-2">Confirmed Order</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/warehouse.gif"/>
                        <Link href={'/userdashboard/shippedorder'}><h1 className="p-2">Shipped Order</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/shippe.gif"/>
                        <Link href={'/userdashboard/deliveredorder'}><h1 className="p-2 ">Delivered Order</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/delivery.gif"/>
                        <Link href={'/userdashboard/cancelledorder'}><h1 className="p-2">Cancel Order</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/receipt.gif"/>
                        <Link href={'/userdashboard/paidorder'}><h1 className="p-2">Paid Order</h1></Link>
                    </div>

                    
                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/referral.gif"/>
                        <Link href={'/userdashboard/referral'}><h1 className="p-2">Referral</h1></Link>
                    </div>

                </div>
            </div>
            <div className="flex-[80%]  justify-center shadow-xl">
                {children}
                    </div>
               
            </div>
              
        </div>  
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}   
        {changePassModal&&<ChangePasswordModal closeModal={()=>{setChangePassModal(false); setNewPassword(''); setCurrentPassword(''); setConfirmNewPass('')}} currentPassValue={currentPassword} currentPassOnCh={(e)=>{setCurrentPassword(e.target.value)}}
        newPassValue={newPassword} newPassOnCh={(e)=>{setNewPassword(e.target.value)}} confirmNewPassValue={confirmNewPass} confirmNewPassOnCh={(e)=>{setConfirmNewPass(e.target.value)}}
        submitChange={()=>{changePassword()}}/>} 
        </>
        
    )
}