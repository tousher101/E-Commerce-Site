import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from '../component/Navbar'
import Footer from '../component/Footer'
import Service from '../component/Service'

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <NavBar/>
        {children}
        <Service/>
        <Footer/>
      </body>
    </html>
  );
}
