import React, { useState, useEffect } from "react";
import { useUserBookingsContext } from "../../utils/UserBookingsContext";
import SnackBar from "../../components/SnackBarComponent/SnackBar";
import BookingComponent from "../../components/BookingComponent/BookingComponent";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import NoBookings from "../../components/NoBookingsComponent/NoBookings";
import ConfirmationBox from "../../components/ConfirmationBoxComponent/ConfirmationBox";

const MyBookingsPage = () => {
  const { userBookings, deleteABooking, loading, error } =
    useUserBookingsContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    message: "",
  });
  const [currentBookingId, setCurrentBookingId] = useState(null);

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
    setShowSnackBar({ show: true, message });
    setTimeout(() => {
      setShowSnackBar({ show: false, message: "" });
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

  if (loading) return <p className="text-slate-100 text-center">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-center">Error: {error.message}</p>;

  return (
    <div className="text-slate-100 min-h-screen px-5 py-10 bg-zinc-950">
      <h1 className="text-3xl font-bold mb-5 underline decoration-orange-600">
        My Bookings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-14 lg:grid-cols-3 lg:px-3">
        {userBookings?.map((booking) => (
          <BookingComponent
            key={booking.id}
            booking={booking}
            setDialogOpen={setDialogOpen}
            setCurrentBookingId={setCurrentBookingId}
          />
        ))}
      </div>

      {!userBookings.length && <NoBookings />}
      {dialogOpen && (
        <ConfirmationBox
          setDialogOpen={setDialogOpen}
          deleteBooking={deleteBooking}
          currentBookingId={currentBookingId}
        />
      )}

      {showSnackBar.show && <SnackBar message={showSnackBar.message} />}
    </div>
  );
};

export default ScrollToTop(MyBookingsPage);
