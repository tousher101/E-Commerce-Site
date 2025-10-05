import Image from "next/image"
import BannarPhoto from '../public/model.png'
export default function bannar(){
    return(
        <div className=" flex items-center justify-evenly  bg-white">
            <div className="">
                <Image src={BannarPhoto} alt="model" height={350}/>
            </div>

            <div className="grid grid-cols-1 justify-items-center">
                <h1 className="text-5xl font-bold my-[10px]"> Discover Fashion Trends</h1>
                <h2 className="text-2xl mb-[10px]">Shop the latest fashion treands and find your favorite from out wide selection</h2>
                <button className="bg-blue-500 rounded-xl h-[40px] w-[120px] text-white cursor-pointer shadow-xl">Shop Now</button>
            </div>

        </div>
    )
}