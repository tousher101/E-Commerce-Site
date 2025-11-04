"use client"
import Link from "next/link"
import { useGlobalContext } from "../../context/globalContext"
import AddAdminModal from '../../component/AddAdminModal'
import { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css'
import { fetchWithAuth } from "../../Utils/fetchWithAuth";
import Alert from "../../Utils/Alert";
import ChangePasswordModal from '../../component/ChangePasswordModal'



export default function layout({children}){
const BaseURI=process.env.NEXT_PUBLIC_API_URI
 const{adminDashboardCount}=useGlobalContext();
 const [addAdminModal, setAddAdminModal]=useState(false);
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [phone,setPhone]=useState('');
 const [password,setPassword]=useState('');
 const [secretCode, setSecretCode]=useState('');
 const [msg,setMsg]=useState(null);
 const [type, setType]=useState(null);
 const [changePassModal, setChangePassModal]=useState(false);
 const [currentPassword, setCurrentPassword]=useState('');
 const [newPassword, setNewPassword]=useState('');
 const [confirmNewPass, setConfirmNewPass]=useState('');

const addNewAdmin=async()=>{
const res=await fetchWithAuth(`${BaseURI}/api/auth/addadmin`,{
    method:'PUT',
    body:JSON.stringify({name,email,phone,password,secretCode})
});
setMsg(res.msg);setType('Success');setName('');setEmail(''); setPassword('');setPhone('');setSecretCode('');addAdminModal(false)

};

const changePassword=async()=>{
    if(newPassword!==confirmNewPass){setMsg('Confirm Password Not Match'); setType('Error'); return}
    const res= await fetchWithAuth(`${BaseURI}/api/auth/changepassword`,{
        method:'PUT',
        body:JSON.stringify({newPassword,currentPassword})
    });
    setMsg(res.msg); setType('Success'); setNewPassword(''); setCurrentPassword(''); setConfirmNewPass(''); setChangePassModal(false)

};

 useEffect(()=>{
       AOS.init({
    duration:1000,once:false,mirror:false
        });
    AOS.refresh();
 },[])

    return(
            <>
            <div className=" mx-[10px] overflow-hidden mb-[80px]">
            <div className="flex gap-3">
            <div data-aos='fade-up' className="flex flex-[20%] shadow-xl h-[850px] rounded-xl ">
                <div className="grid grid-cols-1 gap-2 p-3">
                        <div className="grid grid-cols-1 justify-items-center items-center my-[25px] gap-3">
                        <Link href={'/admindashboard/addproduct'}><button className="p-2.5 rounded-xl bg-gray-800 cursor-pointer text-white">+ Add Product</button></Link>
                        <button onClick={()=>{setAddAdminModal(true)}} className="p-2.5 rounded-xl bg-gray-800 cursor-pointer text-white">+ Add Admin</button>
                       <button onClick={()=>{setChangePassModal(true)}} className="p-2.5 rounded-xl bg-gray-800 cursor-pointer text-white">Change Password</button>
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
                         <Link href={'/admindashboard/orderrequest'}><h1 className="p-2 ">Order Request ({adminDashboardCount?.totalPendingOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/hand-paper-check.gif"/>
                        <Link href={'/admindashboard/confirmedorder'}><h1 className="p-2">Confirmed Order ({adminDashboardCount?.totalConfirmedOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/warehouse.gif"/>
                        <Link href={'/admindashboard/shippedorder'}><h1 className="p-2">Shipped Order ({adminDashboardCount?.totalShippedOrder})</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/shippe.gif"/>
                        <Link href={'/admindashboard/deliveredorder'}><h1 className="p-2 ">Delivered Order ({adminDashboardCount?.totalDeliveredOrder})</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/delivery.gif"/>
                        <Link href={'/admindashboard/cancelledorder'}><h1 className="p-2">Cancel Order ({adminDashboardCount?.totalCancelOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/receipt.gif"/>
                        <Link href={'/admindashboard/paidorder'}><h1 className="p-2">Paid Order ({adminDashboardCount?.totalPaidOrder})</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/cash-on-delivery.png"/>
                         <Link href={'/admindashboard/codorder'}><h1 className="p-2">COD Order ({adminDashboardCount?.totalCODOrder})</h1></Link>
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
        {addAdminModal&&<AddAdminModal closeModal={()=>{setAddAdminModal(false);setName('');setEmail(''); setPassword('');setPhone('');setSecretCode('')}} nameValue={name} nameOnCh={(e)=>{setName(e.target.value)}}
         emailValue={email} emailOnCh={(e)=>{setEmail(e.target.value)}} phoneValue={phone} phoneOnCh={(e)=>{setPhone(e.target.value)}} passwordValue={password}
         passwordOnCh={(e)=>{setPassword(e.target.value)}} secPassValue={secretCode} secPassOnCh={(e)=>{setSecretCode(e.target.value)}} submitAdmin={()=>{addNewAdmin()}}   />}  

         {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        {changePassModal&&<ChangePasswordModal closeModal={()=>{setChangePassModal(false);setNewPassword(''); setCurrentPassword(''); setConfirmNewPass('');}} currentPassValue={currentPassword} currentPassOnCh={(e)=>{setCurrentPassword(e.target.value)}}
        newPassValue={newPassword} newPassOnCh={(e)=>{setNewPassword(e.target.value)}} confirmNewPassValue={confirmNewPass} confirmNewPassOnCh={(e)=>{setConfirmNewPass(e.target.value)}}
        submitChange={()=>{changePassword()}} />}
        </> 
        
    )
}