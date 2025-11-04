import { useRouter } from 'next/navigation'
import userIcon from '../public/User-2.gif'
import Image from 'next/image'

export default function userInfo({design,closeModal,photo, name, email,phone,role, logout,openUploadImage }){
  const router= useRouter();
  const goUserDashboard=()=>{
    router.push('/userdashboard');
    closeModal();
  };
  const goAdminDashboard=()=>{
    router.push('/admindashboard');
    closeModal()
  }
    return(
      <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50 transition-opacity duration-1000 ${design?'opacity-100':'opacity-0'}`}>
          <div className={`grid justify-items-center center content-center items-center bg-white p-[15px] rounded-2xl w-[400px] text-center text-black duration-1000 ${design?'scale-100':'scale-0'}`}>
              <p className='text-2xl font-bold'>User Profile</p>
                <div className="flex justify-center rounded-4xl mt-[25px]">
                  <Image src={photo||userIcon} height={80} width={80} alt='profile-photo' className='rounded-xl'/>
                </div>
                <div className='text-m font-semibold mt-[20px]'>
                    <h1>{name}</h1>
                    <h2>{email}</h2>
                    <h3>{phone}</h3>
                    <h3>@{role}</h3>
                </div>
           
  
           <div className="flex items-center gap-2 text-white mt-[25px]">
              <button onClick={openUploadImage} className=' h-[40px] w-[150px]  bg-green-500 rounded-xl  cursor-pointer'>Change Photo</button>
             {role==='USER'&&<button onClick={goUserDashboard} className=' h-[40px] w-[100px]  bg-blue-500 rounded-xl  cursor-pointer'>Manage</button>}
             {role==='ADMIN'&&<button onClick={goAdminDashboard} className=' h-[40px] w-[100px]  bg-blue-500 rounded-xl  cursor-pointer'>Manage</button>}
              <button onClick={logout} className=' h-[40px] w-[100px]  bg-red-500 rounded-xl  cursor-pointer'>Logout</button>
           </div>
               <div onClick={closeModal} className=' top-3 right-3 absolute text-black font-bold cursor-pointer text-xl'>X</div>
          </div>
        
      </div>
    )
}