import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Logo from '../images/logo.png';
import img1 from './Assets/Images/logo.png'

export default function Navbar() {




  return (
    <nav className="fixed z-50 w-full bg-transparent flex">
      <div className="lg:px-15 flex justify-between items-center">
        <div>
          <Image 
            src={Logo} 
            alt="Vichola" 
            className="h-16 w-17"
          />
        </div>

        <div>
          <ul className="hidden lg:flex lg:gap-6">
            <li><Link to="/" className="text-sm font-bold text-[#615a5a] hover:text-[#bf65ad] open-sans-google">Home</Link></li>
            <li><Link to="/about" className="text-sm font-bold text-[#615a5a] hover:text-[#bf65ad] open-sans-google">About</Link></li>
            <li><Link to="/profile" className="text-sm font-bold text-[#615a5a] hover:text-[#bf65ad] open-sans-google" >Profile</Link></li>
            <li><Link to="/match" className="text-sm font-bold text-[#615a5a] hover:text-[#bf65ad] open-sans-google">Match</Link></li>
          </ul>
        
  
        </div>
      </div>

    </nav>
  );
}
