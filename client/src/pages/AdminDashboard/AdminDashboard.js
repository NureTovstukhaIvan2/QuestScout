import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  QUERY_ALLBOOKINGS,
  QUERY_ALLUSERS,
  QUERY_AllESCAPEROOMS,
  QUERY_ALLREVIEWS,
} from "../../utils/queries";
import {
  FaDoorOpen,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminDashboard = () => {
  const { data: roomsData } = useQuery(QUERY_AllESCAPEROOMS);
  const { data: bookingsData } = useQuery(QUERY_ALLBOOKINGS);
  const { data: usersData } = useQuery(QUERY_ALLUSERS);
  const { data: reviewsData } = useQuery(QUERY_ALLREVIEWS);

  const rooms = roomsData?.getAllEscapeRooms || [];
  const bookings = bookingsData?.getAllBookings || [];
  const users = usersData?.getAllUsers || [];
  const reviews = reviewsData?.getAllReviews || [];

  const topRoomsData = [...rooms]
    .map((room) => {
      const roomBookings = bookings.filter(
        (b) => b.escaperoom.theme === room.theme
      ).length;
      return {
        name: room.theme,
        bookings: roomBookings,
        revenue: roomBookings * room.price,
      };
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const monthlyRevenueData = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();

      const monthBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return (
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getFullYear() === date.getFullYear() &&
          booking.payment_status === "completed"
        );
      });

      const revenue = monthBookings.reduce((sum, booking) => {
        return (
          sum +
          (booking.payment_amount ||
            booking.escaperoom.price * booking.numberOfPlayers)
        );
      }, 0);

      months.push({
        name: `${monthName} ${year}`,
        revenue: revenue,
      });
    }

    return months;
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Site Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/rooms"
          className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:bg-zinc-800 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Manage Rooms</h2>
              <p className="text-gray-400">
                Create, edit and delete quest rooms
              </p>
            </div>
            <div className="text-orange-600 group-hover:translate-x-1 transition-transform">
              <FaArrowRight className="text-2xl" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:bg-zinc-800 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Manage Bookings</h2>
              <p className="text-gray-400">View and manage all bookings</p>
            </div>
            <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
              <FaArrowRight className="text-2xl" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:bg-zinc-800 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Manage Users</h2>
              <p className="text-gray-400">View and manage user accounts</p>
            </div>
            <div className="text-green-600 group-hover:translate-x-1 transition-transform">
              <FaArrowRight className="text-2xl" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/reviews"
          className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:bg-zinc-800 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Manage Reviews</h2>
              <p className="text-gray-400">View and respond to reviews</p>
            </div>
            <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
              <FaArrowRight className="text-2xl" />
            </div>
          </div>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Топ 5 квестів за бронюваннями */}
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Top 5 Rooms by Bookings
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topRoomsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9CA3AF"
                  tickFormatter={(value) => Math.floor(value)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9CA3AF"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{ color: "#F3F4F6" }}
                  formatter={(value, name) => {
                    if (name === "Bookings")
                      return [Math.floor(value), "Bookings"];
                    if (name === "Revenue")
                      return [value.toLocaleString() + " UAH", "Revenue"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill="#F97316"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Дохід по місяцям */}
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Revenue Last 6 Months</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenueData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{ color: "#F3F4F6" }}
                  formatter={(value) => [
                    value.toLocaleString() + " UAH",
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* General Info Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">
                Total Rooms
              </h3>
              <p className="text-3xl font-bold">{rooms.length}</p>
            </div>
            <div className="bg-orange-600 p-3 rounded-full">
              <FaDoorOpen className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold">{bookings.length}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full">
              <FaCalendarAlt className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">
                Total Users
              </h3>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-full">
              <FaUsers className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-400">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold">
                {bookings
                  .filter((b) => b.payment_status === "completed")
                  .reduce(
                    (sum, booking) =>
                      sum +
                      (booking.payment_amount ||
                        booking.escaperoom.price * booking.numberOfPlayers),
                    0
                  )
                  .toLocaleString()}{" "}
                UAH
              </p>
            </div>
            <div className="bg-purple-600 p-3 rounded-full">
              <FaMoneyBillWave className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800"
                >
                  <td className="px-4 py-3">{booking.escaperoom.theme}</td>
                  <td className="px-4 py-3">
                    {booking.user.firstName} {booking.user.lastName}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(booking.date).toLocaleDateString()}{" "}
                    {booking.time.substring(0, 5)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.payment_status === "completed"
                          ? "bg-green-900 text-green-300"
                          : booking.payment_status === "pending"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(
                      booking.payment_amount ||
                      booking.escaperoom.price * booking.numberOfPlayers
                    ).toLocaleString()}{" "}
                    UAH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
