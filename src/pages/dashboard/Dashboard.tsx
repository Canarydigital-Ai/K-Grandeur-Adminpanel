import React, { memo, useEffect, useState } from "react";
import { getAllBookings } from "../../api/services/bookingService";
import { toast } from "react-toastify";
import { getRoom } from "../../api/services/RoomService";


const Dashboard: React.FC = memo(() => {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [bookingCount, setBookingCount] = useState<number>();
  const [roomCount, setRoomCount] = useState();
  const [customerCount, setCustomerCount] = useState(0);
  const [revenue, setRevenue] = useState();

  useEffect(() => {
    const fetchAllBookings = async () => {
      setLoading(true);
      try {
        const data: any[] = await getAllBookings();
        console.log(data, "///////////////////////////");

        const uniqueEmails = new Set(data.map((booking: any) => booking.email));
        const totalRevenue = data.reduce(
          (acc, booking) => acc + booking.totalAmount,
          0
        );
        setBookingData(data);
        setBookingCount(data.length);
        setCustomerCount(uniqueEmails.size);
        setRevenue(totalRevenue);
      } catch (error) {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  useEffect(() => {
    const fetchAllRooms = async () => {
      setLoading(true);
      try {
        const data: any[] = await getRoom();
        console.log(data, ".......................................");

        // Sum up roomcount from all room objects
        const totalRoomCount = data.reduce(
          (acc, room) => acc + (room.roomcount || 0),
          0
        );
        setRoomCount(totalRoomCount);
      } catch (error) {
        toast.error("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchAllRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
      </div>
    );
  }

  return (
    <>
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
            value: revenue,
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
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookingData?.slice(0, 3).map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">{item._id}</td>
                  <td className="px-6 py-4 text-sm">{item.firstName}</td>
                  <td className="px-6 py-4 text-sm">{item.checkInDate}</td>
                  <td className="px-6 py-4 text-sm">{item.totalAmount}</td>
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
