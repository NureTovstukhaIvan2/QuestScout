import { useQuery } from "@apollo/client";
import { QUERY_SINGLEBOOKING } from "../../utils/queries";

const ConfirmationBox = ({
  setDialogOpen,
  deleteBooking,
  currentBookingId,
  message = "Are you sure you want to cancel your booking?",
  isHistory = false,
}) => {
  const { data } = useQuery(QUERY_SINGLEBOOKING, {
    variables: { booking_id: currentBookingId },
  });

  const booking = data?.getSingleBooking || {};
  const showRefund = !isHistory && booking.payment_status === "completed";
  const refundAmount = showRefund
    ? booking?.escaperoom?.price * booking?.numberOfPlayers || 0
    : 0;

  return (
    <div className="fixed min-h-screen inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="overscroll-contain max-h-screen text-center overflow-y-auto relative bg-zinc-800 text-slate-100 px-5 py-8 mx-2 rounded-lg shadow-lg w-full max-w-lg border border-zinc-600 flex flex-col">
        <div className="flex-grow">
          <p className="text-xl mb-4">{message}</p>
          {showRefund && refundAmount > 0 && (
            <p className="text-lg mb-4 text-green-400 font-semibold">
              {refundAmount} UAH will be refunded to your account.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="px-10 text-slate-100 py-2 bg-zinc-700 rounded-full mx-6 hover:bg-zinc-600 transition-colors duration-200"
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            No
          </button>
          <button
            className="px-10 text-slate-100 py-2 bg-orange-600 hover:bg-orange-700 rounded-full mx-6 transition-colors duration-200"
            onClick={() => {
              deleteBooking(currentBookingId);
              setDialogOpen(false);
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
