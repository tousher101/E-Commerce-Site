"use client"
import { createContext,useContext,useEffect,useState } from "react";
import { fetchWithAuth } from "../Utils/fetchWithAuth";

const BaseURI=process.env.NEXT_PUBLIC_API_URI

const GlobalContext=createContext();
export const GlobalProvider=({children})=>{
    const [adminDashboardCount,setAdminDashboardCount]=useState(null);

    const getAllCount=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/countorderstatus`)
        setAdminDashboardCount(res)
    };
    useEffect(()=>{
        getAllCount();
    },[]);
    return(
        <GlobalContext.Provider value={{adminDashboardCount, getAllCount}}>{children}</GlobalContext.Provider>
    )
};
export const useGlobalContext=()=>useContext(GlobalContext)