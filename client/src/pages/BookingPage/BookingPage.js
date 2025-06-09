import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ESCAPEROOM } from "../../utils/queries";
import BookingFormComponent from "../../components/BookingFormComponent/BookingForm";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import BookingConfirmationComponent from "../../components/BookingConfirmationComponent/BookingConfirmationComponent";
import ReviewForm from "../../components/ReviewForm/ReviewForm";
import ReviewList from "../../components/ReviewList/ReviewList";
import BookingCalendar from "../../components/BookingCalendar/BookingCalendar";
import StarRating from "../../components/StarRating/StarRating";
import {
  FaTheaterMasks,
  FaTrophy,
  FaUserFriends,
  FaMoneyBillWave,
  FaClock,
  FaChild,
} from "react-icons/fa";

const BookingPage = () => {
  const { roomId } = useParams();
  const roomID = parseInt(roomId, 10);

  const [confirmationPage, setConfirmationPage] = useState(false);
  const [formData, setFormData] = useState({
    escape_room_id: roomID,
    numberOfPlayers: 1,
    date: "",
    time: "",
  });

  const { loading, data, refetch } = useQuery(QUERY_ESCAPEROOM, {
    variables: { id: roomID },
  });

  const escapeRoom = data?.getEscapeRoom || {};

  useEffect(() => {
    if (escapeRoom) {
      setFormData((prev) => ({
        ...prev,
        numberOfPlayers: escapeRoom.playersMin,
      }));
    }
  }, [escapeRoom]);

  const handleSlotSelect = (slot) => {
    setFormData({
      ...formData,
      date: slot.date,
      time: slot.time,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 mx-auto px-6 py-12 md:px-12 lg:px-12">
      {!confirmationPage ? (
        <>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-4 relative inline-block underline decoration-orange-600">
                {escapeRoom.theme}
              </h1>

              <img
                src={escapeRoom.image_url}
                alt={escapeRoom.theme}
                className="w-full h-auto rounded-lg mb-4"
              />

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-xl font-semibold">Description</h2>
                  <StarRating
                    rating={escapeRoom.averageRating}
                    isEditable={false}
                  />
                </div>
                <p>{escapeRoom.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <FaTheaterMasks className="text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Genre</h3>
                    <p>{escapeRoom.genre}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaTrophy className="text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Difficulty</h3>
                    <p>{escapeRoom.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaChild className="text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Age Group</h3>
                    <p>{escapeRoom.ageGroup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaClock className="text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p>{escapeRoom.duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaUserFriends className="text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Players</h3>
                    <p>
                      {escapeRoom.playersMin}-{escapeRoom.playersMax}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaMoneyBillWave className="text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Price</h3>
                    <p>{escapeRoom.price} UAH per player</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Book Your Adventure</h2>

              <div className="mb-8">
                <BookingCalendar
                  escapeRoomId={roomID}
                  duration={escapeRoom.duration}
                  onSelectSlot={handleSlotSelect}
                />
              </div>

              <BookingFormComponent
                formData={formData}
                setFormData={setFormData}
                setConfirmationPage={setConfirmationPage}
                escapeRoom={escapeRoom}
              />
            </div>
          </div>

          <div className="mt-16">
            <ReviewForm escapeRoomId={roomID} refetch={refetch} />
            <ReviewList reviews={escapeRoom.reviews} />
          </div>
        </>
      ) : (
        <BookingConfirmationComponent
          bookingDetails={{
            escapeRoomTheme: escapeRoom.theme,
            escapeRoomImage: escapeRoom.image_url,
            description: escapeRoom.description,
            numberOfPlayers: formData.numberOfPlayers,
            price: escapeRoom.price,
            date: formData.date,
            time: formData.time,
          }}
          setConfirmationPage={setConfirmationPage}
        />
      )}
    </div>
  );
};

export default ScrollToTop(BookingPage);
