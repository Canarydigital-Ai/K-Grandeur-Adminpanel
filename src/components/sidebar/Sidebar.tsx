import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiGrid, FiUser, FiHome, FiBox, FiMenu, FiX } from "react-icons/fi";
import AdminLogo from "../../assets/AdminLogo.jpg";

const navItems = [
  { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
  { label: "Rooms", icon: <FiBox />, path: "/admin/rooms" },
  { label: "Bookings", icon: <FiGrid />, path: "/admin/bookinglist" },
  { label: "Customers", icon: <FiUser />, path: "/admin/customers" },
  { label: "Logout", icon: <FiLogOut />, path: "/admin/login", isLogout: true },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Find active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    const activeItem = navItems.find(item => path.includes(item.path));
    return activeItem?.label || "Dashboard";
  };
  
  const [selectedItem, setSelectedItem] = useState<string>(getActiveItem());
  
  // Update selected item when route changes
  useEffect(() => {
    setSelectedItem(getActiveItem());
  }, [location.pathname]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleSelection = (item: any) => {
    setSelectedItem(item.label);
    setIsNavigating(true);
    
    if (item.isLogout) {
      localStorage.removeItem("token");
    }
    
    // Add a small delay to show the navigation indication
    setTimeout(() => {
      navigate(item.path);
      setIsNavigating(false);
    }, 50);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-blue-500 text-white shadow-md"
        >
          {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile - only appears when sidebar is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* The actual sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40
        h-screen w-64 bg-white border-r border-gray-200 shadow-sm p-4
        transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col items-center">
          <img src={AdminLogo} alt="Logo" className="w-20 mb-2" />
          <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        </div>

        {isNavigating && (
          <div className="w-full bg-blue-100 text-blue-800 px-4 py-2 rounded mb-4 text-center text-sm">
            Loading...
          </div>
        )}

        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = selectedItem === item.label;
            return (
              <button
                key={index}
                onClick={() => handleSelection(item)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 hover:bg-gray-100 text-left ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;