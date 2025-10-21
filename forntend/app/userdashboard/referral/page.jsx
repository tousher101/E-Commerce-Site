"use client"
import {useUserInfo} from "../../../context/userInfo"
export default function referral(){
    const BaseURI='http://localhost:3000'
    const {userInfo}=useUserInfo();
    return(
        <div className="max-w-[1380px] mx-[10px] overflow-hidden ">
           <h1 className="text-center text-3xl text-gray-400 font-semibold my-[30px]">Referral Dashboard</h1>
           <div className="mb-[10px] flex justify-center items-center">
            <h1 className="text-center">Your Referral Code: <span className="border-1 border-gray-300 p-2 rounded-xl">{BaseURI}/signup?ref={userInfo?.referralCode}</span> </h1>
            <button className="border-1 ml-[10px] rounded-xl border-gray-300 p-1 cursor-pointer"><img className="h-[35px] w-[35px]" src="/copy.gif"/></button>
           </div>
           <div className="my-[30px]">
            <h1 className="text-center text-2xl text-gray-400 font-semibold">Referred User</h1>
            
            <div className="flex justify-center gap-2 mt-[20px]">
            <div className="border-1 border-gray-300 rounded-xl bg-red-400 flex justify-around p-1 w-full ">
                <h1>Name</h1>
                <h2>email</h2>
                <h3>phone</h3>
                <h3>Create</h3>

            </div>
            </div>
           </div>
        </div>
    )
}