export default function addProduct(){
    return(
        <div className="max-w-[1380px] mx-auto overflow-hidden">
            <h1 className="text-center text-gray-500 text-3xl font-semibold my-[20px]">Add Product</h1>
            <div className="grid grid-cols-1 gap-2 p-4 ">
                <input className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Product Name"/>
                <input className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Description"/>
                <div className="flex justify-between items-center">
                <input className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Price"/>
                <input className="border-1 border-gray-500 rounded-xl p-2" type="number" placeholder="Stock"/>
                <input className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Size"/>
                </div>

                <div className="flex justify-between items-center">
                <input className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Color"/>
                <input className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Veriant"/>
                <select className="border-1 border-gray-500 rounded-xl p-2 px-11">
                    <option>Men's Fashion</option>
                    <option>Women's Fashion</option>
                    <option>Kid's Fashion</option>
                    <option>Accessories</option>
                    <option>Perfume</option>
                </select>
                </div>
                <input className="border-1 border-gray-500 rounded-xl p-2" type="text" placeholder="Barcode Scan (If Need)"/>

                <div className="flex justify-center">
                    <input className="hidden" type="file" name="photos" multiple accept="image" id="uploadImage"/>
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
                <button className="bg-green-300 p-3 rounded-xl cursor-pointer font-semibold">Add Product</button>
            </div>
            

        </div>
    )
}