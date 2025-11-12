import Image from "next/image"
import ReviewImage from '../public/review.png'
import popular from '../public/popular.png'
import sell from '../public/sell.png'
export default function productStatusCard({photo, name, price, originalPrice, stock, review, status}){
    return(
        <div className="w-full mx-auto overflow-hidden bg-[#FCFCF7]" data-aos='slide-up'>
            <div className="flex justify-center items-center rounded-xl border-1 border-gray-400 p-2 gap-6">
                     <Image src={photo} width={100} height={80} alt="product-photo" className="h-[80px] w-[100px]" />
               
                <div className=" grid grid-cols-1 gap-2">
                    <h1 className="text-center font-semibold">{name}</h1>
                    <div className="flex justify-center items-center gap-2">
                        <h1 className="font-semibold line-through text-gray-400">₱{originalPrice}</h1>
                        <h1 className="font-semibold">₱{price}</h1>
                        <h1>Stock({stock})</h1>
                        <div className=" flex items-center gap-1">
                        <Image src={ReviewImage} height={20} width={20} alt="review-photo"/>
                        <h1>Review({review})</h1>
                        </div>
                    </div>
                 

                </div>
                   <div>
                        {status==='TOP_SELLING'?<Image src={sell} height={50} width={50} alt="top-selling-photo"/>:<Image src={popular} height={50} width={50} alt="top-selling-photo"/>}
                    </div>

            </div>

        </div>
    )
}