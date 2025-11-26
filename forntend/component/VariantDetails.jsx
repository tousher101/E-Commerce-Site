export default function variantDetails({price, origianlPrice,size,color,variant,submitDelete,openModal}){
    return(
        <div className="w-full overflow-hidden flex justify-around rounded-sm border-1 border-gray-400 p-3">
            <div className="grid grid-cols-1 gap-2">
                <h1>Price: {price||0}</h1>
                <h1 className="line-through">Origianl Price : {origianlPrice||'0'}</h1>
            </div>
               <div className="grid grid-cols-1 gap-2">
                <h1>Size : {size||'N/A'}</h1>
                <h1>Color: {color||'N/A'}</h1>
            </div>
              <div className="grid grid-cols-1 gap-2">
                <h1>Variant : {variant||'N/A'}</h1>
            </div>
              <div className="flex justify-center gap-2">
                <button onClick={openModal}  className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/edit.gif"/></button>
                <button onClick={submitDelete}  className="border-1 border-gray-400 rounded-xl cursor-pointer p-2"><img className="w-[30px] h-[30px]" src="/bin.gif"/></button>
            </div>
        </div>
    )
}