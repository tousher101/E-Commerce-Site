import ProductSummary from '../component/ProductSummary'



export default function cart({closeModal, design, data, totalItems,submitItemDelete, areaValue, areaOnCh, goCheckOut, mode}){

   
    return(
     
          <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50 transition-opacity duration-1000 ${design?'opacity-100':'opacity-0'}`}>
        <div className={`grid justify-items-center center content-center items-center bg-white p-[15px] rounded-2xl w-[620px] text-center text-black duration-1000 ${design?'scale-100':'scale-0'}`}>
            <p className='text-2xl font-bold'>Cart Items ({totalItems})</p>
            <div className='grid grid-cols-1 gap-1'>
                {data?.items<0?data?.items?.map((item,index)=>(
                    <div key={index}>
                    <ProductSummary photo={item?.product?.photos[0]?.url} name={item?.product?.name} price={item?.product?.price} size={item?.size} quantity={item?.quantity} color={item?.color} variant={item?.variant} cartId={item?.id} submitItemDelete={submitItemDelete}    />
                     </div>
                )):<h1 className='text-center text-gray-400 mt-[30px] text-xl'>The cart is Empty </h1>}
                  
            </div>
                

               <div className='flex justify-between items-center w-full text-xs my-[15px] text-gray-400'>
                        <h1>Created At : {new Date(data?.createdAt).toDateString()}</h1>
                        <h1>Update At : {new Date(data?.updatedAt).toDateString()}</h1>
                    </div>
                    <div>
                        <select value={areaValue} onChange={areaOnCh}  className='border-1 border-gray-400 p-2 rounded-xl my-[25px]'>
                            <option value=''>Select Shipping Area</option>
                            <option value='Luzon'>Luzon</option>
                            <option value='Metro Manila'>Metro Manila</option>
                            <option value='Visaya'>Visaya</option>
                            <option value='Mindanao'>Mindanao</option>
                        </select>
                    </div>
         

         <div className="flex items-center gap-2 text-white">
           <button onClick={goCheckOut}  className=' h-[40px] w-[100px]  bg-green-500 rounded-xl  cursor-pointer'>Checkout</button>
            <button onClick={closeModal} className=' h-[40px] w-[100px]  bg-red-500 rounded-xl  cursor-pointer'>Cancel</button>
         </div>
             
        </div>

    </div>
   
    )
}