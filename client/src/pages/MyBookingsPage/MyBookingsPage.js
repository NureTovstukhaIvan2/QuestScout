import React, { useState, useEffect } from "react";
import { useUserBookingsContext } from "../../utils/UserBookingsContext";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import PayPalPaymentModal from "../../components/PayPalPaymentModal/PayPalPaymentModal";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import ConfirmationBox from "../../components/ConfirmationBoxComponent/ConfirmationBox";
import SnackBar from "../../components/SnackBarComponent/SnackBar";
import {
  FaTrash,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaDoorOpen,
  FaChevronRight,
  FaInfoCircle,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

const MyBookingsPage = () => {
  const { userBookings, deleteABooking, loading, error, refetch } =
    useUserBookingsContext();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [dialogOpen]);

  const showSnack = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  const deleteBooking = async (bookingId) => {
    try {
      const success = await deleteABooking(bookingId);

      if (success) {
        showSnack("Booking cancelled successfully!");
      } else {
        showSnack("Could not cancel the booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showSnack(err.message || "Something went wrong. Please try again later.");
    }
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
        <p className="text-xl">Error loading your bookings</p>
        <p className="mt-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );

  const formattedBookings = userBookings?.map((booking) => ({
    ...booking,
    time: dayjs(`2023-01-01T${booking.time}`).format("HH:mm"),
    formattedDate: dayjs(booking.date).format("MMMM D, YYYY"),
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 relative inline-block underline decoration-orange-600">
            Your Upcoming Quests
          </h1>
          <p className="text-lg text-slate-300">
            Manage your booked quest room adventures
          </p>
        </div>

        {formattedBookings?.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 rounded-xl shadow-lg">
            <FaDoorOpen className="mx-auto text-6xl text-orange-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Active Bookings</h2>
            <p className="text-slate-300 mb-6">
              Your upcoming quest room adventures will appear here
            </p>
            <Link
              to="/escaperooms"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Book a New Quest
              <FaChevronRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formattedBookings?.map((booking) => (
              <div
                key={booking.id}
                className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
              >
                <button
                  onClick={() => {
                    setDialogOpen(true);
                    setCurrentBookingId(booking.id);
                  }}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 bg-zinc-800 bg-opacity-80 p-2 rounded-full transition duration-300 z-10 hover:scale-110"
                  aria-label="Cancel booking"
                  title="Cancel booking"
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

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 relative inline-block underline decoration-orange-600">
                    {booking.escaperoom.theme}
                  </h2>

                  <div className="space-y-3 text-slate-300">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-orange-500 mr-2" />
                      <span>{booking.formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-orange-500 mr-2" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="text-orange-500 mr-2" />
                      <span>
                        {booking.numberOfPlayers} player
                        {booking.numberOfPlayers !== 1 ? "s" : ""} (max:{" "}
                        {booking.escaperoom.playersMax})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-orange-500 mr-2" />
                      <span>
                        {booking.escaperoom.price * booking.numberOfPlayers} UAH
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowPaymentModal(true);
                      }}
                      className={`group relative flex items-center justify-center w-full py-3 px-6 rounded-lg transition-all duration-300 overflow-hidden ${
                        booking.payment_status === "completed"
                          ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      } text-white hover:shadow-lg hover:scale-[1.02]`}
                    >
                      <span className="relative z-10 flex items-center">
                        {booking.payment_status === "completed" ? (
                          <>
                            <FaCheckCircle className="mr-2" />
                            Payment Details
                          </>
                        ) : (
                          <>
                            <FaCreditCard className="mr-2" />
                            Complete Payment
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    </button>

                    <Link
                      to={`/booking/${booking.escape_room_id}`}
                      className="group relative flex items-center justify-center w-full py-3 px-6 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center">
                        <FaInfoCircle className="mr-2" />
                        View Room Details
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
            amount={
              selectedBooking.escaperoom.price * selectedBooking.numberOfPlayers
            }
            onClose={() => setShowPaymentModal(false)}
            bookingId={selectedBooking.id}
            bookingStatus={selectedBooking.payment_status}
          />
        )}

        {dialogOpen && (
          <ConfirmationBox
            setDialogOpen={setDialogOpen}
            deleteBooking={deleteBooking}
            currentBookingId={currentBookingId}
            message="Are you sure you want to cancel this booking?"
            isHistory={false}
          />
        )}

        {snackbar.show && <SnackBar message={snackbar.message} />}
      </div>
    </div>
  );
};

export default ScrollToTop(MyBookingsPage);
