"use client"
import { useParams } from "next/navigation"
export default function orderReqId(){
    const params= useParams()
    return(
        <div>
        {params.id}
        </div>
    )
}