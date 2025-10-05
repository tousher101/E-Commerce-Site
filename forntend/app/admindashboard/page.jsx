import AdminCard from '../../component/AdminCard'
import Chart from '../../component/Chart'
export default function admindashboard(){


    return (
        
        <div className='grid grid-cols-1 max-w-[1380px] mx-[10px] overflow-hidden '>
           <h1 className="text-center text-3xl font-semibold text-gray-500 my-[30px]">Admin Dashboard</h1>
            <Chart/>
            <AdminCard/>
            </div>
    )
    
}