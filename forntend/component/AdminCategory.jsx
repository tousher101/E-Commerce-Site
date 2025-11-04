import Link from "next/link"
export default function adminCategory(){
    return(
         <div className=" mx-[10px]  my-[15px]">
            <h1 className=" text-center text-3xl font-semibold">Category</h1>
             <div data-aos='fade-up-left' className=" grid lg:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-5 my-[30px]">
              
              <Link href='/admindashboard/productbycat/mensfashion'> <div  className="h-[200px]  rounded-2xl grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/shirt-shoe.gif' alt='menfashion'/>
                    <h1 className="text-xl font-semibold">Men's Fashion</h1>
                </div></Link>


                <Link href='/admindashboard/productbycat//womensfashion'><div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px]' src='/women-fashion.gif' alt='womensfashion'/>
                    <h1 className="text-xl font-semibold">Women's Fashion</h1>
                </div></Link> 
               

                <Link href='/admindashboard/productbycat//kidsfashion'><div className="h-[200px]  rounded-2xl grid grid-cols-1 border  border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px]' src='/baby-clothes.gif' alt='kidsfashion'/>
                    <h1 className="text-xl font-semibold">Kid's Fashion</h1>
                </div></Link>
               
                  

                  <Link href='/admindashboard/productbycat//accessories'><div className="h-[200px]  rounded-2xl grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px]' src='/deer-horns.gif' alt='accessories'/>
                    <h1 className="text-xl font-semibold">Accessories</h1>
                </div></Link>

                  <Link href='/admindashboard/productbycat//perfume'><div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px]' src='/perfume.gif' alt='perfume'/>
                    <h1 className="text-xl font-semibold">Perfume</h1>
                </div></Link>
    
             </div>

        </div>
    )
}