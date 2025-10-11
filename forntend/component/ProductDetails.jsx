import Slider from '../Utils/Slider'
import ProductSummary from '../component/ProductSummary'



export default function productDetails(){
    return(
         <div className='max-w-[1380px] mx-auto grid grid-cols-1'>
      <div className="my-[50px]">
         <Slider/>
      </div>
     
      <div className="grid grid-cols-1 bg-[#FBF5DF] mx-[10px] p-[10px] rounded-2xl shadow-md">
        <div className="flex items-center justify-center">
         <img className='h-[40px] w-[40px] mr-[5px]' src='/product.gif'/>
          <p className=" text-2xl font-semibold">Product Summary</p>
        </div>
        <div className="grid grid-cols-1 ">
          <ProductSummary/>
        </div>
      </div>


      <div className="grid grid-cols-1 mt-[20px] mx-[10px] p-[10px] shadow-md rounded-2xl bg-[#FBF5DF] ">
        <div className="flex justify-center items-center">
        <img className="w-[40px] h-[40px] mr-[5px]" src='/shopping-list.gif' />
        <p className="text-2xl font-semibold">Order Information</p>
        </div>
        <div className="grid grid-cols-1 justify-items-start"> 
        <p>Booking Id: </p>
        <p>CheckIn Date: </p>
        <p>CheckOut Date: </p>
        <p className=" font-bold">Status:</p>
        </div>
      </div>
      
      
      <div className="grid grid-cols-1 bg-[#FBF5DF] mx-[10px] p-[10px] rounded-2xl shadow-md my-[20px]   ">
        <div className="flex justify-center items-center">
          <img className="w-[40px] h-[40px] mr-[5px]"  src='/checklist.gif'/>
           <p className="text-2xl font-semibold">Payment Information</p>
        </div>
       <div className="grid grid-cols-1 justify-items-start">
        <p>Payment Id:</p>
        <p className="font-bold">Total Amount:  <span className="text-[11px] font-normal">(Including Extra-Services & Tax)</span></p>
        <p className="font-bold">Payment Status: </p>
        <p>Payment By: </p>
        <p>Payment Created: </p>
        </div>
      </div>
      <div>
      </div>
     <div className="flex items-center justify-center mb-[15px]">
        <button  className="ml-[15px] h-[35px] w-[120px] rounded-xl bg-green-500 cursor-pointer mr-[15px] ">Approved</button>
        <button className="h-[35px] w-[120px] rounded-xl bg-red-500 cursor-pointer ">Cancel</button>
      </div>
     
      
    

    </div>
    )
}