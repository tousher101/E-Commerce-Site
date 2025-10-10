import OrderCard from '../../../component/OrderCard'

export default function orderRequest(){
    const orderId=1;
    
    return(
        <div className="max-w-[1380px] mx-auto overflow-hidden">
            <h1 className="text-center text-gray-500 my-[20px] text-2xl font-semibold">Order Request ()</h1>
            <div className='grid grid-cols-1 gap-1.5 items-center'>
                <OrderCard orderId={orderId}/>
                <OrderCard orderId={orderId}/>
                <OrderCard/>
            

            </div>
            

        </div>
    )
}