"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Products from "../../../component/Product"
import { fetchWithAuth } from "../../../Utils/fetchWithAuth"
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function searchProduct(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [srcData, setSrcData]=useState([]);
    const [page, setPage]=useState(1);
    const [totalPage, setTotalPage]=useState(0);
    const [totalProduct, setTotalProduct]=useState(0);
    const params=useParams();
    const {query}=params
    const getSearchProduct=async(q,page)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/search?query=${q}&page=${page}&limit=${20}`)
        setSrcData(res.products); setTotalPage(res.totalPage);setTotalProduct(res.totalProduct)
    };

    useEffect(()=>{
        AOS.init({
            duration:1000,once:false,mirror:false
          });
          AOS.refresh();
          
        getSearchProduct(query,page)
    },[query,page])


    return(
        <div className="mx-[10px] max-w-[1380px] overflow-hidden">
            <h1 className="ml-[20px] text-3xl text-gray-500 font-bold mt-[25px]">Total <span className="text-green-500">Product ({totalProduct})</span></h1>
            <div className="flex flex-wrap justify-center items-center gap-3">
                {srcData?.map((pro)=>(
                <div key={pro.id} data-aos='fade-left'>
                <Products name={pro?.name} description={pro?.description} price={pro?.price} photos={pro?.photos[0]?.url} stock={pro?.stock}
                comment={pro?._count?.comment} originalPrice={pro?.originalPrice} productId={pro.id} sold={pro?.soldCount} />
                </div>
                ))}
            </div>

        </div>
    )
}