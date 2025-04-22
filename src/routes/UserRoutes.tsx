import { lazy, Suspense, memo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectRouter from "../utils/ProtectRouter";
import SidebarLayout from "../layout/SidebarLayout"; 


const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const RoomList = lazy(() => import("../pages/Rooms/RoomList"));
const CreateRoom = lazy(() => import("../pages/Rooms/CreateRoom"));
const EditRoom = lazy(() => import("../pages/Rooms/EditRoom"));
const BookingListPage = lazy(() => import("../pages/booking/BookingListPage"));
const ViewBookingPage = lazy(() => import("../pages/booking/ViewSpecific"));
const CustomerListing = lazy(() => import("../pages/customers/CustomerListing"));

const AppRoutes = memo(() => {
  return (
    <Suspense
    fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
      </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectRouter />}>
          <Route path="/admin" element={<SidebarLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<RoomList />} />
            <Route path="create-room" element={<CreateRoom />} />
            <Route path="edit-room/:id" element={<EditRoom />} />
            <Route path="bookinglist" element={<BookingListPage />} />
            <Route path="view-booking/:id" element={<ViewBookingPage />} />
            <Route path="customers" element={<CustomerListing />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </Suspense>
  );
});

export default AppRoutes;
