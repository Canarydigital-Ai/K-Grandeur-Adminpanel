import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectRouter: React.FC = () => {
  const user = localStorage.getItem("token");
  return user ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectRouter;
