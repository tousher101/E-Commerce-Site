
import Image from 'next/image'
import Sold from '../public/sold.png'
import Review from '../public/review.png'
import NoImage from '../public/noimage.png'
import Link from 'next/link'

export default function Product({name, description,price,stock,sold,photos,comment,originalPrice, productId}){
  
    return(
        
        <div className=" max-w-[1380px] mx-[10px] overflow-hidden grid grid-cols-1 mt-[10px] ">
            
                <div className="h-[380px] w-[300px] border-1 border-gray-400 grid grid-cols-1 rounded-xl mb-[10px] shadow-sm">
                    <div className='h-[180px] w-[300px] p-1  rounded-xl'>
                         <Image src={photos||NoImage} height={180} width={300} priority className='rounded-xl object-cover h-full w-full ' alt='productphoto' />
                    </div>
                    <div className='mx-[5px] mt-[15px]'>
                    <h1 className='font-semibold text-m'>{name}</h1>
                    <h2 className='text-[12px] break-words'>{description}</h2>
                    <div className='flex gap-2'>
                        <h2 className='text-gray-500 line-through font-semibold'>₱{originalPrice}</h2>
                        <h2 className='font-bold'>₱{price} </h2>
                    </div>
                    <h2 className='text-sm'>Stock({stock})</h2>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className='flex items-center gap-1'>
                          <Image src={Sold} height='auto' width='auto' className='h-[20px] w-[20px]' alt='sold-logo'/>
                            <h1 className='text-gray-500'>Sold({sold?sold:0})</h1>
                        </div>
                        <div>
                            <h1 className='text-gray-500'>||</h1>
                        </div>
                        <div className='flex items-center justify-between gap-1'>
                            <Image src={Review} height='auto' width='auto' className='h-[20px] w-[20px]' alt='review-logo'/>
                             <h2 className='text-gray-500'>Review ({comment})</h2>
                        </div>
                         
                       
                    </div>
                
                    <div className='mx-[5px] flex justify-center mb-2'>
                       <Link href={`/${productId}`}> <button className='bg-gray-700 mt-[10px] rounded-xl h-[40px] w-[120px] cursor-pointer shadow-xl text-white'>Details</button></Link>
                    </div>

                </div>
        </div>
    
    )
}