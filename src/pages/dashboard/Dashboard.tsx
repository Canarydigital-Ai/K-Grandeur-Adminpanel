import React, { memo } from "react";

const Dashboard: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
   
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Bookings", value: "₹12,345", change: "+12%" },
          { title: "Total Rooms", value: "1,234", change: "+8%" },
          { title: "Total Products", value: "567", change: "+5%" },
          { title: "Total Customers", value: "4,321", change: "+10%" },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">{item.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <table className="w-full mt-4">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
                <th className="py-2">PyamentStatus</th>
              </tr>
            </thead>


            <tbody>
              {[
                {
                  id: "#12345",
                  name: "John Doe",
                  date: "2025-02-10",
                  amount: "₹199.99",
                  paymentstatus: "Delivered",
                  statusColor: "green",
                },
                {
                  id: "#12346",
                  name: "Jane Smith",
                  date: "2025-02-09",
                  amount: "₹299.99",
                  paymentstatus: "Pending",
                  statusColor: "yellow",
                },
                {
                  id: "#12347",
                  name: "Alice Johnson",
                  date: "2025-02-08",
                  amount: "₹99.99",
                  paymentstatus: "Cancelled",
                  statusColor: "red",
                },
              ].map((order, index) => (
                <tr key={index} className="border-b border-black/30">
                  <td className="py-4">{order.id}</td>
                  <td className="py-4">{order.name}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.amount}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 bg-${order.statusColor}-500 text-${order.statusColor}-800 rounded-full text-sm`}
                    >
                      {order.paymentstatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
