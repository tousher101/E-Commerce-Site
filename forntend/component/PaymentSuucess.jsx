import Link from "next/link"
export default function paymentSuccess(){
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
              stroke="#D1FAE5"
              strokeWidth="5" // JSX-এ 'stroke-width' এর বদলে 'strokeWidth' হয়
              fill="none"
            />
            
     
            <circle
              className="svg-fill"
              cx="50"
              cy="50"
              r="45"
              stroke="none"
            />

            
            <circle
              className="svg-circle"
              cx="50"
              cy="50"
              r="45"
              stroke="#10B981"
              strokeWidth="5"
              fill="none"
              transform="rotate(-90 50 50)"
            />
            
          
            <path
              className="svg-checkmark"
              d="M 30 50 L 45 65 L 70 40"
              stroke="#FFFFFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

       
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for payment. We got your payment.
        </p>

        
        <Link href={'/userdashboard'}><button
         
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-block"
        >
          Back To Dashboard
        </button></Link>
      </div>
    </div>
    )
}