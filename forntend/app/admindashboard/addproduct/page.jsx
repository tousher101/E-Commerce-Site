"use client";
import { useState } from 'react';
import AddProduct from '../../../component/AddProduct'
import { fetchWithAuth } from '../../../Utils/fetchWithAuth';
import Alert from '../../../Utils/Alert';
import Loading from '../../../Utils/Loading';


export default function addProductPage(){
const BaseURI=process.env.NEXT_PUBLIC_API_URI;
const [name, setName]=useState('');
const [description, setDescription]=useState('');
const [price, setPrice]=useState('');
const [stock, setStock]=useState('');
const [color, setColor]=useState('');
const [size, setSize]=useState('');
const [category, setCategory]=useState('');
const [variant, setVariant]=useState('');
const [weight, setWeight]=useState('');
const [barcode, setbarCode]=useState('');
const [msg,setMsg]=useState(null);
const [type,setType]=useState(null);
const [selectedFile, setSelectedFile]=useState([]);
const [loading, setLoading]=useState(false);
const [originalPrice, setOriginalPrice]=useState('')

const formData= new FormData();
selectedFile.forEach((file)=>{formData.append('photos',file)});
formData.append('name',name);
formData.append('description',description);
formData.append('price',parseFloat(price));
formData.append('stock',parseInt(stock));
formData.append('originalPrice', parseFloat(originalPrice))
formData.append('size',size);
formData.append('color',color);
formData.append('category',category);
formData.append('variant',variant);
formData.append('weight',parseFloat(weight));
formData.append('barcode',barcode);
const handleChange=(e)=>{
    const files= Array.from(e.target.files)
    setSelectedFile(files)
};

const addProduct=async()=>{
    setLoading(true);
    const res= await fetchWithAuth(`${BaseURI}/api/admin/addproduct`,{
        method:'POST',
        body: formData
    });
  setMsg(res.msg)
  setName('');setDescription('');setPrice('');setColor('');setCategory(''); setSize('');setWeight('');setVariant('');setStock(''); setbarCode(''); setOriginalPrice('');
  setLoading(false)
};


    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
       <AddProduct name={name} nameOnCh={(e)=>{setName(e.target.value)}} description={description} descriptionOnCh={(e)=>{setDescription(e.target.value)}} 
       price={price} priceOnCh={(e)=>{setPrice(e.target.value)}} stock={stock} stockOnCh={(e)=>{setStock(e.target.value)}}
       size={size} sizeOnCh={(e)=>{setSize(e.target.value)}} weight={weight} weightOnCh={(e)=>{setWeight(e.target.value)}}
       color={color} colorOnCh={(e)=>{setColor(e.target.value)}} variant={variant} variantOnCh={(e)=>{setVariant(e.target.value)}}
       category={category} categoryOnCh={(e)=>{setCategory(e.target.value)}} bardcode={barcode} barcodeOnCh={(e)=>{setbarCode(e.target.value)}}
       submitAddProduct={()=>{addProduct()}} photosOnCh={handleChange} originalPrice={originalPrice} originlPriceOnCh={(e)=>{setOriginalPrice(e.target.value)}}/>

       {loading&&<Loading/>}
       </>
    )
}