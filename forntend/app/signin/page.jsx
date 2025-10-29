"use client"
import Image from "next/image"
import logo from '../../public/logo.png'
import Link from "next/link"
import { useState } from "react"
import { useRouter,useSearchParams } from "next/navigation"
import Alert from "../../Utils/Alert"
import { useUserInfo } from "../../context/userInfo"

export default function signIn(){
const [email,setEmail]=useState('');
const [password, setPassword]=useState('');
const BaseURI=process.env.NEXT_PUBLIC_API_URI;
const [msg,setMsg]=useState(null);
const [type,setType]=useState(null);
const {getAllUser,getTotalCartItems,getCartItems}=useUserInfo()

const router= useRouter();
const searchParams=useSearchParams();
const redirect=searchParams.get('redirect')

const goAdminDashBoard=()=>{
    router.push('/admindashboard')
};

const goUserHomePage=()=>{
    router.push('/')
}

const goRedirect=()=>{
    router.push(redirect)
}

const submitLogin=async(e)=>{
e.preventDefault();
const res=await fetch(`${BaseURI}/api/auth/signin`,{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body: JSON.stringify({email,password})
});
const data= await res.json();
if(res.ok){ localStorage.setItem('token', data.accessToken);
    if(redirect){goRedirect();getTotalCartItems(); return}
    if(data.role==='ADMIN'){goAdminDashBoard(); getAllUser()}
    if(data.role==='USER'){goUserHomePage();getAllUser();getTotalCartItems(); getCartItems()}
} 
else if(res.status===404 ||res.status===400||res.status===500){setMsg(data.msg); setType('Error')}
}

    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto overflow-hidden shadow-xl my-[50px]">
            <div className="grid grid-cols-1 justify-items-center my-[30px]">
                <div className="grid grid-cols-1 justify-items-center">
                    <Image src={logo} height='auto' width='auto' priority className="h-[60px] w-[120px]" alt="logo"/>
                    <h1 className="text-gray-400 text-sm mb-[10px] mt-[5px] ">Hello! Welcome Back To Our Shop! Please Login Your Account Here!</h1>
                    <p className="text-gray-800 font-bold text-3xl">Login</p>
                </div>

                <div className="grid grid-cols-1 gap-2 w-[400px] justify-items-center my-[15px]">
                    <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className="border-1 p-1.5 rounded-xl w-[400px]" type="email" placeholder="@Email"/>
                    <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className="border-1 p-1.5 rounded-xl w-[400px]" type="password" placeholder="Password"/>
                </div>
                <div className="flex justify-evenly w-[400px]">
                    <p>Remember Me <input type="checkbox"/></p>
                    <p>Forget Password</p>
                </div>

                <div className="flex justify-center items-center mb-[30px] mt-[25px]">
                   <button onClick={submitLogin} className="h-[40px] w-[150px] bg-blue-500 rounded-2xl text-white font-semibold cursor-pointer hover:bg-gray-600 duration-500">Login</button>
                </div>
                <p>Don't Have Account? <Link href='/signup'><strong className="hover:underline">SignUp!</strong></Link></p>

            </div>

        </div>
        </>
    )
}