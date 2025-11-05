import React from 'react'

function productEditModal({design, closeModal, submitEdit, nameValue, nameOnCh,descriptionValue, descriptionOnCh, priceValue, priceOnCh, stockValue, stockOnCh,
sizeValue, sizeOnCh, variantValue, variantOnCh, colorValue, colorOnCh, weightValue, weightOnCh, originalPriceValue, originalPriceOnCh
}) {
  return (
    <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-999 transition-opacity duration-500 ${design?"opacity-100":'opacity-0'}`} >
        <div className= {`grid justify-center content-center items-center bg-white lg:w-[500px] w-[400px] p-2 rounded-2xl text-center text-black duration-1000 ${design?'scale-100':'scale-0'}`}>
            <p className='text-3xl mb-[30px] text-gray-400'> Edit Product Details</p>
          
                  <div className="grid grid-cols-1 gap-2 lg:w-[400px] w-[300px]">
                <input value={nameValue} onChange={nameOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Name"/>
                <input value={descriptionValue} onChange={descriptionOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Description"/>
                <div className='lg:flex lg:justify-between grid grid-cols-1'>
                  <input value={priceValue} onChange={priceOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="number" placeholder="Price"/>
                  <input value={stockValue} onChange={stockOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="number" placeholder="Stock"/>
                  
                </div>
                <div className='lg:flex lg:justify-between grid grid-cols-1'>
                  <input value={sizeValue} onChange={sizeOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Size (Seperate By (,))"/>
                  <input value={colorValue} onChange={colorOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Color (Seperate By (,))"/>
                </div>
                  <div className='lg:flex lg:justify-between grid grid-cols-1'>
                  <input value={variantValue} onChange={variantOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Variant (Seperate By (,))"/>
                  <input value={weightValue} onChange={weightOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="number" placeholder="Weight"/>
                </div>
                <div className='lg:flex lg:justify-between grid grid-cols-1'>
                  <input value={originalPriceValue} onChange={originalPriceOnCh} className="border-1 border-gray-300 p-2 rounded-xl" type="number" placeholder="Original Price"/>
                </div>
              
               <button onClick={submitEdit} className="p-2 text-white rounded-2xl bg-blue-400 mt-[15px] cursor-pointer">Submit Edit</button>
               <button onClick={closeModal} className="p-2 text-white rounded-2xl bg-blue-400  cursor-pointer">Cancel Edit</button>
            </div>
                   
        </div>
      
    </div>
  )
}

export default productEditModal
