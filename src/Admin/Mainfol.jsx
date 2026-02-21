import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

const Mainfol = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#07070e] overflow-hidden">

      {/* Sidebar — fixed width on desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Mainfol;