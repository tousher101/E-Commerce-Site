import Image from "next/image"
import paymentIcon from '../public/invoice.png'
import orderIcone from '../public/document.png'
import customerIcon from '../public/business-card.png'
import NoImage from '../public/noimage.png'

export default function orderCard({photo,orderId, amount, orderStatus, paymentStatus, paymentMethod, paymentCreate, userName, userEmail, userPhone, mode, trxId, orderCreate, goDetails}){
    return(
        <div className=" overflow-hidden my-[10px] mx-[10px] rounded-xl shadow-sm flex items-center justify-evenly text-sm ">
             <Image src={photo||NoImage} height={70} width={100} className="h-[70px] w-[100px] rounded-sm" alt="Product-photo"/>
             <div className="grid grid-cols-1 items-center p-2">
                <div className="flex items-center gap-1">
                <Image src={orderIcone} height={20} width={20} alt="order-icon"/>
                <h1 className="font-semibold">Order Details</h1>
                </div>
                <h1>Order Id : {orderId}</h1>
                <h2 >Order Amount: ₱ {amount}</h2>
                <h2>Order Status : {orderStatus}</h2>
                <h2>Order Create : {new Date(orderCreate).toDateString()}</h2>
             </div>

             <div className="grid grid-cols-1 items-center p-2">
                <div className="flex items-center gap-1">
                <Image src={paymentIcon} height={20} width={20} alt="payment-icon"/>
                <h1 className="font-semibold">Payment Details</h1>
                </div>
                
                <h2>Payment Status : {paymentStatus}</h2>
                {mode==='PAID'&&<h2>TrxId : {trxId} </h2>}
                
                <h2>Payment Method : {paymentMethod}</h2>
                <h2>Created At : {new Date(paymentCreate).toDateString() || <h1>N/A</h1>} </h2>
             </div>
               <div className="grid grid-cols-1 items-center p-2">
                <div className="flex items-center gap-1">
                <Image src={customerIcon} height={20} width={20} alt="customer-icon"/>
                <h1 className="font-semibold">Order By</h1>
                </div>
                <h2> Name : {userName} </h2>
                <h2> Email : {userEmail} </h2>
                <h2> Phone : {userPhone}</h2>
             </div>
             <div className="flex">
                <button onClick={goDetails} className="h-[40px] w-[90px] bg-blue-500 rounded-xl cursor-pointer text-white hover:bg-gray-600 duration-500">Details</button>
             </div>
             
        </div>
        
    )
}