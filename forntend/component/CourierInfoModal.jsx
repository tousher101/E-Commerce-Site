export default function courierInfoModal({closeModal, courierData,courierNameValue,courierNameOnCh,trackingNumber, trackingNumberOnCh,submitShippedOrder}){
    return(
         <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50`} >
        <div data-aos = 'flip-left' className= {` justify-center content-center items-center bg-white p-[25px] rounded-2xl w-[500px] text-center text-black`}>
            <p className='text-3xl mb-[30px] text-gray-400 font-semibold'>Add Shipping Information</p>
          
                  <div className=" grid grid-cols-1 justify-items-center gap-3 ">
                     <select value={courierNameValue} onChange={courierNameOnCh} className='border-1 p-2 rounded-xl'>
                        <option value={''}>Select Courier</option>
                        {courierData?.map((cou,index)=>(
                            <option key={index} value={cou.id}>{cou?.courierName}</option>
                        ))}
                    </select>
               
                    <input value={trackingNumber} onChange={trackingNumberOnCh} type="text" placeholder="Tracking Number" className="p-2 rounded-xl"/>
                   
                    </div>
                    
                    <div className="flex justify-center gap-3 mt-[15px]">
                    <button onClick={submitShippedOrder}   className="p-2 text-white rounded-sm bg-blue-400  cursor-pointer">Submit</button>
                     <button onClick={closeModal}  className="p-2 text-white rounded-sm bg-blue-400  cursor-pointer">Cancel</button>
                    </div>
      
    </div>
    </div>
    )
}