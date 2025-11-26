
import Image from "next/image"
import NoImage from '../public/noimage.png'
export default function adminProduct({productPhotos, productName, productDescription, productPrice, productStock, productWeight, update,create,
   productOriginalPrice,openEditModal,openDeleteModal, status, submitMakeTopSelling, submitMakePopular, submitClearAll,goVariantEdit,barCode
}){
      

   return(
      < >
      <div className=" overflow-hidden  mx-[10px]  rounded-xl bg-[#FBF5DF] p-2 border-1 border-gray-400 ">
        <div className="  lg:flex justify-items-start grid grid-cols-1  items-center lg:justify-evenly  ">
            <div className="h-[90px] w-[150px] rounded-xl">
                     <Image src={productPhotos||NoImage} height={90} width={150} priority className="rounded-xl w-full h-full object-cover"  alt="product-photo"/>
            </div>
            
             <div className="grid grid-cols-1 items-center p-2 text-[13px] ">
                <h1 className="font-semibold">{productName}</h1>
                <h2 className="text-[12px]" >{productDescription}</h2>
                <h2 className="font-semibold">₱{productPrice}</h2>
                <h2>Stock : {productStock}</h2>
                <h1 className="font-semibold">Status : {status} </h1>
             </div>

             <div className="grid grid-cols-1 items-center p-2 text-[13px]">
               <h2 className="font-semibold ">Original Price : <span className="line-through">₱{productOriginalPrice}</span></h2>
                <h2>Create :{new Date(create).toDateString()} </h2>
                <h2> Update: {new Date(update).toDateString()}</h2>
                <h2> weight : {productWeight}</h2>
                <h2>Barcode : {barCode}</h2>
             </div>
             
             <div className="flex justify-center items-center gap-3 mb-[5px]">
                <button onClick={openEditModal} className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/edit.gif"/></button>
                <button onClick={openDeleteModal} className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/bin.gif"/></button>
                
             </div>

        </div>
            <div className="w-full bg-[#FBF5DF] lg:flex md:flex grid grid-cols-1 justify-items-start justify-center items-center mx-[10px] overflow-hidden gap-2">
         <button onClick={submitMakeTopSelling} className=" h-[35px] w-[140px] rounded-sm cursor-pointer bg-black text-white">Make Top Selling</button>
         <button onClick={submitMakePopular} className=" h-[35px] w-[120px] rounded-sm cursor-pointer bg-black text-white">Make Popular</button>
         <button onClick={goVariantEdit} className="h-[35px] w-[120px] rounded-sm cursor-pointer bg-black text-white">Edit Variant</button>
         <button onClick={submitClearAll} className=" h-[35px] w-[120px] rounded-sm cursor-pointer bg-black text-white">Make Clear</button>

        </div>
        
     </div>
        </>
    )
}