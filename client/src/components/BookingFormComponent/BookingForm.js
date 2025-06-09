import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../utils/mutations";
import dayjs from "dayjs";
import SnackBar from "../SnackBarComponent/SnackBar";
import { useUserBookingsContext } from "../../utils/UserBookingsContext";

const BookingForm = ({
  formData,
  setFormData,
  setConfirmationPage,
  escapeRoom,
}) => {
  const { createABooking } = useUserBookingsContext();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createBooking] = useMutation(CREATE_BOOKING);

  useEffect(() => {
    if (escapeRoom) {
      const options = [];
      for (let i = escapeRoom.playersMin; i <= escapeRoom.playersMax; i++) {
        options.push(i);
      }
      setPlayerOptions(options);
    }
  }, [escapeRoom]);

  const openSnackBar = (
    message = "Something went wrong. Please try again."
  ) => {
    setShowSnackBar(true);
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10),
    });
  };

  const calculateTotalPrice = () => {
    if (!escapeRoom) return 0;
    return escapeRoom.price * formData.numberOfPlayers;
  };

  const handleTimeSlotClick = (time) => {
    if (formData.time === time) {
      setFormData({
        ...formData,
        time: "",
      });
    } else {
      setFormData({
        ...formData,
        time: time,
      });
    }
  };

  const bookRoom = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.date || !formData.time) {
      openSnackBar("Please select a date and time for your booking");
      setIsSubmitting(false);
      return;
    }

    try {
      await createABooking({
        escape_room_id: formData.escape_room_id,
        numberOfPlayers: formData.numberOfPlayers,
        date: formData.date,
        time: formData.time,
      });

      setConfirmationPage(true);
    } catch (err) {
      console.error("Booking failed:", err);
      openSnackBar(
        err.message || "Failed to create booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
      <form id="booking-form" onSubmit={bookRoom}>
        <div className="mb-6">
          <label className="block text-slate-100 text-lg font-bold mb-2">
            Number of Players:
          </label>
          <div className="flex items-center space-x-2">
            {playerOptions.map((num) => (
              <button
                key={num}
                type="button"
                className={`rounded-full w-12 h-12 flex items-center justify-center transition-colors ${
                  formData.numberOfPlayers === num
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-800 text-slate-100 hover:bg-zinc-700"
                }`}
                onClick={() =>
                  setFormData({ ...formData, numberOfPlayers: num })
                }
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-100 text-lg font-bold mb-2">
            Price Calculation:
          </label>
          <div className="bg-zinc-950 p-3 rounded">
            <p className="text-slate-100">
              {escapeRoom?.price || 0} UAH × {formData.numberOfPlayers} players
              = {calculateTotalPrice()} UAH
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-100 text-lg font-bold mb-2">
            Selected Time Slot:
          </label>
          <div className="bg-zinc-950 p-3 rounded">
            {formData.date && formData.time ? (
              <p className="text-slate-100">
                {dayjs(formData.date).format("MMMM D, YYYY")} at{" "}
                {formData.time.split(":").slice(0, 2).join(":")}
              </p>
            ) : (
              <p className="text-orange-400">Please select a time slot</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className={`w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
              formData.date && formData.time
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={isSubmitting || !formData.date || !formData.time}
          >
            {isSubmitting
              ? "Booking..."
              : formData.date && formData.time
              ? `Confirm Booking for ${calculateTotalPrice()} UAH`
              : "Please select time slot"}
          </button>
        </div>
      </form>

      {showSnackBar && (
        <SnackBar message="Please select a date and time for your booking" />
      )}
    </div>
  );
};

export default BookingForm;
