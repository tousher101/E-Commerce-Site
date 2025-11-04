"use client"
import { useEffect } from "react"
import AdminCategory from "../../../component/AdminCategory"
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function allproductbycat(){
    useEffect(()=>{
                AOS.init({
                    duration:1000,once:false,mirror:false
                  });
                  AOS.refresh();
    })
    return(
        <div className="max-w-[1380px] mx-[10px] overflow-hidden">
            <AdminCategory/>
        </div>
    )
}