import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface BookingData {
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
  status?: string;
}

interface RoomData {
  _id: string;
  name: string;
  roomcount: number;
}

interface DashboardChartsProps {
  bookingData: BookingData[];
  roomData?: RoomData[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ bookingData }) => {
  const [monthlyBookings, setMonthlyBookings] = useState<any[]>([]);
  const [roomDistribution, setRoomDistribution] = useState<any[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<any[]>([]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (bookingData?.length > 0) {
      // Process data for monthly bookings chart
      const bookingsByMonth = bookingData.reduce((acc, booking) => {
        const date = new Date(booking.checkInDate);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = {
            month: monthYear,
            bookings: 0,
            revenue: 0
          };
        }
        
        acc[monthYear].bookings += 1;
        acc[monthYear].revenue += booking.totalAmount;
        
        return acc;
      }, {} as Record<string, { month: string; bookings: number; revenue: number }>);
      
      // Convert to array and sort by date
      const monthlyData = Object.values(bookingsByMonth).sort((a, b) => {
        const [monthA, yearA] = a.month.split('-');
        const [monthB, yearB] = b.month.split('-');
        return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
      });
      
      setMonthlyBookings(monthlyData);
      
      // Process data for room distribution chart
      const roomStats = bookingData.reduce((acc, booking) => {
        if (!acc[booking.roomName]) {
          acc[booking.roomName] = {
            name: booking.roomName,
            bookings: 0,
            revenue: 0
          };
        }
        
        acc[booking.roomName].bookings += 1;
        acc[booking.roomName].revenue += booking.totalAmount;
        
        return acc;
      }, {} as Record<string, { name: string; bookings: number; revenue: number }>);
      
      setRoomDistribution(Object.values(roomStats));

      // Payment status distribution
      const paymentStats = bookingData.reduce(
        (acc, booking) => {
          if (booking.paymentStatus) {
            acc.paid.count += 1;
            acc.paid.value += booking.totalAmount;
          } else {
            acc.unpaid.count += 1;
            acc.unpaid.value += booking.totalAmount;
          }
          return acc;
        },
        { 
          paid: { name: 'Paid', count: 0, value: 0 },
          unpaid: { name: 'Unpaid', count: 0, value: 0 }
        }
      );

      setPaymentStatusData([paymentStats.paid, paymentStats.unpaid]);
    }
  }, [bookingData]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart custom label
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Monthly Booking Trends */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Booking Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyBookings}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bookings"
              name="Bookings"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue (₹)"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Room Bookings Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Room Bookings & Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={roomDistribution}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="bookings"
              name="Number of Bookings"
              fill="#8884d8"
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              name="Revenue (₹)"
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Status Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentStatusData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomizedLabel}
              outerRadius={100}
              dataKey="value"
              nameKey="name"
            >
              {paymentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value:any) => formatCurrency(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;