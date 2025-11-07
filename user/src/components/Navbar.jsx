import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/femcloud-logo.jpg";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow fixed top-0 left-0 w-full z-10">
      <div className="flex items-center gap-3">
        <img src={logo} alt="FEMCLOUD" className="w-10 h-10 rounded" />
        <span className="font-bold text-lg text-blue-600">FEMCLOUD</span>
      </div>
      <div className="flex gap-6">
        <Link to="/home" className={pathname==="/home"?"text-blue-600 font-bold":"text-gray-600"}>Home</Link>
        <Link to="/saved" className={pathname==="/saved"?"text-blue-600 font-bold":"text-gray-600"}>Saved</Link>
      </div>
    </nav>
  );
}
