import React, { memo, useEffect, useState } from "react";
import { getAllBookings } from "../../api/services/bookingService";
import { getRoom } from "../../api/services/RoomService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardCharts from "../../components/DashboardCharts"; 

const Dashboard: React.FC = memo(() => {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [roomData, setRoomData] = useState<any[]>([]);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [roomCount, setRoomCount] = useState<number>(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [revenue, setRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch bookings data
        const bookingsData: any[] = await getAllBookings();
        console.log("Bookings data:", bookingsData);
        
        // Fetch rooms data
        const roomsData: any[] = await getRoom();
        console.log("Rooms data:", roomsData);

        // Calculate dashboard metrics
        const uniqueEmails = new Set(bookingsData.map((booking: any) => booking.email));
        const totalRevenue = bookingsData.reduce(
          (acc, booking) => acc + booking.totalAmount,
          0
        );
        const totalRoomCount = roomsData.reduce(
          (acc, room) => acc + (room.roomcount || 0),
          0
        );

        // Update state
        setBookingData(bookingsData);
        setRoomData(roomsData);
        setBookingCount(bookingsData.length);
        setRoomCount(totalRoomCount);
        setCustomerCount(uniqueEmails.size);
        setRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency
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

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800">
            Admin Dashboard
          </h1>
        </header>

        {/* Dashboard Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Bookings",
              value: bookingCount,
              icon: "📘",
              color: "bg-blue-100 text-blue-800",
            },
            {
              title: "Total Rooms",
              value: roomCount,
              icon: "🛏️",
              color: "bg-purple-100 text-purple-800",
            },
            {
              title: "Total Customers",
              value: customerCount,
              icon: "👥",
              color: "bg-green-100 text-green-800",
            },
            {
              title: "Revenue",
              value: formatCurrency(revenue),
              icon: "💰",
              color: "bg-yellow-100 text-yellow-800",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl shadow-md ${card.color} transition hover:scale-[1.02]`}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-sm font-medium uppercase tracking-wide">
                {card.title}
              </h3>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </section>

        {/* Data Visualization Charts */}
        <DashboardCharts bookingData={bookingData} roomData={roomData} />

        {/* Recent Orders Table */}
        <section className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left">Booking ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Room</th>
                  <th className="px-6 py-3 text-left">Check-in Date</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookingData?.slice(0, 5).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.roomName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(item.checkInDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.paymentStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.paymentStatus ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
});

export default Dashboard;