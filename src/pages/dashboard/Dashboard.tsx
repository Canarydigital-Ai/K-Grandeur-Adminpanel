import React, { memo } from "react";

const Dashboard: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800">Admin Dashboard</h1>
      </header>

      {/* Dashboard Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[ 
          { title: "Total Bookings", value: "120", icon: "📘", color: "bg-blue-100 text-blue-800" },
          { title: "Total Rooms", value: "35", icon: "🛏️", color: "bg-purple-100 text-purple-800" },
          { title: "Total Customers", value: "540", icon: "👥", color: "bg-green-100 text-green-800" },
          { title: "Revenue", value: "₹1,20,000", icon: "💰", color: "bg-yellow-100 text-yellow-800" }
        ].map((card, idx) => (
          <div key={idx} className={`p-5 rounded-xl shadow-md ${card.color} transition hover:scale-[1.02]`}>
            <div className="text-4xl mb-3">{card.icon}</div>
            <h3 className="text-sm font-medium uppercase tracking-wide">{card.title}</h3>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </section>

      {/* Recent Orders Table */}
      <section className="mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
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
              {[
                { id: "B001", customer: "Akhil M", date: "2025-04-15", amount: "₹4,500", status: "Confirmed", color: "green" },
                { id: "B002", customer: "Neha S", date: "2025-04-14", amount: "₹2,800", status: "Pending", color: "yellow" },
                { id: "B003", customer: "Rahul V", date: "2025-04-13", amount: "₹6,000", status: "Cancelled", color: "red" }
              ].map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">{item.id}</td>
                  <td className="px-6 py-4 text-sm">{item.customer}</td>
                  <td className="px-6 py-4 text-sm">{item.date}</td>
                  <td className="px-6 py-4 text-sm">{item.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-800`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
});

export default Dashboard;