import Image from "next/image"
import salesIcon from '../public/sales.png'
import presentIcon from '../public/present.png'
import previousIcone from '../public/previous.png'
import growthIcon from '../public/economic-growth.png'
import orderIcone from '../public/order-now.png'
import pendingIcone from '../public/file.png'
import confirmdIcon from '../public/shopping-bag.png'
import shippedIcone from '../public/cargo-ship.png'
import deliveredIcone from '../public/package-delivered.png'
import cancelledIcone from '../public/bag.png'
export default function adminCard(){
    return(
        <div className=" mx-w-[1380px] mx-auto overflow-hidden  mt-[50px]">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Monthly Report</h2>
            <div className="  grid grid-cols-3 gap-5 ">
                <div className="  p-3 bg-gradient-to-r from-[#8A2BE2] to-[#00FFFF] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                    <div className="flex items-center justify-center gap-1">
                        <Image src={salesIcon} height={30} width={30} alt="sales-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Total Sales (Monthly)</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present -₱  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - ₱</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>

                 <div className=" p-3 bg-gradient-to-r from-[#8A2BE2] to-[#FF69B4] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                   <div className="flex items-center justify-center gap-1">
                        <Image src={orderIcone} height={40} width={40} alt="order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Total Order (Monthly)</h1>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present - Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>

                 
                 <div className=" p-3 bg-gradient-to-r from-[#FFFF00] to-[#FF69B4] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                     <div className="flex items-center justify-center gap-1">
                        <Image src={pendingIcone} height={30} width={30} alt="pending-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Pending Order (Monthly)</h1>
                    </div>
                  <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present - Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>

                    <div className=" p-3 bg-gradient-to-r from-[#00FFFF] to-[#584951] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={confirmdIcon} height={30} width={30} alt="confirmed-order-Icone"/>
                        <h1 className="grid text-center text-[19px] font-semibold">Confirmed Order (Monthly)</h1>
                    </div>
                       <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present - Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>

                 <div className=" p-3 bg-gradient-to-r from-[#39e45e] to-[#82ce95] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={shippedIcone} height={30} width={30} alt="shipped-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Shipped Order (Monthly)</h1>
                    </div>
                       <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present - Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>


                   <div className=" p-3 bg-gradient-to-r from-[#da7939] to-[#82ce95] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={deliveredIcone} height={30} width={30} alt="delivered-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Delivered Order (Monthly)</h1>
                    </div>
                       <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present - Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>
            </div>
            
                <div className=" flex justify-center mt-[15px]">
                    <div className=" p-3 bg-gradient-to-r from-[#d10909] to-[#6d5ec2] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={cancelledIcone} height={30} width={30} alt="cancelled-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Cancelled Order (Monthly)</h1>
                    </div>
                       <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present - Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous - Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className="font-semibold">Growth - %</h1>
                        </div>
                    </div>
                </div>

                </div>

        </div>
    )
}