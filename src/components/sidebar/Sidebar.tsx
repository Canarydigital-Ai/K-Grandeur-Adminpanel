import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiGrid, FiUser, FiHome, FiBox, FiTag } from "react-icons/fi";
import AdminLogo from "../../assets/AdminLogo.jpg";

const navItems = [
  { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
  { label: "Rooms", icon: <FiBox />, path: "/admin/rooms" },
  { label: "Bookings", icon: <FiGrid />, path: "/admin/bookinglist" },
  { label: "Category", icon: <FiTag />, path: "/admin/category" },
  { label: "Customers", icon: <FiUser />, path: "/admin/customers" },
  { label: "Logout", icon: <FiLogOut />, path: "/admin/login", isLogout: true },
];

const Sidebar: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("Dashboard");
  const navigate = useNavigate();

  const handleSelection = (item: any) => {
    setSelectedItem(item.label);
    if (item.isLogout) {
      localStorage.removeItem("token");
    }
    navigate(item.path);
  };

  return (
    <aside className="min-h-screen w-full sm:w-64 bg-white border-r border-gray-200 shadow-sm p-4">
      <div className="flex flex-col items-center">
        <img src={AdminLogo} alt="Logo" className="w-20 mb-2" />
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
      </div>

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
  );
};

export default Sidebar;