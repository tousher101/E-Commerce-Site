
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import NavBar from '../component/Navbar'
import Footer from '../component/Footer'
import Service from '../component/Service'
import {UserProvider} from '../context/userInfo'
import { GlobalProvider } from "../context/globalContext";



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
        <Service/>
        <Footer/>
        </UserProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
