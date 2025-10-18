"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchWithAuth } from "../Utils/fetchWithAuth";
const BaseURI=process.env.NEXT_PUBLIC_API_URI

const UserInfoContext=createContext();
export const UserProvider=({children})=>{
    const [userInfo, setUserInfo]=useState(null);
    const getAllUser=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/userinfo`)
        setUserInfo(res.userInfo)
    };
    useEffect(()=>{
    getAllUser()
},[]);

return (
    <UserInfoContext.Provider value={{userInfo, getAllUser, setUserInfo}}>{children}</UserInfoContext.Provider>
)
};
export const useUserInfo=()=>useContext(UserInfoContext)

