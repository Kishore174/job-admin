import React from 'react';
import { MdMenu } from 'react-icons/md';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="w-full bg-[#0a0a0f] border-b border-[#1a1a2e] z-30 h-16 flex items-center px-5 lg:px-8 flex-shrink-0">

      {/* Hamburger — mobile only */}
      <button
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-[#1a1a2e] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MdMenu className="text-xl" />
      </button>

      {/* Page title area — can add breadcrumb here later */}
      <div className="flex-1" />

      {/* Right side actions placeholder */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs text-slate-600 hidden sm:block">System Online</span>
      </div>

    </header>
  );
};

export default Header;