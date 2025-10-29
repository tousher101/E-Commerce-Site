export default function addressCard({label, name, phone, line1,barangay,city,province,postalCode}){
    return(
        <div className="mx-auto overflow-hidden w-full shadow-sm rounded-xl mb-[15px]">
            <div className=" grid grid-cols-1 justify-items-start p-2 text-sm">
                <h1 className="p-1 bg-blue-400 rounded-sm  text-white mb-[10px]">{label}</h1>
                <h1>{name}</h1>
                <h1>{phone}</h1>
                <h1>{line1}</h1>
                <div className="flex justify-center gap-2">
                    <h1>{barangay},</h1>
                    <h1>{city}-</h1>
                    <h1>{postalCode}</h1> 
                </div>
                <h1>{province}</h1>

            </div>
            
        </div>
    )
}