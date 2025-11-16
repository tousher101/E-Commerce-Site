
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import NavBar from '../component/Navbar'
import Footer from '../component/Footer'
import Service from '../component/Service'
import {UserProvider} from '../context/userInfo'
import { GlobalProvider } from "../context/globalContext";
import Image from 'next/image'
import contactIcon from '../public/whatsapp.png'
import Link from "next/link";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: "Touch&Take - Fashion Shop",
  description: "Treanding Fashion Shop",
};

export default function RootLayout({ children }) {
 
  return (
    <html lang="en">
      <head>
       <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>
      </head>
        <body>
        <GlobalProvider>
        <UserProvider>
       <NavBar/>
        {children}
        <div className="block print:hidden">
       <Service/>
        <Footer/>
        </div>
          <div className='h-[60px] w-[60px] fixed bottom-5 right-5 cursor-pointer'>
         <Link href='https://wa.me/qr/B6D2HLNWDNWDH1'> <Image src={contactIcon} height={60} width={60} alt='contact-icon'/></Link>
        </div>
        </UserProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
