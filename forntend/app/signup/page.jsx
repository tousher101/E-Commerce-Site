"use client"
import Image from "next/image"
import logo from '../../public/logo.png'
import Link from "next/link"
import flag from '../../public/Flag-phil.png'
import { useEffect, useState } from "react"
import Alert from '../../Utils/Alert'
import { useRouter } from "next/navigation"


export default function signUp(){
    const [closeEye, setCloseEye]=useState('hidden');
    const [openEye, setOpenEye]=useState('block');
    const [showPassword, setShowPassword]=useState('password');
    const [refCode, setRefCode]=useState(null);
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const[name, setName]=useState('');
    const [email, setEmail]=useState('');
    const[phone,setPhone]=useState('');
    const [password, setPassword]=useState('');
    const[confirmPass, setConfirmPassword]=useState('');

    useEffect(()=>{
        const params=new URLSearchParams(window.location.search)
        const ref=params.get('ref');
        if(ref){setRefCode(ref)}
    },[]);

    const router= useRouter();
    const goSignin=()=>{
        router.push('/signin')
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        if(password!==confirmPass){ setMsg('Password Not Match'); setType('Error'); return  }
        const res= await fetch(`${BaseURI}/api/auth/createuser`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({name,email,password,phone,referralCode:refCode})
        });
        const data= await res.json()
        if(res.ok){setMsg(data.msg); setType('Success'); goSignin() }
        else if(res.status===400){setMsg(data.msg); setType('Error')}
        else if(res.status===500){setMsg(data.msg); setType('Error')}
    };



    const handleOpenEye=()=>{
   if(openEye==='block'){setCloseEye('block'); setOpenEye('hidden'); setShowPassword('text')} else{setOpenEye('block'); setCloseEye('hidden'); setShowPassword('password')}
    }


    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
         <div className="max-[1380px] mx-auto overflow-hidden shadow-xl my-[50px]">
            <div className="grid grid-cols-1 justify-items-center my-[30px]">
                <div className="grid grid-cols-1 justify-items-center">
                    <Image src={logo} height={50} width={120} alt="logo"/>
                    <h1 className="text-gray-400 text-sm mb-[10px] mt-[5px] ">Hello! Welcome To Our Shop! Please Create Your Account Here!</h1>
                    <p className="text-gray-800 font-bold text-3xl">Create Account</p>
                </div>

                <form className="grid grid-cols-1 gap-2 w-[400px] justify-items-center my-[15px]">
                    <input className="border-1 p-1.5 rounded-xl w-[400px]" value={name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="Full Name"/>
                    <input className="border-1 p-1.5 rounded-xl w-[400px]" value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="@Email"/>
                    <div className="flex justify-between w-[400px] gap-1 items-center">
                        <div className=" flex  border-1 p-1.5 rounded-xl justify-evenly items-center flex-[20%]">
                         <Image src={flag} className="h-[15px] w-[15px]" alt="flag"/>
                            <p>+630</p>
                        </div>
                        
                        <input className="border-1 p-1.5 rounded-xl  flex-[80%]" value={phone} onChange={(e)=>{setPhone(e.target.value)}} type="number" placeholder="Phone Number"/>

                    </div>
                    <div className="flex justify-between items-center cursor-pointer">
                        <input className="border-1 p-1.5 rounded-xl w-[400px]" value={password} onChange={(e)=>{setPassword(e.target.value)}} type={`${showPassword}`} placeholder="Password"/>
                        <div onClick={handleOpenEye} className="flex items-center">
                        <img className={`h-[35px] w-[35px] ${openEye}`} src="/eye.gif"/>
                        <img  className={`h-[35px] w-[35px] ${closeEye}`} src="/hide.gif"/>
                        </div>
                        
                    </div>
                    <div  className="flex justify-between items-center cursor-pointer">
                         <input className="border-1 p-1.5 rounded-xl w-[400px]" value={confirmPass} onChange={(e)=>{setConfirmPassword(e.target.value)}} type={`${showPassword}`} placeholder="Confirm Password"/>
                         <div onClick={handleOpenEye} className="flex items-center">
                        <img className={`h-[35px] w-[35px] ${openEye}`} src="/eye.gif"/>
                        <img  className={`h-[35px] w-[35px] ${closeEye}`} src="/hide.gif"/>
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center my-[30px]">
                   <button onClick={handleSubmit} className="h-[40px] w-[150px] bg-blue-500 rounded-2xl text-white font-semibold cursor-pointer hover:bg-gray-600 duration-500">Signup</button>
                </div>
                 <p>Already Have Account? <Link href='/signin'><strong className="hover:underline">Signin!</strong></Link></p>
                </form>

              
               

            </div>

        </div>
        </>
    )
}