import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ESCAPEROOM } from "../../utils/queries";

const BookingPage = () => {
  const { roomId } = useParams();
  const roomID = parseInt(roomId, 10);

  const [confirmationPage, setConfirmationPage] = useState(false);
  const [escapeRooms, setEscapeRooms] = useState([]);
  const [formData, setFormData] = useState({
    escape_room_id: roomID,
    escape_room_image: "",
    escape_room_description: "",
    numberOfPlayers: 1,
    date: "",
    time: "",
  });

  const { loading, data, refetch } = useQuery(QUERY_ESCAPEROOM, {
    variables: { id: roomID },
  });

  const escapeRoom = data?.getEscapeRoom || {};

  return (
    <div
      id="main"
      className="min-h-screen bg-zinc-950 text-slate-100 mx-auto px-6 py-12 md:px-12 lg:px-12"
    >
      <BookingFormComponent
        confirmationPage={confirmationPage}
        setConfirmationPage={setConfirmationPage}
        escapeRooms={escapeRooms}
        setEscapeRooms={setEscapeRooms}
        formData={formData}
        setFormData={setFormData}
      />
      {confirmationPage ? (
        <BookingConfirmationComponent
          bookingDetails={{
            escapeRoomTheme: escapeRooms.find(
              (room) => room.id === formData.escape_room_id
            )?.theme,
            escapeRoomImage: escapeRooms.find(
              (room) => room.id === formData.escape_room_id
            )?.image_url,
            description: formData.escape_room_description,
            numberOfPlayers: formData.numberOfPlayers,
            price: escapeRooms.find(
              (room) => room.id === formData.escape_room_id
            )?.price,
            date: formData.date,
            time: formData.time,
          }}
          setConfirmationPage={setConfirmationPage}
        />
      ) : (
        <>
          <ReviewForm escapeRoomId={roomID} refetch={refetch} />
          <ReviewList reviews={escapeRoom.reviews} />
        </>
      )}
    </div>
  );
};

export default ScrollToTop(BookingPage);
