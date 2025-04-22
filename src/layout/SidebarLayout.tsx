import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar"; 
import { FaBars } from "react-icons/fa";

const SidebarLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 border-r border-black/20 bg-white shadow-lg transition-transform duration-300 z-30 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 bg-blue-500 text-white rounded-lg lg:hidden z-40"
        >
          <FaBars className="h-6 w-6" />
        </button>

        <div className="p-4 sm:p-6 lg:px-8 lg:ml-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;