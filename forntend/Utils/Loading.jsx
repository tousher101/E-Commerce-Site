

function Loading() {
  return (
    <div className='fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-50 transition-opacity duration-500'>
        <div className='flex justify-center '>
             <img className='h-[100px] w-[100px]' src='/load.gif'/>
        </div>
       
    </div>
  )
}

export default Loading