import Link from "next/link"
export default function paymentFaild(){
    return(
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center">
        
        
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
          
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#FEE2E2" 
              strokeWidth="5"
              fill="none"
            />
            
           
            <circle
              className="svg-fill-fail" 
              cx="50"
              cy="50"
              r="45"
              stroke="none"
            />

            
            <circle
              className="svg-circle-fail" 
              cx="50"
              cy="50"
              r="45"
              stroke="#DC2626" 
              strokeWidth="5"
              fill="none"
              transform="rotate(-90 50 50)"
            />
            
        
            <path
              className="svg-cross-1" 
              d="M 35 35 L 65 65"
              stroke="#FFFFFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
           
            <path
              className="svg-cross-2" 
              d="M 65 35 L 35 65"
              stroke="#FFFFFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Faild!
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry! This payment not completed. Please Try Again.
        </p>

        
       <Link href={'/userdashboard'}> <button
        
          className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-block"
        >
          Back To Dashboard
        </button></Link>
      </div>
    </div>
    )
}