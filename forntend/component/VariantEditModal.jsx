

export default function variantEditModal({closeModal, priceValue,priceOnCh,origianlPriceValue,originalPriceOnCh, sizeValue,sizeOnCh,colorValue,colorOnCh,variantValue,variantOnCh, submitEdit}){
    return(
        <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50`} >
        <div className= {`grid justify-center content-center items-center bg-white lg:w-[500px] md:w-[400px] w-[350px] p-2 rounded-2xl text-center text-black `}>
            <p className='text-3xl mb-[30px] text-gray-400 font-semibold'> Edit Variant</p>
          
                  <div className="grid grid-cols-1 gap-1">
                <div className='lg:flex lg:justify-between grid grid-cols-1 gap-2'>
                  <input value={priceValue} onChange={priceOnCh}  className="border-1 border-gray-300 p-2 rounded-xl" type="number" placeholder="Price"/>
                  <input value={origianlPriceValue}  onChange={originalPriceOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="number" placeholder="Original Price"/>
                  
                </div>
             
                  <div className='lg:flex lg:justify-between grid grid-cols-1 gap-2'>
                 <input value={sizeValue} onChange={sizeOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Size"/>
                  <input value={colorValue} onChange={colorOnCh}  className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Color"/>
                </div>

                 <div className='lg:flex lg:justify-between grid grid-cols-1 gap-2'>
                 <input value={variantValue}  onChange={variantOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Variant"/>
                </div>
             
              
               <button onClick={submitEdit} className="p-2 text-white rounded-2xl bg-blue-400 mt-[15px] cursor-pointer">Submit Edit</button>
               <button onClick={closeModal} className="p-2 text-white rounded-2xl bg-blue-400  cursor-pointer">Cancel Edit</button>
            </div>
                   
        </div>
      
    </div>
    )
}