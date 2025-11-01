

export default function userDashBoardCard({pendingOrder, confirmedOrder,shippedOrder,deliveredOrder,cancelledOrder,paidOrder}){
    return(
        <div className=" mx-[10px] overflow-hidden mb-[50px]">
            <div  className="grid grid-cols-3 gap-3">
                <div data-aos='fade-left' className="p-3 text-xl  font-semibold gap-1 grid justify-items-center h-[140px] border-1 border-gray-400 rounded-xl">
                    <img className="h-[50px] w-[50px]" src="/file.gif" alt="card-photo"/>
                    <h1>Pending Order</h1>
                    <h2>({pendingOrder})</h2>
                </div>
                <div data-aos='flip-left' className=" text-xl  font-semibold gap-1 grid justify-items-center border-1 border-gray-400 p-3 h-[140px]  rounded-xl">
                   <img className="h-[50px] w-[50px]" src="/document.gif" alt="card-photo"/>
                   <h1>Confirmed Order</h1>
                    <h2>({confirmedOrder})</h2>
                </div>
                    <div data-aos='flip-left' className=" text-xl  font-semibold gap-1 grid justify-items-center border-1 border-gray-400 p-3 h-[140px]  rounded-xl">
                   <img className="h-[50px] w-[50px]" src="/ship.gif" alt="card-photo"/>
                   <h1>Shipped Order</h1>
                    <h2>({shippedOrder})</h2>
                </div>

                    <div data-aos='flip-left' className=" text-xl  font-semibold gap-1 grid justify-items-center border-1 border-gray-400 p-3 h-[140px]  rounded-xl">
                   <img className="h-[50px] w-[50px]" src="/route.gif" alt="card-photo"/>
                   <h1>Delivered Order</h1>
                    <h2>({deliveredOrder})</h2>
                </div>
                  <div data-aos='flip-left' className=" text-xl  font-semibold gap-1 grid justify-items-center border-1 border-gray-400 p-3 h-[140px]  rounded-xl">
                   <img className="h-[50px] w-[50px]" src="/receipt.gif" alt="card-photo"/>
                   <h1>Paid Order</h1>
                    <h2>({paidOrder})</h2>
                    </div>
                  <div data-aos='flip-left' className=" text-xl  font-semibold gap-1 grid justify-items-center border-1 border-gray-400 p-3 h-[140px]  rounded-xl">
                   <img className="h-[50px] w-[50px]" src="/file1.gif" alt="card-photo"/>
                   <h1>Cancelled Order</h1>
                    <h2>({cancelledOrder})</h2>
                </div>

                </div>
                    

            </div>

       
    )
}