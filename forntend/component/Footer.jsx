import Image from "next/image";
import logo from '../public/logo.png'
import playStore from '../public/google-play-store.svg'
import appleStore from '../public/apple-store.png'
import location from '../public/location.png'
import phone from '../public/phone.png'
import email from '../public/email.png'
import facebook from '../public/facebook.png'
import instagram from '../public/instagram.png'
import tweeter from '../public/Twetter.png'
import visa from '../public/Visacard.png'
import master from '../public/mastercard.png'
import amx from '../public/Amx.png'
import bank from '../public/Bank.png'


export default function(){
    return(
        <div className=" mx-[10px] overflow-hidden">
            <div className="lg:flex md:flex grid grid-cols-1 items-center lg:justify-between md:justify-between justify-items-center">
                <div className="text-gray-700">
                <Image src={logo} height='auto' width='auto' priority className="h-[80px] w-[180px]" alt="store-logo"/>
                <p className="mt-[5px]">Touch & Take is the biggest market of treading products.</p>
                <p>Get your tranding fashion products from our store with fast delivery and great prices.</p>
                </div>
                <div className="flex justify-center items-center cursor-pointer ">
                    
                    <Image src={playStore} height='auto' width='auto' className="h-[160px] w-[300px] ml-[50px]"  alt="google-play-store"/>
                    <Image src={appleStore} height='auto' width='auto' className="h-[80px] w-[180px]" alt="apple-store"/>
                </div>
            </div>

            <div className=" overflow-hidden lg:flex md:flex  grid-cols-1 lg:justify-between md:justify-between justify-items-start mt-[30px]  mb-[10px] mx-[10px]">
                <div className=" p-[10px]">
                <h1 className="text-center text-xl font-semibold">Quick Links</h1>
                <div className="grid grid-cols-1 text-sm text-gray-600 mt-[10px] gap-0.5">
                    <p>About Us</p>
                    <p>Products</p>
                    <p>Offers</p>
                    <p>Careers</p>
                    <p>Blog</p>
                </div>
                </div>


                <div className=" p-[10px]">
                <h1 className="text-center text-xl font-semibold">Customer Service</h1>
                <div className="grid grid-cols-1 text-sm text-gray-600 mt-[10px] gap-0.5">
                    <p>Contact Us</p>
                    <p>FAQs</p>
                    <p>Shipping Policy</p>
                    <p>Return Policy</p>
                    <p>Privacy Policy</p>
                </div>
                </div>


                   <div className=" p-[5px]">
                <h1 className=" text-xl font-semibold">Contact Us</h1>
                <div className="grid grid-cols-1 text-sm text-gray-600 mt-[10px] gap-1.5 ">
                   <div className="flex items-center gap-1 ">
                    <Image src={location} height='auto' width='auto' className="h-[15px] w-[15px]" alt="location-logo"/>
                    <div className="grid grid-cols-1 ">
                    <p>270/Alim Street, Kidapawan City,</p>
                    <p> North Cotabato, Philippines.</p>
                    </div>

                   
                   </div>
                    <div className="flex items-start gap-1">
                    <Image src={phone} height={20} width={20} alt="phone-logo"/>
                    <p>+639926494930</p>
                   </div>
                    <div className="flex items-start gap-1">
                    <Image src={email} height='auto' width='auto' className="h-[25px] w-[20px]" alt="email-logo"/>
                    <p>tousherfana70@gmail.com</p>
                   </div>
                </div>
                </div>

                <div className=" p-[5px]">
                <h1 className=" text-xl font-semibold">Follow Us</h1>
                <div className="flex items-center gap-1.5 cursor-pointer">
                    <Image src={facebook} height={50} width={50} alt="facebook-logo"/>
                    <Image src={instagram} height={40} width={40} alt="instagram-logo"/>
                    <Image src={tweeter} height={50} width={50} alt="tweeter-logo"/>
                </div>
                </div>
            </div>
        <div className=" mx-[10px] overflow-hidden lg:flex md:flex lg:justify-between md:justify-between grid grid-rows-2 items-center mt-[20px] text-sm text-gray-400">
           <div>
                <p className="lg:text-sm md:text-sm text-xs">Copyright © all rights reserved. Powerd by Touch&Take</p>
           </div>
            
            <div className="flex items-center gap-2 justify-center">
                <Image src={visa} height={50} width={50} alt="visa-card-logo"/>
                <Image src={master} height={50} width={50} alt="master-card-logo"/>
                <Image src={amx} height={50} width={50} alt="amx-card-logo"/>
                <Image src={bank} height={50} width={50} alt="bank-transfer-logo"/>

            </div>

        </div>
            
           

        </div>
    )
}