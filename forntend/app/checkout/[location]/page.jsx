"use client"
import ProductSummary from "../../../component/ProductSummary"
import AddressCard from "../../../component/AddressCard"
import AddAddress from "../../../component/AddAddress"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchWithAuth } from '../../../Utils/fetchWithAuth'
import PaymentSummary from "../../../component/paymentSummary"
import Alert from "../../../Utils/Alert"
import { useRouter } from "next/navigation"
import { useUserInfo } from "../../../context/userInfo"
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function checkOut() {
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [addAddress, setAddAddress]=useState(false);
    const [provinces, setProvinces]=useState([]);
    const [selectedProvince, setSelectedProvince]=useState('');
    const [selectedCities, setSelectedCities]=useState('');
    const [selectedBarangay, setSelectedBarangay]=useState('');
    const [selectedProvinceName, setSelectedProvinceName]=useState('')
    const [selectedCityName, setSelectedCityName]=useState('')
    const [selectedBarangayName, setSelectedBarangayName]=useState('')
    const [cities, setCities]=useState([]);
    const [barangays, setBarangays]=useState([]);
    const [checkOutData, setCheckOutDate]=useState([]);
    const [addressData, setAddressData]=useState([]);
    const [mode, setMode]=useState(null);
    const [label,setLabel]=useState('');
    const [name, setName]=useState('');
    const [phone,setPhone]=useState('')
    const [line1, setLine1]=useState('');
    const [postalCode, setPostalCode]=useState('');
    const [msg, setMsg]=useState(null);
    const [type,setType]=useState(null);
    const [selectedAddressId, setSelectedAddressId]=useState(null);
    const params=useParams();
    const {location}=params;
    const router=useRouter();
    const {getCartItems,getTotalCartItems}=useUserInfo();


    

    const addShippingAddress=async()=>{
        const res=await fetchWithAuth(`${BaseURI}/api/user/addaddress`,{
            method:"POST",
            body:JSON.stringify({province:selectedProvinceName,barangay:selectedBarangayName, city:selectedCityName, 
                label,name,phone,line1,postalCode
            })
        });
        getAllAddress();
        setLabel('');setName('');setPhone('');setProvinces('');setCities('');setBarangays('');setLine1('');setPostalCode('');setAddAddress(false);
        setMsg(res.msg);
        setType('Success');
    };

    const submitCODOrder=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/checkout`,{
            method:'POST',
            body:JSON.stringify({location,addressId:selectedAddressId})
        })
        
        setMsg(res.msg);
        setType('Success');
        getCartItems();
        getTotalCartItems();
        setTimeout(()=>{
            router.push('/')
        },3000)
    };

    const submitPaidOrder=async()=>{
        const res=await fetchWithAuth(`${BaseURI}/api/payment/create-checkout-session`,{
            method:'POST',
            body:JSON.stringify({location, addressId:selectedAddressId})
        });
        if(res.url){window.location.href=res.url}
    }

    const provinceOnChange=(e)=>{
       const code= e.target.value
       const selected=provinces.find((p)=>p.code===code)
        setSelectedProvince(code)
        setSelectedProvinceName(selected?.name)
    };
    const cityOnChange=(e)=>{
        const code=e.target.value;
        const selected= cities.find((c)=>c.code===code)
        setSelectedCities(code);
        setSelectedCityName(selected?.name);
    };

        const barangayOnChange=(e)=>{
      const code=e.target.value;
      const selected=barangays.find((b)=>b.code===code)
        setSelectedBarangay(code);
        setSelectedBarangayName(selected?.name);
    };


    const getProvinces=async()=>{
        const res= await fetch(`https://psgc.gitlab.io/api/provinces`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const data= await res.json();
        if(res.ok){setProvinces(data)}
    };

    const getCities=async()=>{
        const res= await fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities`,{
            method:'GET',
              headers:{
                'Content-Type':'application/json'
            }
            });
            const data= await res.json();
            if(res.ok){setCities(data)}
    };

    const getBarangay=async()=>{
        const res= await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCities}/barangays`,{
            method:'GET',
              headers:{
                'Content-Type':'application/json'
            }
            });
            const data= await res.json();
            if(res.ok){setBarangays(data)}
    };


    const getCheckOutdata=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/checkoutpreview/${location}`)
        setCheckOutDate(res);
        setMode(res.mode);
        
    };

    const getAllAddress=async()=>{
        const res= await fetchWithAuth(`${BaseURI}/api/user/getalladdress`)
        setAddressData(res.address)
    };

    useEffect(()=>{
          AOS.init({
                    duration:1000,once:false,mirror:false
                  });
                  AOS.refresh();
        
        getProvinces();
        getCities();
        getBarangay();
       getCheckOutdata();
       getAllAddress();
    },[selectedProvince, selectedCities, selectedBarangay]);


return(
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <div className="flex mx-auto overflow-hidden">
        <div className=" flex-[70%] justify-center my-[25px]">
            <div className="grid grid-cols-1 justify-items-center">
                 <h1 className="  text-3xl text-gray-400 font-semibold">Order Summary</h1>
                 {checkOutData?.items?.items?.map((item, index)=>(
                <div key={index}>
                <ProductSummary photo={item?.product?.photos[0]?.url} name={item?.product?.name} price={item?.product?.price} size={item?.size} quantity={item?.quantity} color={item?.color} variant={item?.variant} mode={mode}/>
            </div>
                 ))}
          

            </div>

            <div className=" mx-[10px]">
                <h1 className=" text-center text-xl text-gray-400 font-semibold mb-[15px]">Shipping Address</h1>
                <p className="font-semibold text-xs text-gray-500 text-center mb-[15px]">Note: Please Make Sure! Your Selected Shipping Area & Your Shipping Address Is Same Area!</p>
                
                <div className=" grid grid-cols-3 gap-3 w-full">
                    {addressData?.map((add)=>(
                        <label key={add?.id} htmlFor={`address-${add.id}`} className={`cursor-pointer block mb-[25px] border-1 rounded-md ${selectedAddressId===add.id?'border-blue-500 bg-blue-50 border-2': 'border-gray-400'}`}>
                             <input type="radio" name="address" value={add?.id} checked={selectedAddressId===add?.id} onChange={()=>{setSelectedAddressId(add?.id)}} id={`address-${add.id}`} className=" h-[20px] w-[20px] hidden"/>
                            <AddressCard name={add?.name} phone={add?.phone} line1={add.line1} barangay={add?.barangay} city={add?.city} province={add?.province} postalCode={add?.postalCode} label={add?.label}/>
                        </label>
                       
                    ))}
                    
                   
                </div>

            </div>
            <div className="flex justify-center mx-[10px]">
                <button onClick={()=>{setAddAddress(true)}} className="p-2 bg-blue-600 rounded-xl text-white cursor-pointer">+Add New Address</button>
            </div>
            {addAddress&&<AddAddress cancel={()=>{setAddAddress(false)}} provinces={provinces} cities={cities} barangay={barangays} provinceValue={selectedProvince} provinceOnCh={provinceOnChange}
            citiesValue={selectedCities} citiesOnCh={cityOnChange} barangayValue={selectedBarangay} barangayOnCh={barangayOnChange} labelValue={label} labelOnCh={(e)=>{setLabel(e.target.value)}}
            nameValue={name} nameOnCh={(e)=>{setName(e.target.value)}} phoneValue={phone} phoneOnCh={(e)=>{setPhone(e.target.value)}}
            line1Value={line1} line1OnCh={(e)=>{setLine1(e.target.value)}} postlCodeValue={postalCode} postalCodeOnCh={(e)=>{setPostalCode(e.target.value)}} submitAddress={addShippingAddress}/>}
            

        </div>

        <div className=" flex-[30%] shadow-sm h-[450px] rounded-xl">
            <div className=" my-[15px]">
                <h1 className=" text-center  text-xl text-gray-400 font-semibold">Payment Summary</h1>
                <div>
                    <PaymentSummary checkOut={checkOutData?.items} subTotal={checkOutData?.itemPrice} referralBonus={checkOutData?.bonus} subtotal={checkOutData?.subtotal}
                    shippingFee={checkOutData?.shippingFee} paymentAmount={checkOutData?.total}/>
                </div>
            </div>
            

        </div>
    </div>
           <div className="flex mx-[10px] justify-center gap-6 my-[30px] mb-[50px]">
            <button onClick={submitCODOrder} className="border-1 bg-blue-500 rounded-sm cursor-pointer p-2 text-white">COD Order</button>
            <button onClick={submitPaidOrder} className="border-1 bg-green-500 rounded-sm cursor-pointer p-2 text-white">Payment</button>
        </div>
        </>
)
}