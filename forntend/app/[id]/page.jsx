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
    const [quantity, setQuantity]=useState('');
    const router=useRouter();
    const {user,getTotalCartItems,getCartItems}=useUserInfo();
    const [selectedSize, setSelectedSize]=useState('');
    const [selectedColor, setSelectedColor]=useState('');
    const [selectedVariant, setSelectedVariant]=useState('');
    const [selectedVariants, setSelectedVariants]=useState(null)


 


    const getProductData=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/productdetails/${id}`)
        setProductData(res.productDetails)
    
    };

    const sizes= [...new Set(productData?.variants.filter(v=>v.size).map(v=>v.size))];
    const colors=[...new Set(productData?.variants.filter(v=>v.color).map(v=>v.color))];
    const variants=[...new Set(productData?.variants.filter(v=>v.variant).map(v=>v.variant))];

        const getRelatedProduct=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/relatedproduct/${id}`)
        setRelatedDate(res.relatedProduct)
    };

    useEffect(()=>{
        getProductData(id);
        getRelatedProduct(id);
        const match= productData?.variants.find(v=>(selectedSize?v.size===selectedSize:true&&
            (selectedVariant?v.variant===selectedVariant:true)
        ));
        setSelectedVariants(match)
    },[selectedSize,selectedVariant]);


    const addToCart=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/addtocart`,{
            method:'POST',
            body: JSON.stringify({productId:Number(id),size:selectedSize,color:selectedColor,quantity:Number(quantity),variant:selectedVariant,variantsId:Number(selectedVariants?.id) })
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
        <div className=" max-w-[1380px] mx-[10px] overflow-hidden">
            <div>
            <ProductDetails name={productData?.name} des={productData?.description} price={selectedVariants?.price||productData?.basePrice} originalPrice={selectedVariants?.originalPrice||productData?.baseOriginalPrice}
            weight={productData?.weight} color={colors} size={sizes} variant={variants} stock={productData?.stock} photos={productData?.photos}
            selectedSizeValue={selectedSize} selectedSizeOnCh={(e)=>{setSelectedSize(e.target.value)}} selectedColorValue={selectedColor} selectedColorOnCh={(e)=>{setSelectedColor(e.target.value)}}
            selectedVariant={selectedVariant} selectedVariantOnCh={(e)=>{setSelectedVariant(e.target.value)}} selectedQuantity={quantity} selectedQuantityOnCh={(e)=>{setQuantity(e.target.value)}}
            submitAddToCart={handleAddToCart} />
            </div>

            <Review productId={id}/>
            

            <div className="mx-auto">
                <h1 className=" ml-[20px] text-3xl text-gray-500 font-bold">Related <span className="text-green-500">Product</span></h1>
                <div className="flex flex-wrap justify-center gap-2">
                {relatedData?.map((rel)=>(
                        <div key={rel.id}>
                    <Product name={rel?.name} description={rel?.description} price={rel?.basePrice} originalPrice={rel?.baseOriginalPrice}
                    stock={rel?.stock} photos={rel?.photos[0]?.url} comment={rel?._count?.comment} sold={rel?.order?.quantity} productId={rel.id} />
                        </div>
                ))}
                </div>
                
            </div>
            

        </div>
        </>
    )
}