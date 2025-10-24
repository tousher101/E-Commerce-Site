"use client";
import { useEffect, useState } from 'react';
import AdminProduct from '../../../../component/AdminProduct';
import { fetchWithAuth } from '../../../../Utils/fetchWithAuth';
import Alert from '../../../../Utils/Alert';

export default function mensFashion(){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [productData, setProductData]=useState([]);
    const [totalPage, setTotalPage]=useState(0);
    const [page, setPage]=useState(1);
    const [totalProduct, setTotalProduct]=useState(0);
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);


    const getMensProduct=async(page)=>{
        const res=await fetchWithAuth(`${BaseURI}/api/admin/adminmensfashion?page=${page}&limit=${20}`)
        setProductData(res.getMensFashion);
        setTotalPage(res.totalPage);
        setTotalProduct(res.totalMensFashion)
       
    };

    useEffect(()=>{
        getMensProduct(page);
    },[page]);

    const handleNext=()=>{
        if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Product Available'); setType('Error'); return}
    }

    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className="max-w-[1380px] mx-[10px] overflow-x-hidden">
            <h1 className='text-center text-3xl text-gray-400 font-semibold my-[30px]'>Men's Product ({totalProduct})</h1>
           {productData?.map((pro)=>(
                 <div key={pro.id} >
                <AdminProduct productName={pro.name} productDescription={pro.description} productPhotos={pro?.photos[0]?.url} productPrice={pro.price} productStock={pro.stock}  
                productColor={pro.color} productSize={pro.size} productVariant={pro.variant} productWeight={pro.weight} update={pro.updatedAt} create={pro.createdAt} productId={pro.id} getMens={()=>{getMensProduct()}} mode={'Men'} 
                selectedProduct={pro} productOriginalPrice={pro.originalPrice}/>
            </div>
           ))}
            
              {totalPage>1&&<div className="flex justify-between mx-[10px]">
                <button onClick={()=>{setPage((p)=>p-1, 1)}} disabled={page<=1} className="bg-black rounded-xl h-[40px] text-white cursor-pointer w-[100px]">Previous</button>
                <button onClick={handleNext} className="bg-black rounded-xl h-[40px] text-white cursor-pointer w-[100px]">Next</button>
             </div>}

        </div>
        </>
    )
}