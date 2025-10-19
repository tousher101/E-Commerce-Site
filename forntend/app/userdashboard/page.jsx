import UserDashBoardCard from "../../component/UserDashboardCard"
export default function userDashboard(){
    return(
        <div className='grid grid-cols-1 max-w-[1380px] mx-[10px] overflow-hidden '>
            <h1 className="text-center text-3xl font-semibold text-gray-500 my-[30px]">Your Dashboard</h1>
            <UserDashBoardCard/>
        </div>
    )
}