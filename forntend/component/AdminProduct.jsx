"use-client"
import Image from "next/image"
import NoImage from '../public/noimage.png'
import DeleteModal from './DeleteModal'
import ProductEditModal from './ProductEditModal'
import { useState } from "react"
import {fetchWithAuth} from '../Utils/fetchWithAuth'
import Alert from '../Utils/Alert'
import Loading from "../Utils/Loading"
export default function adminProduct({productPhotos, productName, productDescription, productPrice, productStock, productSize, productVariant, productColor, productWeight, update,create, productId, getMens, getWomens,
   getKids, getAccessories, getPerfum, mode, selectedProduct,productOriginalPrice
}){
       const BASEURI=process.env.NEXT_PUBLIC_API_URI;
       const [deleteModal, setDeleteModal]=useState(false);
       const [editModal, setEditModal]=useState(false);
       const [animatedModal, setAnimatedModal]=useState(false);
       const [msg,setMsg]=useState(null);
       const [type, setType]=useState(null);
       const [loading, setLoading]=useState(false);
       const [selectProduct, setSelectProduct]=useState(selectedProduct);
 


       const openDeleteModal=()=>{
         setDeleteModal(true);
         setTimeout(()=>{
         setAnimatedModal(true)
      },10)
       };
       const closeDeleteModal=()=>{
         setDeleteModal(false);
         setTimeout(()=>{
         setAnimatedModal(false)
      },10)
       };
   
   const openEditModal=()=>{
      setEditModal(true)
        setTimeout(()=>{
         setAnimatedModal(true)
      },10)
   };
   const closeEditModal=()=>{
      setEditModal(false)
         setTimeout(()=>{
         setAnimatedModal(false)
      },10)
   };

   const deleteProduct=async(id)=>{
      setLoading(true)
      setDeleteModal(false);
      const res= await fetchWithAuth(`${BASEURI}/api/admin/deleteproduct/${id}`,{
         method:'DELETE'
      });
     setLoading(false);
      setMsg(res.msg);
      setType('Success')
   
     
     if(mode==='Men'){getMens()}
      else if(mode==='Women'){getWomens()}
      else if(mode==='Kid'){getKids()}
      else if (mode==='Accessories'){getAccessories()}
      else if (mode==='Perfume'){getPerfum()}
   };
const colorArray = Array.isArray(selectProduct.color)
  ? selectProduct.color
  : selectProduct.color?.split(/[\s,]+/).filter(Boolean) || [];

const sizeArray = Array.isArray(selectProduct.size)
  ? selectProduct.size
  : selectProduct.size?.split(/[\s,]+/).filter(Boolean) || [];

const variantArray = Array.isArray(selectProduct.variant)
  ? selectProduct.variant
  : selectProduct.variant?.split(/[\s,]+/).filter(Boolean) || [];

   const editProduct=async(id)=>{
      const res=await fetchWithAuth(`${BASEURI}/api/admin/editproduct/${id}`,{
         method:'PUT',
         body: JSON.stringify({
            name:selectProduct.name,
            description:selectProduct.description,
            size:sizeArray,
            variant:variantArray,
            color:colorArray,
            price:parseFloat(selectProduct.price),
            stock:parseInt(selectProduct.stock),
            originalPrice:parseFloat(selectProduct.originalPrice),
            weight:parseFloat(selectProduct.weight)
         })
      });
       setMsg(res.msg);
      setType('Success');
      setEditModal(false);
   
     
     if(mode==='Men'){getMens()}
      else if(mode==='Women'){getWomens()}
      else if(mode==='Kid'){getKids()}
      else if (mode==='Accessories'){getAccessories()}
      else if (mode==='Perfume'){getPerfum()}

   }

   return(
      <>
      {loading&&<Loading/>}
      {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" overflow-hidden  mx-[10px] rounded-xl shadow-sm flex items-center justify-evenly my-[30px] p-1">
            <div className="h-[90px] w-[150px] rounded-xl">
                     <Image src={productPhotos||NoImage} height={90} width={150} priority className="rounded-xl w-full h-full object-cover"  alt="product-photo"/>
            </div>
            
             <div className="grid grid-cols-1 items-center p-2 text-[13px] ">
                <h1 className="font-semibold">{productName}</h1>
                <h2 className="text-[12px]" >{productDescription}</h2>
                <h2 className="font-semibold">₱{productPrice}</h2>
                <h2>Stock : {productStock}</h2>
             </div>

             <div className="grid grid-cols-1 items-center p-2 text-[13px]">
               <h1 className="flex gap-2">Size : {productSize.map((pro,i)=>(<span key={i}>{pro}</span>))}</h1>
                <h1 className="flex gap-2">Color : {productColor.map((col,i)=>(<span key={i}>{col}</span>))} </h1>
                <h1 className="flex gap-2"> Variant : {productVariant.map((ver,i)=>(<span key={i}>{ver}</span>))} </h1>
                <h2> weight : {productWeight}</h2>
             </div>
               <div className="grid grid-cols-1 items-center p-2 text-[13px]">
                  <h2 className="font-semibold ">Original Price : <span className="line-through">₱{productOriginalPrice}</span></h2>
                <h2>Create :{new Date(create).toDateString()} </h2>
                <h2> Update: {new Date(update).toDateString()}</h2>
             </div>
             <div className="flex justify-center items-center gap-3">
                <button onClick={openEditModal} className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/edit.gif"/></button>
                <button onClick={openDeleteModal} className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/bin.gif"/></button>
             </div>
           
             
        </div>
        {deleteModal&&<DeleteModal design={animatedModal} closeModal={closeDeleteModal} submitDelete={()=>{deleteProduct(productId)}}/>}
        
        {selectProduct&&editModal&&<ProductEditModal design={animatedModal} closeModal={closeEditModal} nameValue={selectProduct.name} nameOnCh={(e)=>{setSelectProduct({...selectedProduct, name:e.target.value})}}
         descriptionValue={selectProduct.description} descriptionOnCh={(e)=>{setSelectProduct({...selectProduct, description:e.target.value})}} priceValue={selectProduct.price} priceOnCh={(e)=>{setSelectProduct({...selectProduct, price:e.target.value})}}
         stockValue={selectProduct.stock} stockOnCh={(e)=>{setSelectProduct({...selectProduct, stock:e.target.value})}}
         sizeValue={selectProduct.size} sizeOnCh={(e)=>{setSelectProduct({...selectProduct, size:e.target.value})}}
         variantValue={selectProduct.variant} variantOnCh={(e)=>{setSelectProduct({...selectProduct, variant:e.target.value})}}
         colorValue={selectProduct.color} colorOnCh={(e)=>{setSelectProduct({...selectProduct, color:e.target.value})}}
         weightValue={selectProduct.weight} weightOnCh={(e)=>{setSelectProduct({...selectProduct, weight:e.target.value})}}
         originalPriceValue={selectProduct.originalPrice} originalPriceOnCh={(e)=>{setSelectProduct({...selectProduct, originalPrice:e.target.value})}}
         submitEdit={()=>{editProduct(productId)}}
         
         />}
        </>
    )
}