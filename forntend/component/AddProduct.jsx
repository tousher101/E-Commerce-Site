export default function addProduct({name,nameOnCh,description,descriptionOnCh,price,priceOnCh,stock,stockOnCh,color,colorOnCh,
    size,sizeOnCh,category,categoryOnCh,variant,variantOnCh,weight,weightOnCh, bardcode, barcodeOnCh, submitAddProduct, photosOnCh,
    originalPrice,originlPriceOnCh
}){
    return(
        <div className=" mx-auto overflow-hidden">
            <h1 className="text-center text-gray-500 text-3xl font-semibold my-[20px]">Add Product</h1>
            <div className="grid grid-cols-1 gap-2 p-4 ">
                <input value={name} onChange={nameOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Product Name"/>
                <input value={description} onChange={descriptionOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Description"/>
                <div className="lg:flex  lg:justify-between  grid grid-cols-1 gap-2 items-center">
                <input value={price} onChange={priceOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Price"/>
                <input value={stock} onChange={stockOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Stock"/>
                <input value={size} onChange={sizeOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Size"/>
                <input value={weight} onChange={weightOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Weight"/>
                </div> 

                <div className="lg:flex   lg:justify-between  grid grid-cols-1 gap-2 items-center">
                <input value={color} onChange={colorOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Color"/>
                <input value={variant} onChange={variantOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Veriant"/>
                <input value={originalPrice} onChange={originlPriceOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Original Price"/>
                <select value={category} onChange={categoryOnCh} className="border-1 border-gray-500 rounded-xl p-2 px-11">
                    <option value=''>Select Category</option>
                    <option value="MENSFASHION">Men's Fashion</option>
                    <option value='WOMENFASHION'>Women's Fashion</option>
                    <option value='KIDSFASHION'>Kid's Fashion</option>
                    <option value='ACCESSORIES'>Accessories</option>
                    <option value='PERFUME'>Perfume</option>
                </select>
                
                </div>
                <input value={bardcode} onChange={barcodeOnCh} className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Barcode Scan (If Need)"/>

                <div className="flex justify-center">
                    <input onChange={photosOnCh} className="hidden" type="file" name="photos" multiple accept="image" id="uploadImage"/>
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
                <button onClick={submitAddProduct} className="bg-green-300 p-3 rounded-xl cursor-pointer font-semibold">Add Product</button>
            </div>
            

        </div>
    )
}