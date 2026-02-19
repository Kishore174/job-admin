import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../Assets/logo.png";
import { jwtDecode } from "jwt-decode";
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

const token = localStorage.getItem("token");
let role = null;

if (token) {
  const decoded = jwtDecode(token);
  role = decoded.role;
}
const menuItems = [
  {
    name: "Dashboard",
    href: "/dash",
    icon: <MdOutlineDashboard />,
    roles: ["admin","student"],
  },
  {
    name: "Job",
    href: "/global",
    icon: <MdOutlineDashboard />,
    roles: ["admin"],
  },
  {
    name: "Student",
    href: "/student",
    icon: <MdOutlineDashboard />,
    roles: ["admin"],
  },
    {
    name: "Applies",
    href: "/applies",
    icon: <MdOutlineDashboard />,
    roles: ["admin"],
  },
  {
    name: "Premium Job",
    href: "/premium",
    icon: <MdOutlineDashboard />,
    roles: ["student"],   // 👈 both can see
  },{
  name: "Premium Manage",
  href: "/premium-manage",
  icon: <MdOutlineDashboard />,
  roles: ["admin"],
},
{
  name: "HR Settings",
  href: "/hr-settings",
  icon: <MdOutlineDashboard />,
  roles: ["admin"],
},


];


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-50 h-screen bg-white shadow-xl w-64 
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 flex justify-center border-b">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-28 h-auto" />
          </Link>
        </div>

        {/* Menu */}
        <ul className="px-5 mt-6 space-y-2">

          {menuItems
            .filter(item => item.roles.includes(role))
            .map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      navigate(item.href);
                    }}
                    className={`flex items-center w-full p-3 rounded-lg space-x-3 font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#2BB5CE] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}

          {/* Logout */}
          <li className="mt-10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg space-x-3 font-medium
              text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </li>

        </ul>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
