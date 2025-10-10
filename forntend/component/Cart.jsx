import testPhoto from '../public/glass.jpg'
import Image from 'next/image'

export default function cart({closeModal}){
    return(
          <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50`}>
        <div className={`grid justify-items-center center content-center items-center bg-white p-[25px] rounded-2xl w-[500px] text-center text-black`}>
            <p className='text-2xl font-bold'>Cart Items ()</p>
        
            <div className='grid grid-cols-1 content-center w-full'>
                <div className='flex items-center justify-around  shadow-sm my-[20px] p-2'>
                    <Image src={testPhoto} height={40} width={60} alt='cart-product'/>
                    <div className='grid grid-cols-1'>
                        <h1 className='text-[15px]'>Women Styles Glass Brand New </h1>
                        <div className='flex justify-around items-center  gap-2 text-xs'>
                        <h2>Price: ₱800</h2>
                        <h2>Quintity: 1</h2>
                        <h2>Size: XL</h2>
                        <h2>Color: Green</h2>
                    </div>
                    </div>

                    <div>
                        <button className='h-[30px] w-[80px] rounded-xl bg-red-400 cursor-pointer text-white'>Delete</button>
                    </div>
                 
                </div>
               
            </div>

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