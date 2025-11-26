"use client";
import { useState } from 'react';
import { fetchWithAuth } from '../../../Utils/fetchWithAuth';
import Alert from '../../../Utils/Alert';
import Loading from '../../../Utils/Loading';


export default function addProductPage(){
const BaseURI=process.env.NEXT_PUBLIC_API_URI;
const [name, setName]=useState('');
const [description, setDescription]=useState('');
const [basePrice, setBasePrice]=useState('');
const [baseOriginalPrice, setBaseOriginalPrice]=useState('')
const [stock, setStock]=useState('');
const [category, setCategory]=useState('');
const [variants, setVariants]=useState([{variant:'',size:'',color:'',price:'',originalPrice:''}])
const [weight, setWeight]=useState('');
const [barcode, setbarCode]=useState('');
const [msg,setMsg]=useState(null);
const [type,setType]=useState(null);
const [selectedFile, setSelectedFile]=useState([]);
const [loading, setLoading]=useState(false);

const handleOnChange=(index,field,value)=>{
    const updatedVariants=[...variants];
    updatedVariants[index][field]=value;
    setVariants(updatedVariants)
};

const addVaritants=()=>{
    setVariants([...variants,{variant:'',size:'',color:'',price:'',originalPrice:''}])
};

const removeVariants=(index)=>{
    const updatedVariants=variants.filter((_,i)=>i!==index);
    setVariants(updatedVariants);
}


const formData= new FormData();
selectedFile.forEach((file)=>{formData.append('photos',file)});
formData.append('name',name);
formData.append('description',description);
formData.append('stock',parseInt(stock));
formData.append('category',category);
formData.append('weight',parseFloat(weight));
formData.append('barcode',barcode);
formData.append('basePrice',basePrice);
formData.append('baseOriginalPrice',baseOriginalPrice);
formData.append('variants',JSON.stringify(variants));
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
  setName('');setDescription('');setCategory(''); ;setWeight('');setStock(''); setbarCode(''); setBasePrice(''); setBaseOriginalPrice(''); removeVariants();
  setLoading(false)
};


    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
      <div className=" mx-auto w-full  overflow-hidden">
            <h1 className="text-center text-gray-500 text-3xl font-bold my-[20px]">Add <span className="text-green-500">Product</span></h1>
            <div className="grid grid-cols-1 gap-2 p-4 ">
                <input value={name} onChange={(e)=>{setName(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Product Name"/>
                <input value={description} onChange={(e)=>{setDescription(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Description"/>
                <div className="lg:flex  lg:justify-between  grid grid-cols-1 gap-2 items-center">
                <input value={stock} onChange={(e)=>{setStock(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Stock"/>
                <input value={weight} onChange={(e)=>{setWeight(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Weight"/>
                <input value={basePrice} onChange={(e)=>{setBasePrice(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Base Price"/>
                <select value={category} onChange={(e)=>{setCategory(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2 px-11">
                    <option value=''>Select Category</option>
                    <option value="MENSFASHION">Men's Fashion</option>
                    <option value='WOMENFASHION'>Women's Fashion</option>
                    <option value='KIDSFASHION'>Kid's Fashion</option>
                    <option value='ACCESSORIES'>Accessories</option>
                    <option value='PERFUME'>Perfume</option>
                </select>
                </div> 
                <div className='lg:flex  lg:justify-center  grid grid-cols-1 gap-2 items-center'>
                <input value={baseOriginalPrice} onChange={(e)=>{setBaseOriginalPrice(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Original Price"/>
                <input value={barcode} onChange={(e)=>{setbarCode(e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Barcode Scan (If Need)"/>
                </div>
                

                    <h1 className='text-center text-3xl text-gray-500 mt-[30px] font-bold'>Add <span className='text-green-500'>Variant</span></h1>
                {variants.map((variant,index)=>(
                <div className="grid grid-cols-1 gap-2 mt-[20px]" key={index}>
                <div className="lg:flex   lg:justify-between  grid grid-cols-1 gap-2 items-center">
                <input value={variant.price} onChange={(e)=>{handleOnChange(index,'price',e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Price"/>
                <input value={variant.color} onChange={(e)=>{handleOnChange(index,'color',e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Color"/>
                <input value={variant.size} onChange={(e)=>{handleOnChange(index,'size',e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Size"/>
                <input value={variant.variant} onChange={(e)=>{handleOnChange(index,'variant',e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Veriant"/>
                </div>

                
                <div className="lg:flex   lg:justify-start  grid grid-cols-1 gap-2 items-center">
                
                <input value={variant.originalPrice} onChange={(e)=>{handleOnChange(index,'originalPrice',e.target.value)}} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Original Price"/>
                </div>
                <div className="lg:flex   lg:justify-center  grid grid-cols-1 items-center">
                    <button onClick={()=>{removeVariants(index)}}className='h-[35px] w-[150px] rounded-sm bg-black text-white cursor-pointer'>Remove Variant</button>
                </div>
                
                </div>
                ))}
                <div className='lg:flex   lg:justify-center  grid grid-cols-1 items-center mt-[40px]'>
                    <button onClick={addVaritants} className='h-[35px] w-[120px] rounded-sm bg-black text-white cursor-pointer'>Add Variant</button>
                </div>
              

                <div className="flex justify-center">
                    <input onChange={handleChange} className="hidden" type="file" name="photos" multiple accept="image" id="uploadImage"/>
                    <label htmlFor="uploadImage">
                        <div className=" p-3 rounded-xl cursor-pointer flex justify-center gap-2 items-center">
                            <img className="w-[50px] h-[50px]" src="/upload.gif" alt="upload-icone"/>
                            <p className="text-xl font-semibold">Upload Photos</p>
                            <p className="text-sm text-gray-500">(Max 5 photos (JPEG,JPG Format Only))</p>
                        </div>
                    </label>
            </div>
            </div>
            <div className="flex justify-center items-center my-[10px]">
                <button onClick={addProduct} className="bg-green-300 p-3 rounded-xl cursor-pointer font-semibold">Add Product</button>
            </div>
            

        </div>

       {loading&&<Loading/>}
       </>
    )
}