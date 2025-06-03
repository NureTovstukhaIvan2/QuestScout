import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ALLBOOKINGS } from "../../utils/queries";
import { UPDATE_BOOKING, DELETE_BOOKING } from "../../utils/mutations";
import { format } from "date-fns";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const ManageBookings = () => {
  const { loading, error, data, refetch } = useQuery(QUERY_ALLBOOKINGS);
  const [updateBooking] = useMutation(UPDATE_BOOKING);
  const [deleteBooking] = useMutation(DELETE_BOOKING);
  const [editingBooking, setEditingBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateBooking = async (bookingId) => {
    try {
      await updateBooking({
        variables: {
          booking_id: bookingId,
          input: {
            payment_status: paymentStatus,
          },
        },
      });
      setEditingBooking(null);
      refetch();
    } catch (err) {
      console.error("Failed to update booking:", err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking({
        variables: { booking_id: bookingId },
      });
      setConfirmDelete(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete booking:", err);
    }
  };

  const filteredBookings =
    data?.getAllBookings?.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.escaperoom.theme.toLowerCase().includes(searchLower) ||
        booking.user.firstName.toLowerCase().includes(searchLower) ||
        booking.user.lastName.toLowerCase().includes(searchLower) ||
        booking.user.email.toLowerCase().includes(searchLower) ||
        booking.payment_status.toLowerCase().includes(searchLower)
      );
    }) || [];

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <p className="text-gray-400">View and manage all bookings</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            className="bg-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Players
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Amount (UAH)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-zinc-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {booking.escaperoom.theme}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {booking.user.firstName} {booking.user.lastName}
                  <div className="text-gray-500">{booking.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {format(new Date(booking.date), "MMM d, yyyy")}
                  <div className="text-gray-500">
                    {booking.time.substring(0, 5)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {booking.numberOfPlayers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {editingBooking === booking.id ? (
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="bg-zinc-800 text-slate-100 p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.payment_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.payment_status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {booking.payment_amount ||
                    booking.escaperoom.price * booking.numberOfPlayers}{" "}
                  UAH
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingBooking === booking.id ? (
                    <>
                      <button
                        onClick={() => handleUpdateBooking(booking.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                        aria-label="Save"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => setEditingBooking(null)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : confirmDelete === booking.id ? (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="bg-gray-600 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingBooking(booking.id);
                          setPaymentStatus(booking.payment_status);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(booking.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
