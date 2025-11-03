export default function paymentSummary({checkOut,subTotal,referralBonus, subtotal, shippingFee, paymentAmount}){
    return(
        <div  className="w-auto overflow-hidden mx-[10px] mt-[25px]">
            <div data-aos='slide-up' className=" grid grid-cols-1 gap-3">
                    <h1 className="font-bold">Items:</h1>
                    <div className="grid grid-cols-1  w-full  gap-2">
                    {checkOut?.items?.map((item, index)=>(
                        <div key={index} className="flex justify-between text-xs   gap-2">
                        <p>{item?.product?.name}</p>
                        <div className="flex justify-between gap-4">
                      <p>({item?.product?.price} x {item.quantity}) </p>
                        <p>=</p>
                        <p> ₱{item?.product?.price*item.quantity} </p>
                        </div>
                    </div>
                    ))}
                </div>
                    <div className="flex justify-between font-bold gap-1">
                    <h1> Items Price :</h1>
                    <h1>₱{subTotal}</h1>
                </div>
                  <div className="flex justify-between gap-1">
                    <h1>(-) Referral Bonus :</h1>
                    <h1>₱{referralBonus}</h1>
                </div>
                  <div className="flex justify-between gap-1 font-bold">
                    <h1>Sub-Total :</h1>
                    <h1>₱{subtotal}</h1>
                </div>
                  <div className="flex justify-between gap-1">
                    <h1>(+) Shipping Fee : </h1>
                    <h1>₱{shippingFee}</h1>
                </div>
                    <div className="flex justify-between font-bold">
                    <h1>Payment Amount : </h1>
                    <h1>₱{paymentAmount}</h1>
                </div>
                
                
             
            </div>

        </div>
    )
}