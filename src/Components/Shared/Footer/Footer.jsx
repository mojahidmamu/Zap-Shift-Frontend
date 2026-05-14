import React from "react";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa6";
import Logo from "../../Logo/Logo";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 my-6 mx-4 rounded-2xl">
      
      {/* Logo + Description */}
      <div className="text-center space-y-3 flex justify-center">
         <Logo></Logo>
      </div>

        {/* Navigation  and CLickable Link*/}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-300">
            <Link to="/services" className="hover:text-white transition">Services</Link>
            <Link to="/coverage" className="hover:text-white transition">Coverage</Link>
            <Link to="/about" className="hover:text-white transition">About Us</Link>
            <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
            <Link to="/blog" className="hover:text-white transition">Blog</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-8 text-xl">
            <a href="https://www.linkedin.com/in/abdullah-all-mojahid-a8a57b329/" className="hover:text-blue-500 transition">
            <FaLinkedin />
            </a>
            <a href="https://github.com/mojahidmamu" className="hover:text-black transition">
            <FaGithub />
            </a>
            <a href="https://www.facebook.com/abdullah.all.mojahid.2024" className="hover:text-blue-600 transition">
            <FaFacebook />
            </a>
            
        </div>

    </footer>
  );
};

export default Footer;