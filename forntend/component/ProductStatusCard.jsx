import Image from "next/image"
import ReviewImage from '../public/review.png'
import popular from '../public/popular.png'
import sell from '../public/sell.png'
export default function productStatusCard({photo, name, price, originalPrice, stock, review, status}){
    return(
        <div className="w-full mx-auto overflow-hidden bg-[#FCFCF7]" data-aos='slide-up'>
            <div className="lg:flex grid md:flex grid-cols-1 lg:justify-around md:justify-around justify-items-center text-sm items-center rounded-xl border-1 border-gray-400 p-2 gap-6 w-full">
                     <Image src={photo} width={100} height={80} alt="product-photo" className="h-[80px] w-[100px] rounded-sm" />
               
                <div className=" grid grid-cols-1 gap-2">
                    <h1 className="text-center font-semibold">{name}</h1>
                    <div className="lg:flex md:flex grid grid-cols-2 lg:justify-around md:justify-around justify-items-center items-center lg:gap-6 md:gap-6 gap-2 ">
                        <h1 className="font-semibold line-through text-gray-400">₱{originalPrice}</h1>
                        <h1 className="font-semibold">₱{price}</h1>
                        <h1>Stock({stock})</h1>
                        <h1>Review({review})</h1>
                        
                    </div>
                 

                </div>
                   <div>
                        {status==='TOP_SELLING'?<Image src={sell} height={30} width={30} alt="top-selling-photo"/>:<Image src={popular} height={30} width={30} alt="top-selling-photo"/>}
                    </div>

            </div>

        </div>
    )
}