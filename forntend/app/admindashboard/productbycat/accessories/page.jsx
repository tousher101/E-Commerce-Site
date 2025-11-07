"use client";
import { useEffect, useState } from 'react';
import AdminProduct from '../../../../component/AdminProduct';
import { fetchWithAuth } from '../../../../Utils/fetchWithAuth';
import Alert from '../../../../Utils/Alert';
import ProductEditModal from '../../../../component/ProductEditModal';
import Loading from '../../../../Utils/Loading';
import DeleteModal from '../../../../component/DeleteModal';
import AOS from 'aos';
import 'aos/dist/aos.css'



export default function accessories(){
   const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [productData, setProductData]=useState([]);
    const [totalPage, setTotalPage]=useState(0);
    const [page, setPage]=useState(1);
    const [totalProduct, setTotalProduct]=useState(0);
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
  
       const [deleteModal, setDeleteModal]=useState(false);
       const [editModal, setEditModal]=useState(false);
       const [animatedModal, setAnimatedModal]=useState(false);
       const [loading, setLoading]=useState(false);
       const [selectProduct, setSelectProduct]=useState(null);
       const [productId, setProductId]=useState(null)
 


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
      const res= await fetchWithAuth(`${BaseURI}/api/admin/deleteproduct/${id}`,{
         method:'DELETE'
      });
     setLoading(false);
      setMsg(res.msg);
      setType('Success')
      getAccessoriesProduct();

    }
const colorArray = Array.isArray(selectProduct?.color)
  ? selectProduct.color
  : selectProduct?.color?.split(/[\s,]+/).filter(Boolean) || [];

const sizeArray = Array.isArray(selectProduct?.size)
  ? selectProduct.size
  : selectProduct?.size?.split(/[\s,]+/).filter(Boolean) || [];

const variantArray = Array.isArray(selectProduct?.variant)
  ? selectProduct.variant
  : selectProduct?.variant?.split(/[\s,]+/).filter(Boolean) || [];

   const editProduct=async(id)=>{
      const res=await fetchWithAuth(`${BaseURI}/api/admin/editproduct/${id}`,{
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
   getAccessoriesProduct();
   }
 

    const getAccessoriesProduct=async(page)=>{
        const res=await fetchWithAuth(`${BaseURI}/api/admin/adminaccessories?page=${page}&limit=${20}`)
        setProductData(res.getAccessoriesFashion);
        setTotalPage(res.totalPage);
        setTotalProduct(res.totalAccessoriesFashion)
       
    };

    useEffect(()=>{
            AOS.init({
            duration:1000,once:false,mirror:false
            });
            AOS.refresh();
        getAccessoriesProduct(page);
    },[page]);

    const handleNext=()=>{
        if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Product Available'); setType('Error'); return}
    }

    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto overflow-hidden">
            <h1 className='text-center text-3xl text-gray-400 font-semibold my-[30px]'>Accessories Product ({totalProduct})</h1>
            <div className='grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-1 justify-items-center'>
           {productData?.map((pro)=>(
                 <div key={pro.id} onClick={()=>{setSelectProduct(pro);setProductId(pro.id)}} data-aos='slide-up'>
                <AdminProduct productName={pro?.name} productDescription={pro?.description} productPhotos={pro?.photos[0]?.url} productPrice={pro?.price} productStock={pro?.stock}  
                productColor={pro?.color} productSize={pro?.size} productVariant={pro?.variant} productWeight={pro?.weight} update={pro?.updatedAt} create={pro?.createdAt} 
                 productOriginalPrice={pro?.originalPrice} openDeleteModal={openDeleteModal} openEditModal={openEditModal}/>
                
            </div>
           ))}
           </div>
            
              {totalPage>1&&<div className="flex justify-between mx-[10px]">
                <button onClick={()=>{setPage((p)=>p-1)}} disabled={page<=1} className="bg-black rounded-xl h-[40px] text-white cursor-pointer w-[100px]">Previous</button>
                <button onClick={handleNext} className="bg-black rounded-xl h-[40px] text-white cursor-pointer w-[100px]">Next</button>
             </div>}
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
        {loading&&<Loading/>}
        </>
    )
}
