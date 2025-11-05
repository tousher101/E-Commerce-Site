
import Link from "next/link"
export default function cookieNotification({closeCookie, acceptCookie}){
    return(
        <div data-aos='slide-up' className="grid grid-1 gap-2 justify-items-center fixed bottom-0 right-0 z-999 p-2 w-full border-1 border-gray-400 rounded-xl bg-blue-100">
            <div className="flex gap-1 items-center">
                <img className="h-[30px] w-[30px]" src='/cookie.png'/>
            <p className="lg:text-xl md:text-xl text-xs">This site uses cookies to help improve your user experience. </p>
            <Link href='/cookie-policy'><p className="lg:text-xl md:text-xl text-xs underline">Cookie policy</p></Link> 
            </div>
            
            <div className="flex justify-items-center gap-4">
                <button onClick={acceptCookie} className="p-2 border-1 border-gray-400 rounded-sm cursor-pointer">Accept</button>
                <button onClick={closeCookie} className="p-2 border-1 border-gray-400 rounded-sm cursor-pointer">Reject</button>
            </div>

        </div>
    )
}