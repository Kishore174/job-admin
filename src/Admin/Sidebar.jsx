import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdWork,
  MdPeople,
  MdAssignment,
  MdStar,
  MdManageAccounts,
  MdSettings,
} from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../Assets/logo.png";
import { jwtDecode } from "jwt-decode";

const menuItems = [
  { name: "Dashboard",      href: "/dash",           icon: MdOutlineDashboard, roles: ["admin", "student"] },
  // { name: "Job",            href: "/global",          icon: MdWork,             roles: ["admin"] },
  { name: "Student",        href: "/student",         icon: MdPeople,           roles: ["admin"] },
  { name: "Applies",        href: "/applies",         icon: MdAssignment,       roles: ["admin"] },
  { name: "Premium Manage", href: "/premium-manage",  icon: MdManageAccounts,   roles: ["admin"] },
  { name: "HR Settings",    href: "/hr-settings",     icon: MdSettings,         roles: ["admin"] },
  { name: "Premium Job",    href: "/premium",         icon: MdStar,             roles: ["student"] },
  { name: "Student Profile",    href: "/profile",         icon: MdStar,             roles: ["student"] },

];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let role = null;
  let username = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      username = decoded.username || decoded.name || role;
    } catch {}
  }

  const filtered = menuItems.filter(item => item.roles.includes(role));

  const handleNav = (href) => {
    setIsSidebarOpen(false);
    navigate(href);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* ── Sidebar Panel ── */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col
          bg-[#0a0a0f] border-r border-[#1a1a2e]
          transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-48 bg-blue-600/5 blur-2xl" />

        {/* ── Logo ── */}
        <div className="relative px-6 py-5 border-b border-[#1a1a2e]">
          <Link to="/" onClick={() => setIsSidebarOpen(false)}>
            <img src={logo} alt="Logo" className="h-9 w-auto" />
          </Link>
        </div>

        {/* ── Role Badge ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5 bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl px-3.5 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0">
              {username?.slice(0, 2) || role?.slice(0, 2) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-300 truncate capitalize">
                {username || "User"}
              </p>
              <p className="text-[10px] text-slate-600 capitalize tracking-wide">{role}</p>
            </div>
          </div>
        </div>

        {/* ── Nav Label ── */}
        <div className="px-5 pt-3 pb-1">
          <span className="text-[10px] font-medium tracking-[2px] uppercase text-slate-600">
            Navigation
          </span>
        </div>

        {/* ── Menu Items ── */}
        <nav className="flex-1 px-3 pb-4 overflow-y-auto space-y-0.5">
          {filtered.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.href)}
                className={`group relative flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:text-slate-200 hover:bg-[#13131f]"
                  }`}
              >
                {/* Active left indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full opacity-60" />
                )}

                <Icon className={`text-lg flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-600 group-hover:text-slate-300"}`} />
                <span>{item.name}</span>

                {/* Active shimmer dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        <div className="px-3 pb-5 border-t border-[#1a1a2e] pt-3">
          <button
            onClick={handleLogout}
            className="group flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
          >
            <FaSignOutAlt className="text-base flex-shrink-0 text-slate-600 group-hover:text-red-400 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Overlay ── */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;