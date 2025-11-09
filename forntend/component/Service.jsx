
export default function service(){

    return(
        <div data-aos='zoom-in' className=" max-w-[1380px] mx-[10px] overflow-hidden mb-[10px]">
            <h1 className="ml-[20px] text-gray-500 text-3xl font-bold">Ser<span className="text-green-500">vices</span></h1>
            <div  className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-5 my-[10px] mx-[5px] ">
                 <div  className="h-[200px]  rounded-2xl  grid grid-cols-1 border-1 border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer p-1">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/shipping.gif' alt='shipping-logo'/>
                    <h1 className="text-xl text-center font-semibold">Free Shipping</h1>
                    <p className="text-[12px] text-center text-gray-500">Free Shipping on all orders above ₱1200</p>
                </div>

                   <div  className="h-[200px]  rounded-2xl  grid grid-cols-1 p-1 border-1 border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/helpdesk.gif' alt='shipping-logo'/>
                    <h1 className="text-xl text-center font-semibold">24x7 Customer Support</h1>
                    <p className="text-[12px] text-center text-gray-500">Contact us 24 hours a day 7 days a week</p>
                </div>

                   <div  className="h-[200px]  rounded-2xl p-1  grid grid-cols-1 border-1 border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/return-policy.gif' alt='shipping-logo'/>
                    <h1 className="text-xl text-center font-semibold">Return Policy</h1>
                    <p className="text-[12px] text-center text-gray-500">Simply return it within 30 days</p>
                </div>

                 <div  className="h-[200px]  rounded-2xl  grid grid-cols-1 border-1 p-1 border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/payment-secure.gif' alt='shipping-logo'/>
                    <h1 className="text-xl text-center font-semibold">Payment Secure</h1>
                    <p className="text-[12px] text-center text-gray-500">Hassle-free secure online payment</p>
                </div>

                 <div  className="h-[200px]  rounded-2xl  grid grid-cols-1 border-1 p-1 border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/fast-delivery.gif' alt='shipping-logo'/>
                    <h1 className="text-xl text-center font-semibold">Fast Delivery</h1>
                    <p className="text-[12px] text-center text-gray-500">Super fast delivery on time</p>
                </div>

            </div>

        </div>
    )
}