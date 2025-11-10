import React from "react";
import { NavLink } from "react-router-dom";
import logo from "./assets/femcloud-logo.jpg";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-blue-700 text-white flex justify-between items-center px-6 py-4 shadow">
      <div className="flex items-center gap-3">
              <img src={logo} alt="FEMCLOUD" className="w-10 h-10 rounded" />
              <span className="font-bold text-lg text-white">FEMCLOUD</span>
            </div>
      <div className="text-2xl font-semibold">Seller Panel</div>
      <div className="space-x-6">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "underline border-b-2 border-white pb-1" : "hover:underline"
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "underline border-b-2 border-white pb-1" : "hover:underline"
          }
        >
          Profile
        </NavLink>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded ml-6 transition"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
