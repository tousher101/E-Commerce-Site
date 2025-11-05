"use client"
import { useState } from 'react'
import DeleteModal from '../../../component/DeleteModal'
import EditModal from '../../../component/EditModal'
import {fetchWithAuth} from '../../../Utils/fetchWithAuth'
import Alert from '../../../Utils/Alert'
import AOS from 'aos';
import 'aos/dist/aos.css'

export default function manageShippingFee(){

    const [editModal,setEditModal]=useState(false);
    const [deleteModal,setDeleteModal]=useState(false);
    const [animatedModal,setAnimatedModal]=useState(false);
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [location, setLocation]=useState('');
    const [baseFee, setBaseFee]=useState('');
    const [perKgFee, setPerKgFee]=useState('');
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [shippingData,setShippingData]=useState([]);
    const [shippingRateId, setShippingRateId]=useState(null)
    const [selectedShippingFee, setSelectedShippingFee]=useState(null)


    const openEditModal=()=>{
        setEditModal(true);
        setTimeout(()=>{
    setAnimatedModal(true)
      },10)
    };
    const closeEditModal=()=>{
             setEditModal(false);
        setTimeout(()=>{
    setAnimatedModal(false)
      },10)
    };

    const openDeleteModal=()=>{
        setDeleteModal(true)
        setTimeout(()=>{
    setAnimatedModal(true)
      },10)
    };
    const closeDeleteModal=()=>{
        setDeleteModal(false)
        setTimeout(()=>{
    setAnimatedModal(false)
      },10)
    };

    const addShippingFee=async()=>{
      console.log(BaseURI)
        const res= await fetchWithAuth(`${BaseURI}/api/admin/addshippingrate`,{
            method:"POST",
            body: JSON.stringify({location,
                baseFee:parseFloat(baseFee),
                perKgFee:parseFloat(perKgFee)})
        });
        getAllShippingFee();
      setMsg(res.msg);
      setType('Success');
      setLocation('');
      setBaseFee('');
      setPerKgFee('');
    };

        const getAllShippingFee=async()=>{
            const res= await fetchWithAuth(`${BaseURI}/api/admin/getshippingfee`)
            setShippingData(res.rate)
        };
    useState(()=>{
        getAllShippingFee()
         AOS.init({
            duration:1000,once:false,mirror:false
          });
          AOS.refresh();
        
    },[])

    const deleteShippingRate=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/deleteshippingfeerate/${id}`,{
            method:'DELETE'
        });
         getAllShippingFee();
        setDeleteModal(false);
        setMsg(res.msg);
        setType('Success');
    };


    const editShippingRate=async(id)=>{
        const res= await fetchWithAuth(`${BaseURI}/api/admin/editshippingfeerate/${id}`,{
            method:'PUT',
            body:JSON.stringify({location:selectedShippingFee.location, baseFee:parseFloat(selectedShippingFee.baseFee), perKgFee:parseFloat(selectedShippingFee.perKgFee)})
        });
       
        getAllShippingFee();
        setEditModal(false);
        setMsg(res.msg);
        setType('Success')
        
    };
 




    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className=" mx-auto overflow-hidden">
            <h1 className="text-center lg:text-3xl text-2xl font-semibold text-gray-400 my-[30px]">Manage Shipping Fee Rate</h1>
            <div data-aos='fade-up' className="grid grid-cols-1 gap-2 ">
                <input value={location} onChange={(e)=>{setLocation(e.target.value)}} className="border-1 border-gray-300 p-2 rounded-xl" type="text" placeholder="Zone Name"/>
                <div className=" lg:flex md:flex grid grid-cols-1 w-full gap-5 justify-center">
                    <input value={baseFee} onChange={(e)=>{setBaseFee(e.target.value)}} className="border-1 border-gray-300 p-2 rounded-xl"  type="text" placeholder="Base Fee"/>
                    <input value={perKgFee} onChange={(e)=>{setPerKgFee(e.target.value)}} className="border-1 border-gray-300 p-2 rounded-xl"  type="text" placeholder="Per Kg Fee"/>
                </div>
               <button onClick={()=>{addShippingFee()}} className="p-2 text-white rounded-2xl bg-blue-400 my-[15px] cursor-pointer">Add Shipping Fee</button>
            </div>

            <h1 className="text-center text-2xl text-gray-400 mt-[20px]">Current Shipping Fee Rate</h1>
                <div data-aos='fade-up' className='grid grid-cols-1 gap-1'>
                {shippingData.map((rate)=>(
                        <div  key={rate.id} onClick={()=>{setShippingRateId(rate.id), setSelectedShippingFee(rate)}}  className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 justify-items-center items-center border-1 border-gray-400 rounded-xl p-2 my-[5px]">
                            <div className=' flex justify-items-center items-center'>
                                <h1>{rate.location}</h1>
                            </div>
                            <div className='flex items-center justify-items-center'>
                                <h1>Base Fee : {rate.baseFee}</h1>
                            </div>
                            <div className='flex justify-items-center items-center'>
                                <h1>Per Kg Fee : {rate.perKgFee}</h1>
                            </div>

                
                <div className="flex gap-2.5 items-center">
                <button onClick={openEditModal} className="border-1 border-gray-300 p-2 rounded-xl cursor-pointer hover:" ><img className="h-[35px] w-[30px]" src="/edit.gif"/></button>
                <button onClick={openDeleteModal} className="border-1 border-gray-300 p-2 rounded-xl cursor-pointer" ><img className="h-[35px] w-[30px]" src="/bin.gif"/></button>
                </div>
                </div>
                ))}

                </div>
              

           
        </div>
        {selectedShippingFee&&editModal&&<EditModal design={animatedModal} closeModal={closeEditModal} zoneValue={selectedShippingFee.location} baseFeeValue={selectedShippingFee.baseFee}
        perKgFeeValue={selectedShippingFee.perKgFee} zoneValueOnCha={(e)=>{setSelectedShippingFee({...selectedShippingFee, location:e.target.value})}}  baseFeeValueOnCha={(e)=>{setSelectedShippingFee({...selectedShippingFee, baseFee:e.target.value})}}
        perKgFeeValueOnCha={(e)=>{setSelectedShippingFee({...selectedShippingFee, perKgFee:e.target.value})}} submitEdit={()=>{editShippingRate(shippingRateId)}}/>}
        {deleteModal&&<DeleteModal design={animatedModal} closeModal={closeDeleteModal} submitDelete={()=>{deleteShippingRate(shippingRateId)}} />}
        </>
    )
}