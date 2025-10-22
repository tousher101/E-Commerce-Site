import React from 'react'

function EditTaskModal({design, closeModal, zoneValue, baseFeeValue, perKgFeeValue, zoneValueOnCha, baseFeeValueOnCha,perKgFeeValueOnCha, submitEdit}) {
  return (
    <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50 transition-opacity duration-500 ${design?"opacity-100":'opacity-0'}`} >
        <div className= {`grid justify-center content-center items-center bg-white p-[25px] rounded-2xl w-[500px] text-center text-black duration-1000 ${design?'scale-100':'scale-0'}`}>
            <p className='text-3xl mb-[30px] text-gray-400'> Edit Shipping Fee Rate</p>
          
                  <div className="grid grid-cols-1 gap-2 ">
                <input value={zoneValue} onChange={zoneValueOnCha} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Zone Name"/>
                <div className=" flex gap-1 justify-center">
                    <input value={baseFeeValue} onChange={baseFeeValueOnCha} className="border-1 border-gray-300 p-2 rounded-xl"  type="text" placeholder="Base Fee"/>
                    <input value={perKgFeeValue} onChange={perKgFeeValueOnCha} className="border-1 border-gray-300 p-2 rounded-xl"  type="text" placeholder="Per Kg Fee"/>
                </div>
               <button onClick={submitEdit} className="p-2 text-white rounded-2xl bg-blue-400 mt-[15px] cursor-pointer">Submit Edit</button>
               <button onClick={closeModal} className="p-2 text-white rounded-2xl bg-blue-400  cursor-pointer">Cancel Edit</button>
            </div>
                   
        </div>
      
    </div>
  )
}

export default EditTaskModal
