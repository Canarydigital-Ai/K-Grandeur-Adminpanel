import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBookingById, deleteBooking } from "../../api/services/bookingService";
import { FaArrowLeft, FaEdit, FaTrash, FaTicketAlt, FaPrint } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkInDate: Date;
  checkOutDate: Date;
  nightsCount: number;
  roomId: string;
  roomName: string;
  basePrice: number;
  subTotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: boolean;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const ViewBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getBookingById(id);
        if (data) {
          setBooking(data);
        } else {
          toast.error("Booking not found");
          navigate("/admin/bookings");
        }
      } catch (error) {
        toast.error("Failed to fetch booking details");
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/admin/bookinglist");
  };

  const handleEdit = () => {
    navigate(`/admin/edit-booking/${id}`);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteBooking(id);
      toast.success("Booking deleted successfully!");
      navigate("/admin/bookings");
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error("Delete error:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
        <button 
          onClick={handleBack}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition flex items-center"
          >
            <FaPrint className="mr-2" /> Print
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={openDialog}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{`${booking.firstName} ${booking.lastName}`}</h3>
              <p className="text-gray-600">{booking.email}</p>
              <p className="text-gray-600">{booking.phone}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.paymentStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {booking.paymentStatus ? "Paid" : "Unpaid"}
              </span>
              <p className="mt-2 text-xl font-bold text-gray-800">{formatCurrency(booking.totalAmount)}</p>
              <p className="text-gray-600 text-sm">Total Amount</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Check-in</h4>
              <p className="text-lg font-bold">{formatDate(booking.checkInDate)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Check-out</h4>
              <p className="text-lg font-bold">{formatDate(booking.checkOutDate)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Duration</h4>
              <p className="text-lg font-bold">{booking.nightsCount} {booking.nightsCount === 1 ? 'Night' : 'Nights'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Room Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Room:</span>
                  <span className="ml-2 text-gray-800">{booking.roomName}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Room ID:</span>
                  <span className="ml-2 text-gray-800">{booking.roomId}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Base Price:</span>
                  <span className="ml-2 text-gray-800">{formatCurrency(booking.basePrice)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Payment Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="ml-2 text-gray-800">{formatCurrency(booking.subTotal)}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Tax:</span>
                  <span className="ml-2 text-gray-800">{formatCurrency(booking.tax)}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Total Amount:</span>
                  <span className="ml-2 font-bold text-gray-800">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Payment Method:</span>
                  <span className="ml-2 capitalize text-gray-800">{booking.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {!booking.paymentStatus && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center">
                  <MdPayment className="mr-2" /> Mark as Paid
                </button>
              )}
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center">
                <FaTicketAlt className="mr-2" /> Generate Invoice
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-bold mb-4 text-gray-800">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-gray-600 font-medium">Booking ID:</span>
                <span className="ml-2 text-gray-800 break-all">{booking._id}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Created:</span>
                <span className="ml-2 text-gray-800">{formatDate(booking.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Last Updated:</span>
                <span className="ml-2 text-gray-800">{formatDate(booking.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </div>
  );
};

export default ViewBookingPage;