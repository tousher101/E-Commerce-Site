"use client";
import Image from "next/image"
import logo from '../public/logo.png'
import userIcon from '../public/account.png'
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cart from '../component/Cart'
import {useUserInfo} from '../context/userInfo'
import UserInfo from '../component/UserInfo'
import Alert from "../Utils/Alert";
import { fetchWithAuth } from "../Utils/fetchWithAuth";
import CropperModal from "../component/CropperModal";
import Loading from "../Utils/Loading";


export default function navBar() {
  const {userInfo,getAllUser, totalCartItmes,getTotalCartItems,cartData,getCartItems, shippingAreaData,mode}=useUserInfo();
  const [msg, setMsg]=useState(null);
  const [type,setType]=useState(null);
  const [selectedArea, setSelectedArea]=useState('');
  const [searchData, setSearchData]=useState('');
  const [profilePhotoModal,setProfilePhotoModal]=useState(false);
   const [openCartModal, setOpenCartModal]=useState(false);
    const [animatedModal, setAnimatedModal]=useState(false)
    const [userModal, setUserModal]=useState(false);
    const [loading, setLoading]=useState(false);
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
  
  const router=useRouter()

      const goHome=()=>{
        window.location.href=('/')
      };
    
    const goSingIn=()=>{
        // window.location.href=('/signin')
        router.push('/signin')
    };

    const goSearch=()=>{
     
       if (!searchData || searchData.trim() === "") {
      setMsg('Please Input Valid Query'); setType('Error'); return
    };
    
      router.push(`/searchproduct/${searchData}`)
      setSearchData('');

    }
        const goCheckOut=()=>{
          if(!cartData||cartData.length===0){setMsg('Cart Is Empty'); setType('Error'); return}
          if(!selectedArea){setMsg('Please Selecte Shipping Area');setType('Error'); return}
        router.push(`/checkout/${selectedArea}`);
      setSelectedArea('');
       closeModal();
    };

 

    const openUserModal=()=>{
      setUserModal(true)
        setTimeout(()=>{
    setAnimatedModal(true)
      },10)
      
    };

    const closeUserModal=()=>{
      setUserModal(false)
          setTimeout(()=>{
    setAnimatedModal(false)
      },10)
    };

    const openModal=()=>{
      setOpenCartModal(true)
      setTimeout(()=>{
    setAnimatedModal(true)
      },10)
    };

    const closeModal=()=>{
      setOpenCartModal(false)
         setTimeout(()=>{
    setAnimatedModal(false)
      },10)
    };
   
  const uploadProfilePhoto=async(blob)=>{
    const formData= new FormData();
    formData.append('photo',blob);
    setLoading(true);
    const res= await fetchWithAuth(`${BaseURI}/api/user/uploadprofilephoto`,{
      method:'POST',
      body:formData
    });
    setMsg(res.msg);setType('Success'); setProfilePhotoModal(false);getAllUser();setLoading(false);
  }


 
 const logOut=async()=>{
      const res= await fetch(`${BaseURI}/api/auth/logout`,{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type':'application/json'
        }
      });
      const data= await res.json();
      if(res.ok){getAllUser();
      setMsg(data.msg);
      setType('Success'); goHome(); sessionStorage.removeItem('token'); sessionStorage.removeItem('role');setUserModal(false);}
    }

        const deleteCartItems=async(id)=>{
      const res= await fetchWithAuth(`${BaseURI}/api/user/deletecartitem/${id}`,{
        method:'DELETE'
    });
    setMsg(res.msg)
    getCartItems();
    getTotalCartItems();
    };

    useEffect(()=>{
      getCartItems();
      
    },[])


 
    return(
      <>
      {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <nav className=" lg:flex md:flex  grid lg:h-[80px] md:h-[80px] [180px] items-center lg:justify-between md:justify-between justify-items-center  overflow-hidden">
            <div className="lg:h-[80px] lg:w-[120px] md:h-[80px] md:w-[120px] w-full  ml-[10px] flex lg:justify-between md:justify-between justify-around items-center">
            <Link href='/'><Image className="lg:w-[190px] lg:h-[80px] md:w-[190px] md:h-[80px] w-[120px] h-[60px]" src={logo} alt="logo" width={180} height={80} priority /></Link>
            <div  className="flex  justify-around items-center lg:hidden md:hidden ">
                {userInfo?.role==='USER'&&<div onClick={openModal} className="cursor-pointer">
                 <img className="h-[50px] w-[50px]" src="/shopping-cart.gif" alt="shopping-cart"/>
                 <h1 className=" absolute top-3 right-28 bg-red-600 h-[20px] w-[20px] rounded-3xl text-center text-white text-sm ">{totalCartItmes||0}</h1>
                </div>}
              
                <div>
                {userInfo?.role==='USER'||userInfo?.role==='ADMIN'?  <div onClick={openUserModal} className="cursor-pointer mr-[20px] ml-[20px]">
                    <Image className="ml-[10px]" src={userIcon} alt="userIcon" height={30} width={30}/>
                </div>:<button onClick={goSingIn} className="relative inline-flex items-center justify-center h-[30px] w-[60px] mx-[10px] py-2 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group cursor-pointer">
  <span
    className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
  ></span>
  <span className="absolute bottom-0 left-0 h-full -ml-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-auto h-full opacity-100 object-stretch"
      viewBox="0 0 487 487"
    >
      <path
        fillOpacity=".1"
        fillRule="nonzero"
        fill="#FFF"
        d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
      ></path>
    </svg>
  </span>
  <span className="absolute top-0 right-0 w-12 h-full -mr-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="object-cover w-full h-full"
      viewBox="0 0 487 487"
    >
      <path
        fillOpacity=".1"
        fillRule="nonzero"
        fill="#FFF"
        d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
      ></path>
    </svg>
  </span>
  <span
    className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
  ></span>
  <span className="relative text-base font-semibold">Login</span>
</button>}

      </div>
                
      </div>

            </div>
            <div className=" flex items-center gap-3 mt-[10px] ">
              <input value={searchData} onChange={(e)=>{setSearchData(e.target.value)}} className="border border-gray-400 lg:p-[5px] p-1  rounded-xl" type="text" placeholder="Search Product"/>
              <button onClick={goSearch} className="lg:h-[35px] lg:w-[100px] h-[30px] w-[85px] bg-blue-500 text-white cursor-pointer rounded-2xl shadow-sm">Search</button>
            </div>




            <div  className="lg:flex md:flex justify-between items-center hidden ">
                {userInfo?.role==='USER'&&<div onClick={openModal} className="cursor-pointer">
                 <img className="h-[50px] w-[50px]" src="/shopping-cart.gif" alt="shopping-cart"/>
                 <h1 className=" absolute top-5 right-20 bg-red-600 h-[20px] w-[20px] rounded-3xl text-center text-white text-sm ">{totalCartItmes||0}</h1>
                </div>}
              
                <div>
                {userInfo?.role==='USER'||userInfo?.role==='ADMIN'?  <div onClick={openUserModal} className="cursor-pointer mr-[20px] ml-[20px]">
                    <Image className="ml-[10px]" src={userIcon} alt="userIcon" height={30} width={30}/>
                </div>:<button onClick={goSingIn} className="relative inline-flex items-center justify-center px-6 mx-[10px] py-2 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group cursor-pointer">
  <span
    className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
  ></span>
  <span className="absolute bottom-0 left-0 h-full -ml-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-auto h-full opacity-100 object-stretch"
      viewBox="0 0 487 487"
    >
      <path
        fillOpacity=".1"
        fillRule="nonzero"
        fill="#FFF"
        d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
      ></path>
    </svg>
  </span>
  <span className="absolute top-0 right-0 w-12 h-full -mr-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="object-cover w-full h-full"
      viewBox="0 0 487 487"
    >
      <path
        fillOpacity=".1"
        fillRule="nonzero"
        fill="#FFF"
        d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
      ></path>
    </svg>
  </span>
  <span
    className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
  ></span>
  <span className="relative text-base font-semibold">Login</span>
</button>}

      </div>
                
      </div>
        </nav>
      {openCartModal&&<Cart closeModal={closeModal} design={animatedModal} data={cartData} totalItems={totalCartItmes} submitItemDelete={deleteCartItems} areaValue={selectedArea} areaOnCh={(e)=>{setSelectedArea(e.target.value)}} goCheckOut={goCheckOut}
        shippingArea={shippingAreaData} mode={mode}/>}
      {userModal&&<UserInfo photo={userInfo?.photo} design={animatedModal} closeModal={closeUserModal} name={userInfo.name} openUploadImage={()=>{setProfilePhotoModal(true)}}
      email={userInfo.email} phone={userInfo.phone} role={userInfo.role} logout={()=>{logOut()}}/>}

      {profilePhotoModal&&<CropperModal closeModal={()=>{setProfilePhotoModal(false)}} onUpload={uploadProfilePhoto}/>}
        {loading&&<Loading/>}
      </>
    )
}