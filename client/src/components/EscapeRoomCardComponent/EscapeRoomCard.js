import { Link } from "react-router-dom";
import StarRating from "../StarRating/StarRating";
import {
  FaTheaterMasks,
  FaTrophy,
  FaUserFriends,
  FaMoneyBillWave,
  FaClock,
  FaChild,
} from "react-icons/fa";

const EscapeRoomCard = ({ room }) => {
  return (
    <Link
      to={`/booking/${room.id}`}
      className="rounded-xl mt-10 mb-10 flex flex-col justify-between bg-cover bg-center relative overflow-hidden h-full block hover:scale-105 transition-transform duration-300"
      style={{ backgroundImage: `url(${room.image_url})` }}
    >
      <div className="absolute rounded-xl bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 hover:bg-opacity-40 transition-all duration-300"></div>

      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <img
          src={room.image_url}
          alt={room.theme}
          className="h-52 w-11/12 object-cover mb-5 rounded mx-auto drop-shadow-xl"
        />

        <div>
          <h3 className="text-2xl font-bold mb-1 underline decoration-orange-600 drop-shadow-lg text-white">
            {room.theme}
          </h3>
          <div className="mb-2">
            <StarRating rating={room.averageRating} isEditable={false} />
          </div>

          <div className="flex items-center mb-1">
            <FaTheaterMasks className="text-orange-500 mr-2" />
            <p className="text-lg drop-shadow-lg text-white">
              Genre: {room.genre}
            </p>
          </div>

          <div className="flex items-center mb-1">
            <FaTrophy className="text-orange-500 mr-2" />
            <p className="text-lg drop-shadow-lg text-white">
              Difficulty: {room.difficulty}
            </p>
          </div>

          <div className="flex items-center mb-1">
            <FaChild className="text-orange-500 mr-2" />
            <p className="text-lg drop-shadow-lg text-white">
              Age: {room.ageGroup}
            </p>
          </div>

          <div className="flex items-center mb-1">
            <FaUserFriends className="text-orange-500 mr-2" />
            <p className="text-lg drop-shadow-lg text-white">
              Players: {room.playersMin}-{room.playersMax}
            </p>
          </div>

          <div className="flex items-center mb-1">
            <FaMoneyBillWave className="text-orange-500 mr-2" />
            <p className="text-lg drop-shadow-lg text-white">
              Price: {room.price} UAH per player
            </p>
          </div>

          <div className="flex items-center mb-1">
            <FaClock className="text-orange-500 mr-2" />
            <p className="text-lg drop-shadow-lg text-white">
              Duration: {room.duration}min
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EscapeRoomCard;
