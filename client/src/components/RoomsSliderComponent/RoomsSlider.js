import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef } from "react";
import StarRating from "../StarRating/StarRating";
import { FaDoorOpen } from "react-icons/fa";

const RoomSlider = ({ escapeRooms }) => {
  const [largeScreen, setLargeScreen] = useState(null);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: escapeRooms.length > (largeScreen ? 3 : 1),
    speed: 500,
    slidesToShow: Math.min(largeScreen ? 3 : 1, escapeRooms.length),
    slidesToScroll: 1,
    arrows: escapeRooms.length > (largeScreen ? 3 : 1),
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    ref: sliderRef,
  };

  useEffect(() => {
    const handleResize = () => {
      setLargeScreen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (escapeRooms.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-900 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex flex-col items-center justify-center">
          <FaDoorOpen className="text-5xl text-orange-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No quest rooms available
          </h3>
          <p className="text-gray-400">Check back later for new adventures!</p>
        </div>
      </div>
    );
  }

  return (
    <div id="escape-rooms" className="">
      <Slider {...settings} className="mx-10 md:mx-20">
        {escapeRooms.map((room) => {
          return (
            <div id={room.theme} key={room.id} className="px-2 h-full">
              <Link
                to={`/booking/${room.id}`}
                className="flex flex-col justify-between h-full p-4 bg-zinc-900 rounded-lg hover:bg-zinc-700 transition-colors duration-300 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <div className="flex flex-col h-full">
                  <img
                    src={room.image_url}
                    alt={room.theme}
                    className="h-52 w-full object-cover mb-6 rounded-lg mx-auto"
                  />
                  <h3 className="text-xl font-bold mb-2 text-white min-h-[3.5rem] leading-snug line-clamp-2 relative inline-block underline decoration-orange-600">
                    {room.theme}
                  </h3>
                  <div className="mb-2">
                    <StarRating
                      rating={room.averageRating}
                      isEditable={false}
                    />
                  </div>
                  <div className="text-white font-bold space-y-1">
                    <p>Genre: {room.genre}</p>
                    <p>Age: {room.ageGroup}</p>
                    <p>
                      Players: {room.playersMin}-{room.playersMax}
                    </p>
                    <p>Price: {room.price} UAH</p>
                    <p>Difficulty: {room.difficulty}</p>
                    <p>Duration: {room.duration}min</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default RoomSlider;
