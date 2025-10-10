import Image from "next/image"
import testPhoto from '../public/glass.jpg'
import paymentIcon from '../public/invoice.png'
import orderIcone from '../public/document.png'
import customerIcon from '../public/business-card.png'
import Link from "next/link"

export default function orderCard({orderId}){
    return(
        <div className="max-w-[1380px] overflow-hidden my-[10px] mx-[10px] rounded-xl shadow-sm flex items-center justify-evenly ">
             <Image src={testPhoto} height={70} width={100} alt="Product-photo"/>
             <div className="grid grid-cols-1 items-center p-2">
                <div className="flex items-center gap-1">
                <Image src={orderIcone} height={20} width={20} alt="order-icon"/>
                <h1 className="font-semibold">Order Details</h1>
                </div>
                <h1>Order Id:</h1>
                <h2 >Order Amount: ₱</h2>
                <h2>Order Status:</h2>
             </div>

             <div className="grid grid-cols-1 items-center p-2">
                <div className="flex items-center gap-1">
                <Image src={paymentIcon} height={20} width={20} alt="payment-icon"/>
                <h1 className="font-semibold">Payment Details</h1>
                </div>
                
                <h2>Payment Status:</h2>
                <h2>Payment Method:</h2>
                <h2>Created At:</h2>
             </div>
               <div className="grid grid-cols-1 items-center p-2">
                <div className="flex items-center gap-1">
                <Image src={customerIcon} height={20} width={20} alt="customer-icon"/>
                <h1 className="font-semibold">Order By</h1>
                </div>
                <h2> Name:</h2>
                <h2> Email:</h2>
                <h2> Phone:</h2>
             </div>
             <div className="flex">
                <Link href={`orderrequest/${orderId}`}><button className="h-[40px] w-[120px] bg-blue-500 rounded-xl cursor-pointer text-white hover:bg-gray-600 duration-500">Details</button></Link>
             </div>
             
        </div>
        
    )
}