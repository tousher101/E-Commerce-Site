import React from 'react'

function DeleteModal({design, closeModal, submitDelete}) {
  return (
    <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-50 transition-opacity duration-500 ${design?"opacity-100":'opacity-0'} `}>
        <div className={`grid justify-center content-center items-center bg-[rgb(29,24,24)] p-[25px] rounded-2xl w-[500px] text-center text-white duration-1000 ${design?'scale-100':'scale-0'}`}>
          <p className='text-3xl text-gray-400 '>Warning!</p>
      <div className='mt-[30px] flex flex-col items-center'>
        <h1 className='text-xl'>Are You Sure! You Want To Delete?</h1>
        <button onClick={submitDelete}  className='border-1 mt-[15px] h-[50px] w-[180px] rounded-xl cursor-pointer hover:scale-110 duration-1000' type='submit'>Yes</button>
        <button onClick={closeModal}    className='border-1 mt-[15px] h-[50px] w-[180px] rounded-xl cursor-pointer hover:scale-110 duration-1000'>No</button>
      </div>
    </div>
      </div>
  )
}

export default DeleteModal
