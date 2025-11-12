

import Image from "next/image"
import noImage from '../public/noimage.png'

export default function productSummary({photo, name, price, quantity, size, color, variant, cartId,submitItemDelete, mode}){
   
   
    return(
            <div className='grid grid-cols-1 justify-items-center w-full rounded-xl'>
                        <div data-aos='slide-up' className=' flex  items-center justify-center bg-[#F2F8FC]  rounded-xl  shadow-sm my-[20px] p-2 w-full'>
                            <Image src={photo||noImage} height={40} width={60} className="h-[40] w-[60] rounded-sm" alt='cart-product'/>
                            <div className='grid grid-cols-1 justify-items-center mx-[10px]'>
                                <h1 className='text-[15px] font-semibold mb-[10px]'>{name} </h1>
                                <div className='lg:flex md:flex lg:justify-around  md:justify-around grid grid-cols-3 items-center justify-items-start  gap-2 text-xs'>
                                <h2>Price : ₱{price}</h2>
                                <h2 className="lg:flex md:flex hidden">||</h2>
                                <h2>Quantity : {quantity}</h2>
                                 <h2 className="lg:flex md:flex hidden">||</h2>
                                <h2>Size : {size}</h2>
                                 <h2 className="lg:flex md:flex hidden">||</h2>
                                <h2>Color : {color}</h2>
                                <h2 className="lg:flex md:flex hidden ">||</h2>
                                <h2>Variant : {variant}</h2>
                            </div>
                            </div>
        
                            {mode==='CheckOut'? <div>
                              <button onClick={()=>{submitItemDelete(cartId)}}   className="h-[45px] w-[45px] rounded-xl border-1 border-gray-400 flex justify-center items-center"><img src="/bin.gif" className="h-[35px] w-[35px] cursor-pointer" alt="detele-icon"/></button>
                            </div>:''}
                         
                        </div>
                       
                    </div>
    )
}