
import Product from '../../component/Product'
import {fetchWithAuth} from '../../Utils/fetchWithAuth'



export default  async function mensFashionPage({searchParams}){
      const page= searchParams?.page || 1;
    const BaseURI= process.env.NEXT_PUBLIC_API_URI
  
 
    const response= await fetchWithAuth(`${BaseURI}/api/user/allproduct?page=${page}`,
        { cache: "no-store" }
    )
    const data= await  response.json();
   
   

    return(
        <div className='max-w-[1380px] mx-[10px] overflow-hidden'>
       <Product product={data.getAllProduct} page={page} pages={data.totalPage} totalProduct={data.totalProduct}/>
        </div>
    )
}