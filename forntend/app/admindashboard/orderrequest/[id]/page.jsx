"use client"
import { useParams } from "next/navigation"
import ProductDetails from '../../../../component/OrderDetails'
export default function orderReqId(){
    const params= useParams()
    return(
       <ProductDetails/>
    )
}