import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTopWrapper/ScrollToTopWrapper";
import dayjs from "dayjs";

const BookingConfirmationComponent = ({
  bookingDetails,
  setConfirmationPage,
}) => {
  const totalPrice = bookingDetails.price * bookingDetails.numberOfPlayers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-zinc-700/50">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block relative">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent pb-1">
                Booking Confirmed!
              </h1>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-transparent rounded-full"></div>
            </div>
            <p className="text-lg md:text-xl text-slate-300 mt-4">
              Thank you for booking your quest room adventure!
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Room Info */}
            <div className="lg:w-1/2">
              <div className="bg-zinc-900/80 rounded-xl p-6 h-full">
                <h2 className="text-2xl font-bold mb-4 text-orange-400">
                  {bookingDetails.escapeRoomTheme}
                </h2>
                <img
                  src={bookingDetails.escapeRoomImage}
                  alt="quest room"
                  className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                />
                <p className="text-slate-300 mb-6">
                  {bookingDetails.description}
                </p>
              </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className="lg:w-1/2">
              <div className="bg-zinc-900/80 rounded-xl p-6 h-full">
                <h3 className="text-xl font-semibold mb-6 text-center border-b border-zinc-700 pb-3">
                  Booking Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span className="text-slate-300">Players:</span>
                    <span className="font-medium">
                      {bookingDetails.numberOfPlayers}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span className="text-slate-300">Price per player:</span>
                    <span className="font-medium">
                      {bookingDetails.price} UAH
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span className="text-slate-300">Total price:</span>
                    <span className="font-medium text-orange-400">
                      {totalPrice} UAH
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span className="text-slate-300">Date:</span>
                    <span className="font-medium">
                      {dayjs(bookingDetails.date).format("MMMM D, YYYY")}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-700 pb-2">
                    <span className="text-slate-300">Time:</span>
                    <span className="font-medium">
                      {dayjs(`2023-01-01T${bookingDetails.time}`).format(
                        "h:mm A"
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-10 text-center">
                  <p className="text-slate-300 mb-6">
                    We look forward to seeing you! If you have any questions or
                    need to make changes, please contact us.
                  </p>
                  <Link
                    to="/mybookings"
                    onClick={() => setConfirmationPage(false)}
                    className="inline-block bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    View My Bookings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollToTop(BookingConfirmationComponent);
