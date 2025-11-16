import Image from "next/image"
import salesIcon from '../public/sales.png'
import presentIcon from '../public/present.png'
import previousIcone from '../public/previous.png'
import growthIcon from '../public/economic-growth.png'
import orderIcone from '../public/order-now.png'
import pendingIcone from '../public/file.png'
import shippedIcone from '../public/cargo-ship.png'
import deliveredIcone from '../public/package-delivered.png'
import cancelledIcone from '../public/bag.png'
import confIcone from '../public/sold.png'
export default function adminCard({prevSales, currSales, salesGrowth, prevOrder, currOrder, orderGrowth,
   prevDeliveredOrder, currDeliveredOrder, deliveredOrderGrwoth, prevCancelledOrder, currCancelledOrder,
cancelledOrderGrowth, paidOrderGrowth,currentPaidOrder,prevPaidOrder, codOrderGrowth, currentCodOrder, 
prevCodOrder,returnOrderGrwoth,currentReturnOrder,prevReturnOrder

}){
    return(
        <div className="  mx-auto overflow-hidden w-full  mt-[50px] mb-[25px]">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Monthly Report</h2>
            <div className=" flex flex-wrap justify-center gap-2 ">
                <div  data-aos='fade-up' className=" h-[180px] w-[320px]  p-3 bg-gradient-to-r from-[#dfc6c6] to-[#00FFFF] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                    <div className="flex items-center justify-center gap-1">
                        <Image src={salesIcon} height={30} width={30} alt="sales-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Total Sales (Monthly)</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : ₱{currSales}  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : ₱{prevSales}</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currSales>prevSales?'text-green-500':'text-red-500'}`}>Growth : {salesGrowth} %</h1>
                        </div>
                    </div>
                </div>

                 <div  data-aos='fade-up' className="  h-[180px] w-[320px] p-3 bg-gradient-to-r from-[#dfc6c6] to-[#FF69B4] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                   <div className="flex items-center justify-center gap-1">
                        <Image src={orderIcone} height={40} width={40} alt="order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Total Order (Monthly)</h1>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : {currOrder} Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : {prevOrder} Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currOrder>prevOrder?'text-green-500':'text-red-500'}`}>Growth : {orderGrowth} %</h1>
                        </div>
                    </div>
                </div>
                              <div  data-aos='fade-up' className="  h-[180px] w-[320px] p-3 bg-gradient-to-r from-[#dfc6c6] to-[#82ce95] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={deliveredIcone} height={30} width={30} alt="delivered-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Delivered Order (Monthly)</h1>
                    </div>
                       <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : {currDeliveredOrder} Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : {prevDeliveredOrder} Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currDeliveredOrder>prevDeliveredOrder?'text-green-500':'text-red-500'}`}>Growth : {deliveredOrderGrwoth} %</h1>
                        </div>
                    </div>
                </div>              

                                <div  data-aos='fade-up' className="  h-[180px] w-[320px] p-3 bg-gradient-to-r from-[#dfc6c6] to-[#6d5ec2] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={cancelledIcone} height={30} width={30} alt="cancelled-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Cancelled Order (Monthly)</h1>
                    </div>
                       <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : {currCancelledOrder} Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : {prevCancelledOrder} Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currCancelledOrder>prevCancelledOrder?'text-green-500':'text-red-500'}`}>Growth : {cancelledOrderGrowth} %</h1>
                        </div>
                    </div>
                </div>


                 <div data-aos='fade-up' className="  h-[180px] w-[320px] p-3 bg-gradient-to-r from-[#dfc6c6] to-[#FF69B4] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                     <div className="flex items-center justify-center gap-1">
                        <Image src={pendingIcone} height={30} width={30} alt="pending-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Paid Order (Monthly)</h1>
                    </div>
                         <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : {currentPaidOrder} Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : {prevPaidOrder} Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currentPaidOrder>prevPaidOrder?'text-green-500':'text-red-500'}`}>Growth : {paidOrderGrowth} %</h1>
                        </div>
                    </div>
                </div>

                <div  data-aos='fade-up' className="  h-[180px] w-[320px] p-3 bg-gradient-to-r from-[#dfc6c6] to-[#71da8b] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={confIcone} height={30} width={30} alt="shipped-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">COD Order (Monthly)</h1>
                    </div>
                        <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : {currentCodOrder} Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : {prevCodOrder} Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currentCodOrder>prevCodOrder?'text-green-600':'text-red-600'}`}>Growth : {codOrderGrowth} %</h1>
                        </div>
                    </div>
 
            </div>
        </div>
             <div className="flex justify-center mt-[20px]">
                          <div  data-aos='fade-up' className="  h-[180px] w-[320px] p-3 bg-gradient-to-r from-[#dfc6c6] to-[#82ce95] shadow-[8px_8px_16px_#0a0a0a, -8px_-8px_-16px_#1a1a1a] rounded-xl">
                      <div className="flex items-center justify-center gap-1">
                        <Image src={shippedIcone} height={30} width={30} alt="shipped-order-Icone"/>
                        <h1 className="grid text-center text-xl font-semibold">Return Order (Monthly)</h1>
                    </div>
                         <div className="grid grid-cols-1 gap-3 mt-[15px] ">
                        <div className="flex items-center gap-1">
                            <Image src={presentIcon} height={25} width={25} alt="present-icone"/>
                            <h1>Present : {currentReturnOrder} Orders  </h1>
                        </div>
                          <div className="flex items-center gap-1">
                            <Image src={previousIcone} height={25} width={25} alt="previous-icone"/>
                             <h1>Previous : {prevReturnOrder} Orders</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <Image src={growthIcon} height={25} width={25} alt="growth-icone"/>
                            <h1 className={`font-semibold ${currentReturnOrder>prevReturnOrder?'text-green-600':'text-red-600'}`}>Growth : {returnOrderGrwoth} %</h1>
                        </div>
                    </div>
                </div>

                    </div>
        </div>
    )
}