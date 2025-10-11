import ProductSummary from '../component/ProductSummary'

export default function cart({closeModal}){
    return(
          <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50`}>
        <div className={`grid justify-items-center center content-center items-center bg-white p-[15px] rounded-2xl w-[500px] text-center text-black`}>
            <p className='text-2xl font-bold'>Cart Items ()</p>
                <ProductSummary/>

               <div className='flex justify-between items-center w-full text-xs my-[15px] text-gray-400'>
                        <h1>Created At:</h1>
                        <h1>Update At:</h1>
                    </div>
         

         <div className="flex items-center gap-2 text-white">
            <button  className=' h-[40px] w-[100px]  bg-green-500 rounded-xl  cursor-pointer'>Checkout</button>
            <button onClick={closeModal} className=' h-[40px] w-[100px]  bg-red-500 rounded-xl  cursor-pointer'>Cancel</button>
         </div>
             
        </div>

    </div>
    )
}