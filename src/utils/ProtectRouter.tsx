import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectRouter: React.FC = () => {
  const token  = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectRouter;
