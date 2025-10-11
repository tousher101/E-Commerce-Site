import Image from "next/image"
import testPhoto from'../public/glass.jpg'

export default function productSummary(){
    return(
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
    )
}