import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_COMPLETEDBOOKINGS } from "../../utils/queries";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import PayPalPaymentModal from "../../components/PayPalPaymentModal/PayPalPaymentModal";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import ConfirmationBox from "../../components/ConfirmationBoxComponent/ConfirmationBox";
import SnackBar from "../../components/SnackBarComponent/SnackBar";
import {
  FaTrash,
  FaHistory,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaChevronRight,
  FaInfoCircle,
  FaCreditCard,
  FaRedo,
} from "react-icons/fa";

const BookingHistoryPage = () => {
  const { loading, error, data, refetch } = useQuery(QUERY_COMPLETEDBOOKINGS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [deletedBookings, setDeletedBookings] = useState([]);
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  useEffect(() => {
    const savedDeleted = localStorage.getItem("deletedBookings");
    if (savedDeleted) {
      setDeletedBookings(JSON.parse(savedDeleted));
    }
  }, []);

  const showSnack = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  const handleDeleteBooking = (bookingId) => {
    const newDeleted = [...deletedBookings, bookingId];
    setDeletedBookings(newDeleted);
    localStorage.setItem("deletedBookings", JSON.stringify(newDeleted));
    setDialogOpen(false);
    showSnack("Booking removed from history successfully!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 bg-zinc-950 text-red-500">
        <p className="text-xl">Error loading your booking history</p>
        <p className="mt-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );

  const bookings = (data?.getCompletedBookings || [])
    .filter((booking) => !deletedBookings.includes(booking.id))
    .map((booking) => ({
      ...booking,
      time: dayjs(`2023-01-01T${booking.time}`).format("HH:mm"),
      formattedDate: dayjs(booking.date).format("MMMM D, YYYY"),
    }));

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 relative inline-block underline decoration-orange-600">
            Your Adventure History
          </h1>
          <p className="text-lg text-slate-300">
            Relive your past quest room experiences
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 rounded-xl shadow-lg">
            <FaHistory className="mx-auto text-6xl text-orange-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No Quests Completed Yet
            </h2>
            <p className="text-slate-300 mb-6">
              Your completed quest room adventures will appear here
            </p>
            <Link
              to="/escaperooms"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Explore Quest Rooms
              <FaChevronRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col h-full bg-zinc-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
              >
                <button
                  onClick={() => {
                    setDialogOpen(true);
                    setCurrentBookingId(booking.id);
                  }}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 bg-zinc-800 bg-opacity-80 p-2 rounded-full transition duration-300 z-10 hover:scale-110"
                  aria-label="Delete"
                  title="Remove from history"
                >
                  <FaTrash className="w-4 h-4" />
                </button>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={booking.escaperoom.image_url}
                    alt={booking.escaperoom.theme}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <div className="min-h-[3.5rem] mb-2">
                    <h2 className="text-xl font-bold line-clamp-2">
                      {booking.escaperoom.theme}
                    </h2>
                  </div>

                  <div className="space-y-3 text-slate-300 flex-grow">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-orange-500 mr-2 min-w-[16px]" />
                      <span className="truncate">{booking.formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-orange-500 mr-2 min-w-[16px]" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="text-orange-500 mr-2 min-w-[16px]" />
                      <span>
                        {booking.numberOfPlayers} player
                        {booking.numberOfPlayers !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-orange-500 mr-2 min-w-[16px]" />
                      <span>{booking.payment_amount} UAH</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 space-y-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowPaymentModal(true);
                      }}
                      className="group relative flex items-center justify-center w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center">
                        <FaCreditCard className="mr-2 min-w-[16px]" />
                        Payment Details
                      </span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    </button>

                    <Link
                      to={`/booking/${booking.escape_room_id}`}
                      className="group relative flex items-center justify-center w-full py-3 px-6 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center">
                        <FaRedo className="mr-2 min-w-[16px]" />
                        Book Again
                      </span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPaymentModal && selectedBooking && (
          <PayPalPaymentModal
            amount={selectedBooking.payment_amount}
            onClose={() => setShowPaymentModal(false)}
            bookingId={selectedBooking.id}
            bookingStatus={selectedBooking.payment_status}
          />
        )}

        {dialogOpen && (
          <ConfirmationBox
            setDialogOpen={setDialogOpen}
            deleteBooking={handleDeleteBooking}
            currentBookingId={currentBookingId}
            message="Are you sure you want to remove this quest from your history?"
            isHistory={true}
          />
        )}

        {snackbar.show && <SnackBar message={snackbar.message} />}
      </div>
    </div>
  );
};

export default ScrollToTop(BookingHistoryPage);
