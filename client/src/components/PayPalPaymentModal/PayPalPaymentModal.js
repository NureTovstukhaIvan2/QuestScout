import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_BOOKING_PAYMENT } from "../../utils/mutations";
import { QUERY_SINGLEBOOKING } from "../../utils/queries";

const PayPalPaymentModal = ({ amount, onClose, bookingId, bookingStatus }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [updateBookingPayment] = useMutation(UPDATE_BOOKING_PAYMENT);

  const { data: bookingData } = useQuery(QUERY_SINGLEBOOKING, {
    variables: { booking_id: bookingId },
  });

  const bookingDate = bookingData?.getSingleBooking?.date || "";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (bookingStatus === "completed") {
      setPaymentSuccess(true);
    }
  }, [bookingStatus]);

  const validateCardNumber = (value) => {
    const regex = /^[0-9]{0,16}$/;
    return regex.test(value);
  };

  const validateExpiryDate = (value) => {
    if (value.length > 5) return false;
    if (value.length === 2 && !value.includes("/")) {
      return false;
    }
    return true;
  };

  const formatExpiryDate = (value) => {
    if (value.length === 2 && !value.includes("/")) {
      return value + "/";
    }
    return value;
  };

  const validateCVV = (value) => {
    const regex = /^[0-9]{0,3}$/;
    return regex.test(value);
  };

  const validateName = (value) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cardNumber || cardNumber.length !== 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!expiryDate || expiryDate.length !== 5) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = "Please enter a valid month (01-12)";
      } else if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = "Please enter a valid 3-digit CVV";
    }

    if (!name || !name.trim()) {
      newErrors.name = "Please enter the name on card";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await updateBookingPayment({
        variables: {
          booking_id: bookingId,
          payment_status: "completed",
          payment_amount: amount,
          payment_method: "PayPal",
        },
      });

      setIsProcessing(false);
      setPaymentSuccess(true);
      setShowSuccessMessage(true);
    } catch (err) {
      console.error("Payment failed:", err);
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (validateName(value)) {
      setName(value);
    }
  };

  const handleViewDetails = () => {
    setShowSuccessMessage(false);
    setShowPaymentDetails(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            {paymentSuccess ? "Payment Details" : "PayPal Payment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-black"
          >
            &times;
          </button>
        </div>

        {showSuccessMessage ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2 text-black">
              Payment Successful!
            </h3>
            <p className="text-black mb-4">
              Your payment of {amount} UAH has been processed.
            </p>
            <button
              onClick={handleViewDetails}
              className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            >
              View Payment Details
            </button>
          </div>
        ) : showPaymentDetails || paymentSuccess ? (
          <div className="py-4">
            <h3 className="text-lg font-bold mb-4 text-black">
              Payment Details
            </h3>
            <div className="space-y-2 text-black">
              <p>
                <strong>Booking ID:</strong> {bookingId}
              </p>
              <p>
                <strong>Amount:</strong> {amount} UAH
              </p>
              <p>
                <strong>Payment Method:</strong> PayPal
              </p>
              <p>
                <strong>Status:</strong> Completed
              </p>
              <p>
                <strong>Date:</strong> {formatDate(bookingDate)}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between mb-2 text-black">
                <span className="font-semibold">Booking ID:</span>
                <span>{bookingId}</span>
              </div>
              <div className="flex justify-between text-black">
                <span className="font-semibold">Amount to pay:</span>
                <span className="text-lg font-bold">{amount} UAH</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-2 text-black"
                  htmlFor="cardNumber"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  className={`w-full px-3 py-2 border rounded-lg text-black ${
                    errors.cardNumber ? "border-red-500" : ""
                  }`}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber.replace(/(\d{4})/g, "$1 ").trim()}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 mb-2 text-black"
                    htmlFor="expiryDate"
                  >
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    className={`w-full px-3 py-2 border rounded-lg text-black ${
                      errors.expiryDate ? "border-red-500" : ""
                    }`}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    required
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-2 text-black"
                    htmlFor="cvv"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    className={`w-full px-3 py-2 border rounded-lg text-black ${
                      errors.cvv ? "border-red-500" : ""
                    }`}
                    placeholder="123"
                    value={cvv}
                    onChange={handleCVVChange}
                    maxLength={3}
                    required
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 mb-2 text-black"
                  htmlFor="name"
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-3 py-2 border rounded-lg text-black ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="John Doe"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-bold text-white ${
                  isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isProcessing || paymentSuccess}
              >
                {isProcessing
                  ? "Processing..."
                  : paymentSuccess
                  ? "Payment Completed"
                  : `Pay ${amount} UAH`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PayPalPaymentModal;
