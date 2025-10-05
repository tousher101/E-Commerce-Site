"use client"

import Image from "next/image"
import logo from '../../public/logo.png'
import Link from "next/link"
import flag from '../../public/Flag-phil.png'
import { useState } from "react"

export default function signUp(){
    const [closeEye, setCloseEye]=useState('hidden');
    const [openEye, setOpenEye]=useState('block');
    const [showPassword, setShowPassword]=useState('password')

    const handleOpenEye=()=>{
   if(openEye==='block'){setCloseEye('block'); setOpenEye('hidden'); setShowPassword('text')} else{setOpenEye('block'); setCloseEye('hidden'); setShowPassword('password')}
    }


    return(
         <div className="max-[1380px] mx-auto overflow-hidden shadow-xl my-[50px]">
            <div className="grid grid-cols-1 justify-items-center my-[30px]">
                <div className="grid grid-cols-1 justify-items-center">
                    <Image src={logo} height={50} width={120} alt="logo"/>
                    <h1 className="text-gray-400 text-sm mb-[10px] mt-[5px] ">Hello! Welcome To Our Shop! Please Create Your Account Here!</h1>
                    <p className="text-gray-800 font-bold text-3xl">Create Account</p>
                </div>

                <div className="grid grid-cols-1 gap-2 w-[400px] justify-items-center my-[15px]">
                    <input className="border-1 p-1.5 rounded-xl w-[400px]" type="text" placeholder="Full Name"/>
                    <input className="border-1 p-1.5 rounded-xl w-[400px]" type="email" placeholder="@Email"/>
                    <div className="flex justify-between w-[400px] gap-1 items-center">
                        <div className=" flex  border-1 p-1.5 rounded-xl justify-evenly items-center flex-[20%]">
                         <Image src={flag} className="h-[15px] w-[15px]" alt="flag"/>
                            <p>+630</p>
                        </div>
                        
                        <input className="border-1 p-1.5 rounded-xl  flex-[80%]" type="number" placeholder="Phone Number"/>

                    </div>
                    <div className="flex justify-between items-center cursor-pointer">
                        <input className="border-1 p-1.5 rounded-xl w-[400px]" type={`${showPassword}`} placeholder="Password"/>
                        <div onClick={handleOpenEye} className="flex items-center">
                        <img className={`h-[35px] w-[35px] ${openEye}`} src="/eye.gif"/>
                        <img  className={`h-[35px] w-[35px] ${closeEye}`} src="/hide.gif"/>
                        </div>
                        
                    </div>
                    <div  className="flex justify-between items-center cursor-pointer">
                         <input className="border-1 p-1.5 rounded-xl w-[400px]" type={`${showPassword}`} placeholder="Confirm Password"/>
                         <div onClick={handleOpenEye} className="flex items-center">
                        <img className={`h-[35px] w-[35px] ${openEye}`} src="/eye.gif"/>
                        <img  className={`h-[35px] w-[35px] ${closeEye}`} src="/hide.gif"/>
                        </div>
                    </div>
                    
                   
                </div>

                <div className="flex justify-center items-center mb-[30px]">
                   <button className="h-[40px] w-[150px] bg-blue-500 rounded-2xl text-white font-semibold cursor-pointer hover:bg-gray-600 duration-500">Signup</button>
                </div>
                <p>Already Have Account? <Link href='/signin'><strong className="hover:underline">Signin!</strong></Link></p>

            </div>

        </div>
    )
}