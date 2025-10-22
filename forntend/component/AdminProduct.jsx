import Image from "next/image"
import NoImage from '../public/noimage.png'
export default function adminProduct({photos, name, description, price, stock, size, variant, color, weight, update,create}){
    return(
        <div className="max-w-[1380px] overflow-hidden  mx-[10px] rounded-xl shadow-sm flex items-center justify-evenly my-[30px] p-1">
            <div className="h-[90px] w-[150px] rounded-xl">
                     <Image src={photos||NoImage} height={90} width={150} priority className="rounded-xl w-full h-full object-cover"  alt="product-photo"/>
            </div>
            
             <div className="grid grid-cols-1 items-center p-2 text-[13px] ">
                <h1 className="font-semibold">{name}</h1>
                <h2 className="text-[12px]" >{description}</h2>
                <h2 className="font-semibold">₱{price}</h2>
                <h2>Stock : {stock}</h2>
             </div>

             <div className="grid grid-cols-1 items-center p-2 text-[13px]">
                <h2>Size : {size}</h2>
                <h2>Color : {color} </h2>
                <h2> Variant : {variant} </h2>
                <h2> weight : {weight}</h2>
             </div>
               <div className="grid grid-cols-1 items-center p-2 text-[13px]">
                <h2>Create :{new Date(create).toDateString()} </h2>
                <h2> Update: {new Date(update).toDateString()}</h2>
             </div>
             <div className="flex justify-center items-center gap-3">
                <button className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/edit.gif"/></button>
                <button className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/bin.gif"/></button>
             </div>
           
             
        </div>
    )
}