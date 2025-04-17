import { lazy, Suspense, memo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectRouter from "../utils/ProtectRouter";
import SidebarLayout from "../layout/SidebarLayout"; 

// Lazy-loaded pages
const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const AppRoutes = memo(() => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
          </div>
        }
      >
        <Routes>
          {/* Redirect from root to dashboard */}
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />

          {/* Login page (without sidebar) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected dashboard (with sidebar) */}
          <Route element={<ProtectRouter />}>
            <Route path="/admin" element={<SidebarLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer />
    </Router>
  );
});

export default AppRoutes;
