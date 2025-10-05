import Image from "next/image"
import logo from '../../public/logo.png'
import Link from "next/link"

export default function signIn(){


    return(
        <div className="max-[1380px] mx-auto overflow-hidden shadow-xl my-[50px]">
            <div className="grid grid-cols-1 justify-items-center my-[30px]">
                <div className="grid grid-cols-1 justify-items-center">
                    <Image src={logo} height={50} width={120} alt="logo"/>
                    <h1 className="text-gray-400 text-sm mb-[10px] mt-[5px] ">Hello! Welcome Back To Our Shop! Please Login Your Account Here!</h1>
                    <p className="text-gray-800 font-bold text-3xl">Login</p>
                </div>

                <div className="grid grid-cols-1 gap-2 w-[400px] justify-items-center my-[15px]">
                    <input className="border-1 p-1.5 rounded-xl w-[400px]" type="email" placeholder="@Email"/>
                    <input className="border-1 p-1.5 rounded-xl w-[400px]" type="password" placeholder="Password"/>
                </div>
                <div className="flex justify-evenly w-[400px]">
                    <p>Remember Me <input type="checkbox"/></p>
                    <p>Forget Password</p>
                </div>

                <div className="flex justify-center items-center mb-[30px] mt-[25px]">
                   <button className="h-[40px] w-[150px] bg-blue-500 rounded-2xl text-white font-semibold cursor-pointer hover:bg-gray-600 duration-500">Login</button>
                </div>
                <p>Don't Have Account? <Link href='/signup'><strong className="hover:underline">SignUp!</strong></Link></p>

            </div>

        </div>
    )
}