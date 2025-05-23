import { useState } from "react";
import PayPalPaymentModal from "../PayPalPaymentModal/PayPalPaymentModal";

const BookingComponent = ({ booking, setDialogOpen, setCurrentBookingId }) => {
  const totalPrice = booking.escaperoom.price * booking.numberOfPlayers;
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="p-4 flex flex-col justify-between">
      <h2 className="text-2xl font-bold mb-2 underline decoration-orange-600 drop-shadow-lg">
        {booking.escaperoom.theme}
      </h2>
      <img
        src={booking.escaperoom.image_url}
        alt="escape room"
        className="h-52 w-11/12 object-cover mb-5 rounded mx-auto drop-shadow-xl"
      />
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Genre:</p>
        <p className="text-right ml-2">{booking.escaperoom.genre}</p>
      </div>
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Age Group:</p>
        <p className="text-right ml-2">{booking.escaperoom.ageGroup}</p>
      </div>
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Players:</p>
        <p className="text-right ml-2">
          {booking.numberOfPlayers}/{booking.escaperoom.playersMax}
        </p>
      </div>
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Price per player:</p>
        <p className="text-right ml-2">{booking.escaperoom.price} UAH</p>
      </div>
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Total price:</p>
        <p className="text-right ml-2">{totalPrice} UAH</p>
      </div>
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Date:</p>
        <p className="text-right ml-2">{booking.date}</p>
      </div>
      <div className="flex text-center items-start justify-between mb-2 mx-2">
        <p className="font-semibold text-lg">Time:</p>
        <p className="text-right ml-2">{booking.time}</p>
      </div>
      <div className="flex text-center items-start justify-between mb-3 mx-2">
        <p className="font-semibold text-lg">Duration:</p>
        <p className="text-right ml-2">{booking.escaperoom.duration} min</p>
      </div>
      <div className="text-center mb-2 mx-2">
        <p className="">{booking.escaperoom.description}</p>
      </div>
      <div className="text-center mt-5 space-y-3">
        <button
          className={`py-2 px-4 ${
            booking.payment_status === "completed"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-slate-100 rounded-lg w-full`}
          onClick={() => setShowPaymentModal(true)}
        >
          {booking.payment_status === "completed"
            ? "View Payment Details"
            : "Pay with PayPal"}
        </button>
        <button
          className="py-2 px-4 bg-orange-600 text-slate-100 hover:bg-orange-700 rounded-lg w-full"
          onClick={() => {
            setDialogOpen(true);
            setCurrentBookingId(booking.id);
          }}
        >
          Cancel booking
        </button>
      </div>
      <div className="border-2 border-orange-600 mt-14 w-4/5 mx-auto"></div>

      {showPaymentModal && (
        <PayPalPaymentModal
          amount={totalPrice}
          onClose={() => setShowPaymentModal(false)}
          bookingId={booking.id}
          bookingStatus={booking.payment_status}
        />
      )}
    </div>
  );
};

export default BookingComponent;
