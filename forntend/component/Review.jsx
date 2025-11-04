"use-clienty"
import { fetchWithAuth } from "../Utils/fetchWithAuth"
import Alert from "../Utils/Alert"
import { useEffect, useState } from "react";
import SubmitReview from "../component/SubmitReview";
import { useUserInfo } from "../context/userInfo";


export default function review({productId}){
    const BaseURI=process.env.NEXT_PUBLIC_API_URI;
    const [commentData,setCommentData]=useState([]);
    const [totalPage, setTotalPage]=useState(0);
    const [page, setPage]=useState(1);
    const [totalComment, setTotalComment]=useState(0);
    const [comment,setComment]=useState('');
    const [msg,setMsg]=useState(null);
    const [type,setType]=useState(null);
    const {user,role}=useUserInfo();
    const [commentId,setCommentId]=useState(null);

    const getAllComment=async(page,id)=>{
        const res=await fetchWithAuth(`${BaseURI}/api/user/getallcomment/${id}?page=${page}&limit=${10}`)
        setCommentData(res.allcomment);
        setTotalPage(res.totalPage);
        setTotalComment(res.totalComment);

    };

    const submitComment=async(id)=>{
        const res=await fetchWithAuth(`${BaseURI}/api/user/reviewproduct/${id}`,{
            method:'POST',
            body:JSON.stringify({comment})
        });
        setMsg(res.msg);setType('Success');setComment('');getAllComment(page,productId);
    };

    const handleNext=()=>{
        if(totalPage>page){setPage((p)=>p+1)}else{setMsg('No More Comment Available'); setType('Error'); return}
    };

    const deleteComment=async(id)=>{
        const res=await fetchWithAuth(`${BaseURI}/api/admin/deletereview/${id}`,{
            method:'DELETE'
        });
    setMsg(res.msg);setType('Success');getAllComment(page,productId);
    };


    useEffect(()=>{
        getAllComment(page,productId)
    },[page])
    return(
        <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
        <div className="mx-[auto] overflow-hidden mb-[25px]">
            <h1 className="text-xl font-semibold">Review ({totalComment || 0})</h1>
          <div className="grid grid-cols-1 mx-[10px] gap-3  bg-gray-400  p-3 rounded-xl ">
            {commentData.length>0?commentData?.map((com)=>(
                <div key={com.id}  className="bg-gray-200 p-2 rounded-sm">
                 <div className="flex items-center gap-1  p-2 rounded-sm">
                    <img className="h-[45px] w-[45px] rounded-4xl" src={com?.user?.photo ||'./User-2.gif'}/>
                    <h1 className="font-semibold">{com?.user?.name}</h1>
                    <h1 className="text-[11px]">@{com?.user?.role}</h1>
                    </div>
                    <div className="  bg-gray-300 rounded-xl p-2">
                        <p className="text-sm">{com?.comment}</p>
                    </div>
                    <div className="flex justify-between mx-[10px] items-center my-[10px] ">
                    <h1 className="text-[11px]" >{new Date(com?.createdAt).toDateString()}</h1>
                    {role==='ADMIN'&&<button onClick={()=>{deleteComment(com.id)}} className="p-1 border-1 rounded-sm cursor-pointer">Delete</button>}
                    </div>
                    
            </div>
            )):<h1 className="text-center text-2xl text-black font-semibold">Review Not Available</h1>}
               
        </div>
        </div>
        <div className="mx-[10px] overflow-hidden">
            {totalPage>1&&<div className="flex justify-between mb-[25px]">
            <button onClick={()=>{setPage((p)=>p-1)}}  disabled={totalPage<=1}  className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Previous</button>
            <button onClick={handleNext}   className='h-[40px] w-[100px] bg-black text-white rounded-xl cursor-pointer'>Next</button>
            </div>}

            {user&&<SubmitReview commentValue={comment} commentOnCh={(e)=>{setComment(e.target.value)}} submitComment={()=>{submitComment(productId)}}/>}
        </div>
        </>
    )
}