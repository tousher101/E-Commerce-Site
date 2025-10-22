

export default function(){
    return(
        <div className="max-w-[1380px] mx-[10px] overflow-hidden ">
            <h1 className="text-center text-gray-500 text-3xl font-semibold">Our Services</h1>
            <div className="grid lg:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-5 my-[30px] ">
                 <div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/shipping.gif' alt='shipping-logo'/>
                    <h1 className="text-xl font-semibold">Free Shipping</h1>
                    <p className="text-[12px] text-gray-500">Free Shipping on all orders above ₱1200</p>
                </div>

                   <div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/helpdesk.gif' alt='shipping-logo'/>
                    <h1 className="text-xl font-semibold">24x7 Customer Support</h1>
                    <p className="text-[12px] text-gray-500">Contact us 24 hours a day 7 days a week</p>
                </div>

                   <div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/return-policy.gif' alt='shipping-logo'/>
                    <h1 className="text-xl font-semibold">Return Policy</h1>
                    <p className="text-[12px] text-gray-500">Simply return it within 30 days</p>
                </div>

                 <div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/payment-secure.gif' alt='shipping-logo'/>
                    <h1 className="text-xl font-semibold">Payment Secure</h1>
                    <p className="text-[12px] text-gray-500">Hassle-free secure online payment</p>
                </div>

                 <div className="h-[200px]  rounded-2xl  grid grid-cols-1 border border-gray-400 justify-items-center hover:scale-105 duration-1000 cursor-pointer">
                    <img className='h-[80px] w-[80px] mt-[20px] ' src='/fast-delivery.gif' alt='shipping-logo'/>
                    <h1 className="text-xl font-semibold">Fast Delivery</h1>
                    <p className="text-[12px] text-gray-500">Super fast delivery on time</p>
                </div>

            </div>

        </div>
    )
}