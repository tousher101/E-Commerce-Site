"use client"
import { useState } from "react";
export default function addAdmin({closeModal, nameValue,nameOnCh,emailValue,emailOnCh,phoneValue,phoneOnCh,passwordValue,passwordOnCh, secPassValue,secPassOnCh, submitAdmin}){
              const [openEye,setOpenEye]=useState(true);
                const [closeEye, setCloseEye]=useState(false);
                const [showPass, setShowPass]=useState('password');

            const handleShowPass=()=>{
       if(openEye===true&&showPass==='password'){setOpenEye(false);setCloseEye(true);setShowPass('text')}else{
        setOpenEye(true); setCloseEye(false); setShowPass('password')
       }

    };
    return(
         <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50`} >
        <div data-aos = 'flip-left' className= {` justify-center content-center items-center bg-white p-[25px] rounded-2xl w-[500px] text-center text-black`}>
            <p className='text-3xl mb-[30px] text-gray-400 font-semibold'> Add New Admin</p>
          
                  <div className=" grid grid-cols-1 justify-items-center gap-3 ">
                    <input value={nameValue} onChange={nameOnCh} className="border-1 border-gray-300 p-2 rounded-xl w-full" type="text" placeholder="New Admin Name"/>
                    <input value={emailValue} onChange={emailOnCh}  className="border-1 border-gray-300 p-2 rounded-xl w-full"  type="email" placeholder="New Admin Email"/>
                    <input value={phoneValue} onChange={phoneOnCh}  className="border-1 border-gray-300 p-2 rounded-xl w-full"  type="number" placeholder="New Admin Phone Number"/>
                    
                    <div className="flex items-center gap-2 w-full">
                    <input value={passwordValue} onChange={passwordOnCh}  className="border-1 border-gray-300 p-2 rounded-xl w-full"  type={`${showPass}`} placeholder="New Admin Password"/>
                    {openEye&&<img onClick={handleShowPass} src="/eye.gif" className="w-[30px] h-[30px] cursor-pointer"/>}
                    {closeEye&&<img onClick={handleShowPass} src="/hide.gif" className="w-[30px] h-[30px] cursor-pointer"/>}
                    </div>

                    <div className="flex items-center gap-2 w-full">
                    <input value={secPassValue} onChange={secPassOnCh}  className="border-1 border-gray-300 p-2 rounded-xl w-full"  type={`${showPass}`} placeholder="Main Admin Secrat Password"/>
                    {openEye&&<img onClick={handleShowPass} src="/eye.gif" className="w-[30px] h-[30px] cursor-pointer"/>}
                    {closeEye&&<img onClick={handleShowPass} src="/hide.gif" className="w-[30px] h-[30px] cursor-pointer"/>}
                    </div>
                    
                    
                    </div>
                    <div className="flex justify-center gap-3 mt-[15px]">
                    <button onClick={submitAdmin}  className="p-2 text-white rounded-sm bg-blue-400  cursor-pointer">Submit</button>
                     <button onClick={closeModal}  className="p-2 text-white rounded-sm bg-blue-400  cursor-pointer">Cancel</button>
                    </div>
               
            
                   
        </div>
      
    </div>
    )
}