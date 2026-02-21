import React from "react";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#1e1e2e]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
        </div>
        <p className="text-xs font-medium tracking-[2px] uppercase text-slate-600">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;