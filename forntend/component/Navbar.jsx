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
import loginIcon from '../public/power-button.png'
import notificationIcon from '../public/notification.png'



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
         if (!cartData?.items || cartData?.items?.length === 0) {
        setMsg('Cart Is Empty'); 
        setType('Error'); 
        return;
    }
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
        <nav className=" max-w-[1380px] mx-[10px]  my-[10px] lg:flex md:flex  grid lg:h-[70px] md:h-[70px] h-[180px] items-center lg:justify-between md:justify-between   overflow-hidden">
          <div className="flex justify-end lg:hidden md:hidden">
                <div  className="flex  justify-around items-center ">
                {userInfo?.role==='USER'&&<div onClick={openModal} className="cursor-pointer relative mr-[25px]">
                 <img className="h-[40px] w-[40px] " src="/shopping-cart.gif" alt="shopping-cart"/>
                 <h1 className=" absolute top-0 right-0 bg-red-600 h-[20px] w-[20px] rounded-3xl text-center text-white text-sm ">{totalCartItmes||0}</h1>
                </div>}
              
                <div className="flex justify-center gap-3">
                  <div className="relative">
                    <Image src={notificationIcon} width={25} height={25} alt="notification-icon"/>
                    <h1 className=" absolute top-0 right-0 bg-red-600 h-[20px] w-[20px] rounded-3xl text-center text-white text-sm ">{totalCartItmes||0}</h1>
                  </div>
                  
                {userInfo?.role==='USER'||userInfo?.role==='ADMIN'?  <div onClick={openUserModal} className="cursor-pointer">
                    <Image className="ml-[10px]" src={userIcon} alt="userIcon" height={25} width={25}/>
                </div>:<button onClick={goSingIn}><Image src={loginIcon} height={30} width={30} alt="login-icon" className="cursor-pointer"/></button>}
                </div>
                
              </div>
          </div>

          
            <div className="lg:h-[80px] lg:w-[120px] md:h-[80px] md:w-[120px] w-full  ml-[10px] flex lg:justify-between md:justify-between justify-around items-center">
            <Link href='/'><Image className="lg:w-[190px] lg:h-[80px] md:w-[190px] md:h-[80px] w-[120px] h-[60px]" src={logo} alt="logo" width={'auto'} height={'auto'} priority /></Link>
            </div>
            <div className=" flex items-center gap-3 mt-[10px] justify-center ">
              <input value={searchData} onChange={(e)=>{setSearchData(e.target.value)}} className="border border-gray-400 lg:p-[5px] p-1 lg:w-[300px] md:w-[250px] w-[200px]  rounded-xl" type="text" placeholder="Search Product"/>
              <button onClick={goSearch} className="lg:h-[35px] lg:w-[100px] h-[30px] w-[85px] bg-blue-500 text-white cursor-pointer rounded-2xl">Search</button>
            </div>
          




            <div  className="lg:flex md:flex justify-between items-center hidden gap-3 ">
                {userInfo?.role==='USER'&&<div onClick={openModal} className="cursor-pointer relative">
                 <img className="h-[45px] w-[45px]" src="/shopping-cart.gif" alt="shopping-cart"/>
                 <h1 className=" absolute top-0 right-0 bg-red-600 h-[20px] w-[20px] rounded-3xl text-center text-white text-sm ">{totalCartItmes||0}</h1>
                </div>}
              
                <div className="flex justify-center  items-center mx-[10px] gap-3">
                      <div className="relative cursor-pointer">
                    <Image src={notificationIcon} width={25} height={25} alt="notification-icon"/>
                    <h1 className=" absolute top-[-5] right-[-5] bg-red-600 h-[20px] w-[20px] rounded-2xl  text-center text-white text-sm ">{totalCartItmes||0}</h1>
                  </div>
                {userInfo?.role==='USER'||userInfo?.role==='ADMIN'?  <div onClick={openUserModal} className="cursor-pointer">
                    <Image className="ml-[10px]" src={userIcon} alt="userIcon" height={30} width={30}/>
                </div>:<button onClick={goSingIn} className="h-[30px] w-[30px] cursor-pointer"><Image src={loginIcon} height={'auto'} width={'auto'} alt="login-icon"/></button>}


      </div>
                
      </div>
        </nav>
      {openCartModal&&<Cart closeModal={closeModal} design={animatedModal} data={cartData} totalItems={totalCartItmes} submitItemDelete={deleteCartItems} areaValue={selectedArea} areaOnCh={(e)=>{setSelectedArea(e.target.value)}} goCheckOut={goCheckOut}
        shippingArea={shippingAreaData} mode={mode}/>}
      {userModal&&<UserInfo photo={userInfo?.photo} design={animatedModal} closeModal={closeUserModal} name={userInfo?.name} openUploadImage={()=>{setProfilePhotoModal(true)}}
      email={userInfo.email} phone={userInfo.phone} role={userInfo.role} logout={()=>{logOut()}}/>}

      {profilePhotoModal&&<CropperModal closeModal={()=>{setProfilePhotoModal(false)}} onUpload={uploadProfilePhoto}/>}
        {loading&&<Loading/>}
      </>
    )
}
