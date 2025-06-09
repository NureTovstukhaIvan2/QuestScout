import BookingStep from "../../components/BookingStepComponent/BookingStep";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import {
  FaArrowRight,
  FaEnvelope,
  FaCheckCircle,
  FaBook,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HowToBookPage = () => {
  return (
    <div className="px-6 py-12 bg-gradient-to-b from-zinc-900 to-zinc-950 min-h-screen text-slate-100 md:px-10 xl:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-2 -left-4 w-8 h-8 bg-orange-600 rounded-full opacity-30"></div>
          <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-orange-600 rounded-full opacity-30"></div>
          <h1 className="text-4xl font-bold mb-4 relative z-10 underline decoration-orange-600">
            How to Book Your Adventure
          </h1>
          <p className="text-lg text-orange-300">
            Follow these simple steps to secure your quest room experience
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 md:px-6 lg:px-12 relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-orange-600/20 hidden md:block"></div>

          <BookingStep
            stepNumber="1"
            stepInstruction="Create an account to start the booking process."
            icon={<FaCheckCircle className="text-orange-500 text-xl" />}
          />

          <BookingStep
            stepNumber="2"
            stepInstruction="Browse our quest rooms and choose your adventure."
            icon={<FaArrowRight className="text-orange-500 text-xl" />}
          />

          <BookingStep
            stepNumber="3"
            stepInstruction="Select your preferred date, time, and number of players."
            icon={<FaArrowRight className="text-orange-500 text-xl" />}
          />

          <BookingStep
            stepNumber="4"
            stepInstruction="Confirm your booking with our secure payment system."
            icon={<FaArrowRight className="text-orange-500 text-xl" />}
          />

          <BookingStep
            stepNumber="5"
            stepInstruction="Receive instant confirmation and prepare for your adventure!"
            icon={<FaEnvelope className="text-orange-500 text-xl" />}
          />
        </div>

        {/* Action Buttons - New Design */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          <Link
            to="/rules"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-300 border border-zinc-700 hover:border-orange-500"
          >
            <FaBook className="text-orange-500 group-hover:text-orange-400 transition-colors" />
            <span className="font-medium">Rules</span>
          </Link>

          <Link
            to="/signup"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-all duration-300 shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50"
          >
            <FaUserPlus className="text-white" />
            <span className="font-medium">Sign Up</span>
          </Link>

          <Link
            to="/escaperooms"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg transition-all duration-300"
          >
            <span className="font-medium">Book Now</span>
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScrollToTop(HowToBookPage);
