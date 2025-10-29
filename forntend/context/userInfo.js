"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchWithAuth } from "../Utils/fetchWithAuth";
const BaseURI=process.env.NEXT_PUBLIC_API_URI

const UserInfoContext=createContext();
export const UserProvider=({children})=>{
    const [userInfo, setUserInfo]=useState(null);
    const [user,setUser]=useState(null);
    const [totalCartItmes, setTotalCartItems]=useState(0);
    const [cartData, setCartData]=useState(null);
  

   

    const getAllUser=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/userinfo`)
        setUserInfo(res.userInfo)
    };

      const getTotalCartItems=async()=>{
      const res= await fetchWithAuth(`${BaseURI}/api/user/totalcartitem`)
      setTotalCartItems(res.totalCartItems)
    };

     const getCartItems=async()=>{
      const res= await fetchWithAuth(`${BaseURI}/api/user/getallcartitems`)
      setCartData(res.cartItems)
     
    }



    useEffect(()=>{
    getAllUser();
    getTotalCartItems();
    
    const storedUser= localStorage.getItem('token')
    if(storedUser){setUser(storedUser)}
},[]);



return (
    <UserInfoContext.Provider value={{userInfo, getAllUser, setUserInfo, user, totalCartItmes, getTotalCartItems, cartData,getCartItems}}>{children}</UserInfoContext.Provider>
)
};
export const useUserInfo=()=>useContext(UserInfoContext)

