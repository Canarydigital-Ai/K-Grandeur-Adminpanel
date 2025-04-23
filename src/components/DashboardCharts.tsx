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
  
  // Modern color theme
  const CHART_COLORS = {
    bookings: '#8884d8',      // Purple for bookings
    revenue: '#82ca9d',       // Green for revenue
    paid: '#4cc9f0',          // Light blue for paid
    unpaid: '#f72585',        // Pink for unpaid
    gridLines: '#f0f0f0',     // Light gray for grid lines
    textColor: '#333333'      // Dark gray for text
  };

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
      
      // Sort rooms by bookings count
      setRoomDistribution(Object.values(roomStats).sort((a, b) => b.bookings - a.bookings));

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

      // Calculate percentages for payment status
      const totalValue = paymentStats.paid.value + paymentStats.unpaid.value;
      const paidPercentage = Math.round((paymentStats.paid.value / totalValue) * 100);
      const unpaidPercentage = Math.round((paymentStats.unpaid.value / totalValue) * 100);
      
      // Format values for the pie chart labels
      const formattedPaid = formatCurrency(paymentStats.paid.value);
      const formattedUnpaid = formatCurrency(paymentStats.unpaid.value);
      
      setPaymentStatusData([
        { 
          name: 'Paid', 
          count: paymentStats.paid.count, 
          value: paymentStats.paid.value,
          percentage: paidPercentage,
          displayName: `Paid: ${formattedPaid}`
        },
        { 
          name: 'Unpaid', 
          count: paymentStats.unpaid.count, 
          value: paymentStats.unpaid.value,
          percentage: unpaidPercentage,
          displayName: `Unpaid: ${formattedUnpaid}`
        }
      ]);
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

  // Enhanced custom tooltip
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
    
    const formattedValue = formatCurrency(value);
    const displayText = `${name}: ${(percent * 100).toFixed(0)}% (${formattedValue})`;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs"
      >
        {displayText}
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
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridLines} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: CHART_COLORS.textColor }}
            />
            <YAxis 
              yAxisId="left" 
              tick={{ fill: CHART_COLORS.textColor }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fill: CHART_COLORS.textColor }}
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bookings"
              name="Bookings"
              stroke={CHART_COLORS.bookings}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue (₹)"
              stroke={CHART_COLORS.revenue}
              strokeWidth={2}
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
            margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            barSize={30}
            barGap={15}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridLines} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: CHART_COLORS.textColor }}
              interval={0}
              angle={0}
              textAnchor="middle"
              height={40}
            />
            <YAxis 
              yAxisId="left" 
              tick={{ fill: CHART_COLORS.textColor }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fill: CHART_COLORS.textColor }}
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="bookings"
              name="Number of Bookings"
              fill={CHART_COLORS.bookings}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              name="Revenue (₹)"
              fill={CHART_COLORS.revenue}
              radius={[4, 4, 0, 0]}
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
              innerRadius={40} // Donut chart effect
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              <Cell key="cell-0" fill={CHART_COLORS.paid} />
              <Cell key="cell-1" fill={CHART_COLORS.unpaid} />
            </Pie>
            <Tooltip formatter={(value:any) => formatCurrency(value as number)} />
            <Legend 
  formatter={( entry) => entry.payload?.value || 'Unknown'}
  layout="vertical"
  verticalAlign="middle"
  align="right"
/>
          </PieChart>
        </ResponsiveContainer>
        {/* Bottom status cards */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {paymentStatusData.map((item, index) => (
            <div 
              key={index} 
              className="text-center p-2 rounded-md" 
              style={{ 
                backgroundColor: index === 0 ? 'rgba(76, 201, 240, 0.1)' : 'rgba(247, 37, 133, 0.1)'
              }}
            >
              <div 
                className="text-2xl font-bold" 
                style={{ 
                  color: index === 0 ? CHART_COLORS.paid : CHART_COLORS.unpaid 
                }}
              >
                {item.count}
              </div>
              <div className="text-sm text-gray-600">
                {item.name} Bookings
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;