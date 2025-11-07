"use client"
import { useParams } from "next/navigation"
import ProductDetails from "../../component/ProductDetails"
import Product from "../../component/Product"
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../Utils/fetchWithAuth";
import Alert from "../../Utils/Alert";
import { useRouter } from "next/navigation";
import { useUserInfo } from "../../context/userInfo";
import Review from '../../component/Review'

export default function productDetailsPage(){
    const {id}=useParams();
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [productData, setProductData]=useState(null);
    const [relatedData, setRelatedDate]=useState([]);
    const [msg,setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [size, setSize]=useState('');
    const [variant, setVariant]=useState('');
    const [color, setColor]=useState('');
    const [quantity, setQuantity]=useState('');
    const router=useRouter();
    const {user,getTotalCartItems,getCartItems}=useUserInfo();
 



    const getProductData=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/productdetails/${id}`)
        setProductData(res.productDetails)
    };

        const getRelatedProduct=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/relatedproduct/${id}`)
        setRelatedDate(res.relatedProduct)
    };

    useEffect(()=>{
        getProductData(id)
        getRelatedProduct(id)
    },[]);

    const addToCart=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/addtocart`,{
            method:'POST',
            body: JSON.stringify({productId:Number(id),size,color,quantity:Number(quantity),variant})
        });
     
        setMsg(res.msg);
        setType('Success');
        getTotalCartItems();
        getCartItems();
    }
    const handleAddToCart=()=>{
        if(!user){setMsg('Please Loging First');setType('Error'); router.push('/signin')}
        addToCart();
        
    }



    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className="mx-auto overflow-hidden">
            <div>
            <ProductDetails name={productData?.name} des={productData?.description} price={productData?.price} originalPrice={productData?.originalPrice}
            weight={productData?.weight} color={productData?.color} size={productData?.size} variant={productData?.variant} stock={productData?.stock} photos={productData?.photos}
            selectedSizeValue={size} selectedSizeOnCh={(e)=>{setSize(e.target.value)}} selectedColorValue={color} selectedColorOnCh={(e)=>{setColor(e.target.value)}}
            selectedVariant={variant} selectedVariantOnCh={(e)=>{setVariant(e.target.value)}} selectedQuantity={quantity} selectedQuantityOnCh={(e)=>{setQuantity(e.target.value)}}
            submitAddToCart={handleAddToCart} />
            </div>

            <Review productId={id}/>
            

            <div>
                <h1 className="text-center text-3xl text-gray-400 font-semibold">Related Product</h1>
                {relatedData?.map((rel)=>(
                        <div key={rel.id} className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-items-center">
                    <Product name={rel?.name} description={rel?.description} price={rel?.price} originalPrice={rel?.originalPrice}
                    stock={rel?.stock} photos={rel?.photos[0]?.url} comment={rel?._count?.comment} sold={rel?.order?.quantity} productId={rel.id} />
                        </div>
                ))}
                
            </div>
            

        </div>
        </>
    )
}