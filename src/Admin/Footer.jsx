import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#1a1a2e] bg-[#0a0a0f] px-8 py-3 flex items-center justify-between flex-shrink-0">
      <span className="text-xs text-slate-700">
        © {new Date().getFullYear()} Job Portal. All rights reserved.
      </span>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
        <span className="text-[10px] text-slate-700 tracking-wide uppercase">v1.0</span>
      </div>
    </footer>
  );
};

export default Footer;