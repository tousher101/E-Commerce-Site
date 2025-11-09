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
         <div className=" max-w-[1380px] mx-[10px] overflow-hidden  ">
            <div data-aos='slide-up' className="grid grid-cols-1 justify-items-center my-[25px]" >
                <div className="grid grid-cols-1 justify-items-center">
                    <Image src={logo} height='auto' width='auto' priority className="h-[60px] w-[120px]" alt="logo"/>
                    <h1 className="text-gray-400 lg:text-sm md:text-sm text-[11px] mb-[10px] mt-[5px] ">Hello! Welcome To Our Shop! <span className="text-green-500">Please Create Your Account Here!</span></h1>
                    <p className="text-gray-800 font-bold text-3xl">Create <span className="text-green-500">Account</span></p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 lg:w-[400px] md:w-[400px] w-[full] justify-items-center my-[15px]">
                    <input className="border-1 p-1.5 rounded-xl lg:w-[400px] md:w-[400px] w-[300px]" value={name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="Full Name"/>
                    <input className="border-1 p-1.5 rounded-xl lg:w-[400px] md:w-[400px] w-[300px]" value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="@Email"/>
                    <div className="flex justify-between lg:w-[400px] md:w-[400px] w-[300px] gap-1 items-center">
                        <div className=" flex  border-1 p-1.5 rounded-xl justify-evenly items-center lg:flex-[20%] md:flex-[20%] flex-[30%]">
                         <Image src={flag} className="h-[15px] w-[15px]" alt="flag"/>
                            <p>+630</p>
                        </div>
                        
                        <input className="border-1 p-1.5 rounded-xl  lg:flex-[80%] md:flex-[80%] flex-[70%]" value={phone} onChange={(e)=>{setPhone(e.target.value)}} type="number" placeholder="Phone Number"/>

                    </div>

                            <div className="lg:w-[400px] md:w-[400px] w-[300px] flex">
                            <div className="flex justify-between items-center cursor-pointer flex-[90%]">
                        <input className="border-1 p-1.5 rounded-xl lg:w-[400px] md:w-[400px] w-[300px]" value={password} onChange={(e)=>{setPassword(e.target.value)}} type={`${showPassword}`} placeholder="Password"/>
                        <div onClick={handleOpenEye} className="flex items-center flex-[10%]">
                        <img className={`h-[25px] w-[25px] ${openEye}`} src="/eye.gif"/>
                        <img  className={`h-[25px] w-[25px] ${closeEye}`} src="/hide.gif"/>
                        </div>
                        
                    </div>
                            </div>

                  

                    <div className=" flex lg:w-[400px] md:w-[400px] w-[300px]">
                        <div  className="flex flex-[90%] justify-between items-center cursor-pointer">
                         <input className="border-1 p-1.5 rounded-xl lg:w-[400px] md:w-[400px] w-[300px] " value={confirmPass} onChange={(e)=>{setConfirmPassword(e.target.value)}} type={`${showPassword}`} placeholder="Confirm Password"/>
                         <div onClick={handleOpenEye} className="flex flex-[10%] items-center">
                        <img className={`h-[25px] w-[25px] ${openEye}`} src="/eye.gif"/>
                        <img  className={`h-[25px] w-[25px] ${closeEye}`} src="/hide.gif"/>
                        </div>
                    </div>

                    </div>
              
                    
                    <div className="flex justify-center items-center mt-[10px]">
                   <button type="submit" className="h-[40px] w-[150px] bg-blue-500 rounded-2xl text-white font-semibold cursor-pointer hover:bg-gray-600 duration-500">Signup</button>
                </div>
                 <p>Already Have Account? <Link href='/signin'><strong className="hover:underline">Signin!</strong></Link></p>
                </form>

              
               

            </div>

        </div>
        </>
    )
}