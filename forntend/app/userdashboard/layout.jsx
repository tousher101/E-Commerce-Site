import Link from "next/link"
export default function layout({children}){
    return(
        <div>
             <div className="max-w-[1380px] mx-[10px] overflow-hidden mb-[80px]">
            <div className="flex gap-3">
            <div className="flex flex-[20%] shadow-xl h-[500px] rounded-xl ">
                <div className="grid grid-cols-1 gap-2 p-3">
                    <div className="flex items-center gap-1">
                        <img className="w-[40px] h-[40px]" src="/task-management.gif"/>
                        <h1 className="  text-center text-xl font-semibold mb-[10px]">Manage Order</h1>
                    </div>
                
                    <div className="flex items-center  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/home.gif"/>
                        <Link href={'/userdashboard'}><h1 className="p-2 rounded-xl cursor-pointer ">Home</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/rfp.gif"/>
                         <Link href={'/userdashboard/pendingorder'}><h1 className="p-2 ">Pending Order</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/hand-paper-check.gif"/>
                        <Link href={'/userdashboard/confirmedorder'}><h1 className="p-2">Confirmed Order</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/warehouse.gif"/>
                        <Link href={'/userdashboard/shippedorder'}><h1 className="p-2">Shipped Order</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/shippe.gif"/>
                        <Link href={'/userdashboard/deliveredorder'}><h1 className="p-2 ">Delivered Order</h1></Link>
                    </div>

                     <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/delivery.gif"/>
                        <Link href={'/userdashboard/cancelledorder'}><h1 className="p-2">Cancel Order</h1></Link>
                    </div>

                    <div className="flex items-center gap-1  hover:bg-blue-500 hover:text-white duration-500 p-1 rounded-xl">
                        <img className="w-[30px] h-[30px]" src="/receipt.gif"/>
                        <Link href={'/userdashboard/paidorder'}><h1 className="p-2">Paid Order</h1></Link>
                    </div>

                </div>
            </div>
            <div className="flex-[80%]  justify-center shadow-xl">
                {children}
                    </div>
               
            </div>
              
        </div>      
        </div>
    )
}