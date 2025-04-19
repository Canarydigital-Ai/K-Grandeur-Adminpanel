import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogo from "../../assets/AdminLogo.jpg"
const Sidebar: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("Dashboard");
  const navigate = useNavigate();


  const handleSelection = (item: string) => {
    switch (item) {
      case "Dashboard":
        navigate("/admin/dashboard");
        break;
      case "Rooms":
        navigate("/admin/rooms");
        break;
      case "Products":
        navigate("/admin/products");
        break;
      case "Customers":
        navigate("/admin/customers");
        break;
      case "Coupons":
        // navigate("/");
        break;
      case "Category":
        navigate("/admin/category");
        break;
      case "Logout":
        localStorage.removeItem("token"); 
        navigate("/admin/login");
        break;
      default:
        navigate("/");
    }
    setSelectedItem(item);
  };

  return (
    <div className="flex flex-col min-h-min  ">
      <div className="w-full flex justify-center mt-3">
        <img src={AdminLogo} alt="Logo" className="w-20" />
      </div>
      <div className="w-full flex justify-center border-black/30 mt-3 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-4 ">
        {["Dashboard", "Rooms", "Bookings", "Category", "Logout"].map(
          (item, index) => {
            const bgClass = selectedItem === item ? "bg-gray-200" : "bg-transparent";
            return (
              <p
                key={index}
                onClick={() => handleSelection(item)}
                className={`block px-6 py-4 text-base font-semibold border-b border-black/30 text-gray-700 hover:bg-gray-200 cursor-pointer ${bgClass}`}
              >
                {item}
              </p>
            );
          }
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
