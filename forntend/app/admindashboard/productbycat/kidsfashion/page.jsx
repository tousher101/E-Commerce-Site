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
import { useRouter } from 'next/navigation';


export default function kidsFashion(){
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
       const [productId, setProductId]=useState(null);
      const [barCode, setBarCode]=useState('');
       const [searchData,setSearchData]=useState(null);
       const router=useRouter()
 


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
     getKidsProduct();

    };
   const goVariantEdit=(id)=>{
   router.push(`kidsfashion/${id}`)
    }


   const editProduct=async(id)=>{
      const res=await fetchWithAuth(`${BaseURI}/api/admin/editproduct/${id}`,{
         method:'PUT',
         body: JSON.stringify({
            name:selectProduct.name,
            description:selectProduct.description,
            basePrice:parseFloat(selectProduct.basePrice),
            stock:parseInt(selectProduct.stock),
            baseOriginalPrice:parseFloat(selectProduct.baseOriginalPrice),
            weight:parseFloat(selectProduct.weight)
         })
      });
       setMsg(res.msg);
      setType('Success');
      setEditModal(false);
         getKidsProduct();
   }
 

    const getKidsProduct=async(page)=>{
        const res=await fetchWithAuth(`${BaseURI}/api/admin/adminkidsfashion?page=${page}&limit=${20}`)
        setProductData(res.getKidsFashion);
        setTotalPage(res.totalPage);
        setTotalProduct(res.totalKidsFashion)
       
    };

       const submitSearch=async(barCode)=>{
      const res= await fetchWithAuth(`${BaseURI}/api/admin/searchproductbybarcodekids?barCode=${barCode}`)
      setSearchData(res.searchProduct);
      setMsg(res.msg); setType('Error')
    };

    const makeTopSelling=async(id)=>{
      const res=await fetchWithAuth(`${BaseURI}/api/admin/maketopselling/${id}`,{
         method:'PUT'
      });
      setMsg(res.msg); setType('Success'); getAccessoriesProduct(page)
    };

      const makeTopPopular=async(id)=>{
      const res=await fetchWithAuth(`${BaseURI}/api/admin/maketoppopuler/${id}`,{
         method:'PUT'
      });
      setMsg(res.msg); setType('Success'); getAccessoriesProduct(page)
    };

      const makeDefaultProduct=async(id)=>{
      const res=await fetchWithAuth(`${BaseURI}/api/admin/makechangeproductstatus/${id}`,{
         method:'PUT'
      });
      setMsg(res.msg); setType('Success'); getAccessoriesProduct(page)
    };

    useEffect(()=>{
    AOS.init({
    duration:1000,once:false,mirror:false
     });
    AOS.refresh();
        getKidsProduct(page);
    },[page]);

    const handleNext=()=>{
        if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Product Available'); setType('Error'); return}
    }

    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto w-full overflow-hidden">
           <div className='flex justify-end gap-2 mx-[10px] items-center'>
            <input value={barCode} onChange={(e)=>{setBarCode(e.target.value)}} type='text' className='p-2 border-1 border-gray-400 text-sm rounded-xl' placeholder='Barcode Number'/>
            <button onClick={()=>{submitSearch(barCode)}} className='h-[35px] w-[100px] rounded-sm bg-black text-white cursor-pointer'>Search</button>
         </div>
            <h1 className='text-center text-3xl text-gray-400 font-semibold'>Kid's ({totalProduct})</h1>
            <div className='grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-1 justify-items-center'>
          {searchData&&Object.keys(searchData).length>0? <div key={searchData.id} className='w-full'><AdminProduct productName={searchData?.name} productDescription={searchData?.description} productPhotos={searchData?.photos[0]?.url} productPrice={searchData.basePrice} productStock={searchData.stock}  
         productWeight={searchData.weight} update={searchData.updatedAt} create={searchData.createdAt} barCode={searchData.barcode} goVariantEdit={()=>{goVariantEdit(searchData.id)}}
         productOriginalPrice={searchData.baseOriginalPrice} openDeleteModal={openDeleteModal} openEditModal={openEditModal} status={searchData.productStatus}
         submitMakeTopSelling={()=>{makeTopSelling(searchData.id)}} submitMakePopular={()=>{makeTopPopular(searchData.id)}} submitClearAll={()=>{makeDefaultProduct(searchData.id)}}/></div>         
         :productData?.map((pro)=>(
         <div key={pro.id}  onClick={()=>{setSelectProduct(pro);setProductId(pro.id)} } data-aos='slide-up' className=' w-full my-2' >
         <AdminProduct productName={pro.name} productDescription={pro.description} productPhotos={pro?.photos[0]?.url} productPrice={pro.basePrice} productStock={pro.stock}  
          productWeight={pro.weight} update={pro.updatedAt} create={pro.createdAt} barCode={pro.barcode} goVariantEdit={()=>{goVariantEdit(pro.id)}}
            productOriginalPrice={pro.baseOriginalPrice} openDeleteModal={openDeleteModal} openEditModal={openEditModal} status={pro.productStatus}
            submitMakeTopSelling={()=>{makeTopSelling(pro.id)}} submitMakePopular={()=>{makeTopPopular(pro.id)}} submitClearAll={()=>{makeDefaultProduct(pro.id)}}/>
            </div>
            ))}
           </div>
            
              {totalPage>1&&<div className="flex justify-between mx-[10px]">
                <button onClick={()=>{setPage((p)=>p-1)}} disabled={page<=1} className="bg-black rounded-xl h-[40px] text-white cursor-pointer w-[100px]">Previous</button>
                <button onClick={handleNext} className="bg-black rounded-xl h-[40px] text-white cursor-pointer w-[100px]">Next</button>
             </div>}

        </div>

         {deleteModal&&<DeleteModal design={animatedModal} closeModal={closeDeleteModal} submitDelete={()=>{deleteProduct(productId)}}/>}
        
        {selectProduct&&editModal&&<ProductEditModal design={animatedModal} closeModal={closeEditModal} nameValue={selectProduct.name} nameOnCh={(e)=>{setSelectProduct({...selectProduct, name:e.target.value})}}
         descriptionValue={selectProduct.description} descriptionOnCh={(e)=>{setSelectProduct({...selectProduct, description:e.target.value})}} priceValue={selectProduct.basePrice} priceOnCh={(e)=>{setSelectProduct({...selectProduct, basePrice:e.target.value})}}
         stockValue={selectProduct.stock} stockOnCh={(e)=>{setSelectProduct({...selectProduct, stock:e.target.value})}}
         weightValue={selectProduct.weight} weightOnCh={(e)=>{setSelectProduct({...selectProduct, weight:e.target.value})}}
         originalPriceValue={selectProduct.baseOriginalPrice} originalPriceOnCh={(e)=>{setSelectProduct({...selectProduct, baseOriginalPrice:e.target.value})}}
         submitEdit={()=>{editProduct(productId)}}
         />}
        {loading&&<Loading/>}
        </>
    )
}