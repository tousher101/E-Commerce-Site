"use client"
import { useParams } from "next/navigation"
import VariantDetails from '../../../../../component/VariantDetails'
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../../Utils/fetchWithAuth";
import Alert from "../../../../../Utils/Alert";
import VariantEditModal from '../../../../../component/VariantEditModal'
export default function mensFashionVariant(){
    const params=useParams()
    const {id}=params
    const BaseURI=process.env.NEXT_PUBLIC_API_URI
    const [variantData,setVariantDat]=useState([]);
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [openEditModal, setOpenEditModal]=useState(false);
    const [selectedVariant, setSelectedVariant]=useState('');
    const [variantId, setVariantId]=useState(null);

    const getVariantData=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/allvariant/${id}`)
        setVariantDat(res.allVariants)
    };

    const deleteVairant=async(Id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/deletevariant/${Id}`,{
            method:'DELETE'
        });
        setMsg(res.msg); setType('Success');getVariantData(id)
    };

    const editVariant=async(Id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/editvariant/${Id}`,{
            method:'PUT',
            body:JSON.stringify({price:parseFloat(selectedVariant.price), originalPrice:parseFloat(selectedVariant.originalPrice), size:selectedVariant.size, color:selectedVariant.color,
                variant:selectedVariant.variant
            })
        });
        setMsg(res.msg);setType('Success');getVariantData(id); setOpenEditModal(false)
    };

    useEffect(()=>{
        getVariantData(id)
        
    },[])
    return(
        <>
        <div className="w-full overflow-hidden">
            <h1 className="text-center mb-[20px] text-3xl font-bold text-gray-500">All <span className="text-green-500">Variant</span></h1>
            <div className=" grid grid-cols-1 gap-2">
             {variantData?.map((v)=>(
            <div key={v.id} onClick={()=>{setSelectedVariant(v);setVariantId(v.id) }} className="w-full">
            <VariantDetails price={v.price} origianlPrice={v.originalPrice } size={v.size} color={v.color} variant={v.variant} submitDelete={()=>{deleteVairant(v.id)}}
                openModal={()=>{setOpenEditModal(true)}}/>
            </div>
                ))}
        
            </div>
          
        </div>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
            {openEditModal&&selectedVariant&&<VariantEditModal closeModal={()=>{setOpenEditModal(false)}} priceValue={selectedVariant.price} priceOnCh={(e)=>{setSelectedVariant({...selectedVariant,price:e.target.value})}}
            origianlPriceValue={selectedVariant.originalPrice} originalPriceOnCh={(e)=>{setSelectedVariant({...selectedVariant,originalPrice :e.target.value})}}
            sizeValue={selectedVariant.size} sizeOnCh={(e)=>{setSelectedVariant({...selectedVariant,size:e.target.value})}} colorValue={selectedVariant.color}
            colorOnCh={(e)=>{setSelectedVariant({...selectedVariant,color:e.target.value})}} variantValue={selectedVariant.variant} 
            variantOnCh={(e)=>{setSelectedVariant({...selectedVariant,variant:e.target.value})}} submitEdit={()=>{editVariant(variantId)}}  />}
        </>
    )
}