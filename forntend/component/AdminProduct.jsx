
import Image from "next/image"
import NoImage from '../public/noimage.png'
export default function adminProduct({productPhotos, productName, productDescription, productPrice, productStock, productSize, productVariant, productColor, productWeight, update,create, productId,
   productOriginalPrice,openEditModal,openDeleteModal
}){
      

   return(
      <>
        <div className=" overflow-hidden  mx-[10px]  rounded-xl shadow-sm lg:flex justify-items-center-safe grid grid-cols-1   items-center lg:justify-evenly my-[30px] p-2">
            <div className="h-[90px] w-[150px] rounded-xl">
                     <Image src={productPhotos||NoImage} height={90} width={150} priority className="rounded-xl w-full h-full object-cover"  alt="product-photo"/>
            </div>
            
             <div className="grid grid-cols-1 items-center p-2 text-[13px] ">
                <h1 className="font-semibold">{productName}</h1>
                <h2 className="text-[12px]" >{productDescription}</h2>
                <h2 className="font-semibold">₱{productPrice}</h2>
                <h2>Stock : {productStock}</h2>
             </div>

             <div className="grid grid-cols-1 items-center p-2 text-[13px]">
               <h1 className="flex gap-2">Size : {productSize.map((pro,i)=>(<span key={i}>{pro}</span>))}</h1>
                <h1 className="flex gap-2">Color : {productColor.map((col,i)=>(<span key={i}>{col}</span>))} </h1>
                <h1 className="flex gap-2"> Variant : {productVariant.map((ver,i)=>(<span key={i}>{ver}</span>))} </h1>
                <h2> weight : {productWeight}</h2>
             </div>
               <div className="grid grid-cols-1 items-center p-2 text-[13px]">
                  <h2 className="font-semibold ">Original Price : <span className="line-through">₱{productOriginalPrice}</span></h2>
                <h2>Create :{new Date(create).toDateString()} </h2>
                <h2> Update: {new Date(update).toDateString()}</h2>
             </div>
             <div className="flex justify-center items-center gap-3 mb-[5px]">
                <button onClick={openEditModal} className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/edit.gif"/></button>
                <button onClick={openDeleteModal} className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/bin.gif"/></button>
             </div>
           
             
        </div>
     
        </>
    )
}