export default function addAddress({cancel, provinces, cities, citiesOnCh, barangay,provinceValue,provinceOnCh,citiesValue, barangayValue, barangayOnCh,
    labelValue,labelOnCh,nameValue,nameOnCh,phoneValue,phoneOnCh,line1Value,line1OnCh,postalCodeValue,postalCodeOnCh, submitAddress
}){
    return(
        <div data-aos='fade-left' className="  overflow-hidden border-1 border-gray-400 rounded-xl w-[600px]  my-[15px]">
            <div className="grid grid-cols-1 gap-2 p-2 justify-center">
                <select value={labelValue} onChange={labelOnCh} className="p-2 rounded-xl border-1 border-gray-400">
                    <option value=''>Select Lebel</option>
                    <option value='Home'>Home</option>
                    <option value='Office'>Office</option>
                    <option value='Others'>Others</option>
                </select>
                <input value={nameValue} onChange={nameOnCh} className="p-2 rounded-xl border-1 border-gray-400" type="text" placeholder="Name"></input>
                <input value={phoneValue} onChange={phoneOnCh} className="p-2 rounded-xl border-1 border-gray-400" type="text" placeholder="Phone"></input>
                <input value={line1Value} onChange={line1OnCh} className="p-2 rounded-xl border-1 border-gray-400" type="text" placeholder="Line-1"></input>

                <select value={provinceValue} onChange={provinceOnCh} className="p-2 rounded-xl border-1 border-gray-400">
                    <option>Select Province</option>
                    {provinces?.map((p)=>(
                             <option  key={p.code} value={p.code}>{p.name}</option>
                    ))}
                </select>

                  <select value={citiesValue} onChange={citiesOnCh} className="p-2 rounded-xl border-1 border-gray-400">
                    <option>Select Select City</option>
                    {cities?.map((c)=>(
                        <option key={c.code}  value={c.code}>{c.name}</option>
                    ))}
                 
                </select>

                    <select value={barangayValue} onChange={barangayOnCh}   className="p-2 rounded-xl border-1 border-gray-400">
                    <option>Select Barangay City</option>
                    {barangay?.map((b)=>(
                        <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                </select>

                <input value={postalCodeValue} onChange={postalCodeOnCh} className="p-2 rounded-xl border-1 border-gray-400" type="number" placeholder="Postal Code"></input>

                <button onClick={submitAddress} className="p-2 bg-blue-600 rounded-xl text-white cursor-pointer">Add Address</button>
                <button onClick={cancel} className="p-2 bg-red-600 rounded-xl text-white cursor-pointer">Cancel</button>

                

            </div>

        </div>
    )
}