
import Image from "next/image"
import BannarPhoto from '../public/model.png'

export default function bannar(){
 
    return(
        <div  className=" mx-w-[1380px] bg-white shadow-sm mx-[10px] lg:flex md:flex grid grid-cols-1 items-center lg:justify-evenly md:justify-evenly justify-items-center  lg:mt-[0px] md:mt-[0px] mt-[20px] rounded-xl  p-3">
            <div data-aos='flip-left'>
                <Image src={BannarPhoto} alt="model" height={350} priority/>
            </div>

            <div data-aos='fade-up' className="grid grid-cols-1 justify-items-center">
                <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold my-[10px]"> Discover Fashion Trends</h1>
                <h2 className="lg:text-2xl md:text-xl text-center mb-[10px]">Shop the latest fashion treands and find your favorite from out wide selection</h2>
                <button className="bg-blue-500 rounded-xl h-[40px] w-[120px] text-white cursor-pointer shadow-xl">Shop Now</button>
            </div>

        </div>
    )
}