import ProductImageSlider from '../Utils/Slider2'

export default function productDetails({name, des, price, originalPrice, weight, color, size, variant, stock, photos,selectedSizeValue,
    selectedSizeOnCh,selectedColorValue, selectedColorOnCh, selectedVariantValue, selectedVariantOnCh,selectedQuantity,selectedQuantityOnCh,submitAddToCart
}){

    return(
        <div className="nx-auto overflow-hidden mt-[20px]">
            <h1 className='text-center text-3xl text-gray-400 font-semibold'>Product Summary</h1>
            <div className=' my-[30px]'>
           <ProductImageSlider photos={photos}/>
            </div>
            <div className=' text-gray-500 text-center'>
                <h1 className='font-semibold text-2xl'>{name}</h1>
                <h1 >{des}</h1>
                <div className='flex justify-around mt-[20px]'>
                    <h1 className='font-semibold'>Price :  ₱{price}</h1>
                    <h1 className='text-black font-semibold line-through'>Original Price :  ₱{originalPrice}</h1>
                    <h1>Stock : {stock} pcs</h1>
                    <h1>Weight: {weight} kg</h1>
                </div>
                <div className='flex justify-around my-[30px]'>
                   
                        <select value={selectedSizeValue} onChange={selectedSizeOnCh} className='border-1 border-gray-400 p-2 rounded-xl'>
                        <option value={''}>Select Size</option>
                        {size?.map((siz,index)=>( 
                            <option key={index} value={siz}>{siz}</option>
                        ))}
                    </select>
                      <select value={selectedQuantity} onChange={selectedQuantityOnCh} className='border-1 border-gray-400 p-2 rounded-xl'>
                        <option>Select Quantity</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                        <option value='7'>7</option>
                        <option value='8'>8</option>
                        <option value='9'>9</option>
                        <option value='10'>10</option>
                    </select>
                    
                        <select value={selectedColorValue} onChange={selectedColorOnCh} className='border-1 border-gray-400 p-2 rounded-xl'>
                        <option>Select Color</option>
                        {color?.map((col,index)=>(
                            <option value={col} key={index}>{col}</option>
                        ))}
                    </select>
                      <select value={selectedVariantValue} onChange={selectedVariantOnCh} className='border-1 border-gray-400 p-2 rounded-xl'>
                        <option>Select Variant</option>
                        {variant?.map((ver, index)=>(
                            <option key={index} value={ver}>{ver}</option>
                        ))}
                    </select>
                    
                </div>
            </div>
            <div className='flex justify-center '>
                <button onClick={submitAddToCart} className='h-[40px] w-[125px] cursor-pointer rounded-xl mb-[50px] bg-black text-white'>+Add To Cart</button>
            </div>
            

        </div>
    )
}