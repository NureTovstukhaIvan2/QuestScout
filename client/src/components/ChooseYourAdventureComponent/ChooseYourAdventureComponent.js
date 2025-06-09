import { Link } from "react-router-dom";
import img2 from "../../assets/welcomePageImages/escaperoomtoc.jpeg";

const ChooseYourAdventureComponent = () => {
  return (
    <div
      id="view-escaperooms-card"
      className="relative bg-zinc-950 text-slate-100 text-center lg:h-screen overflow-hidden"
    >
      {/* Фонове зображення */}
      <img
        src={img2}
        alt="quest room"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Контент по центру */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        <h1 className="text-3xl font-bold py-2 lg:text-5xl lg:drop-shadow-lg">
          Step into a World of Mystery and Mind Games!
        </h1>

        <h3 className="font-extrabold text-4xl mb-4 lg:drop-shadow-lg">
          CHOOSE YOUR ADVENTURE
        </h3>

        <p className="text-xl font-semibold mb-6 lg:font-normal lg:drop-shadow-lg lg:text-3xl lg:w-7/12">
          Step into a world of mystery, puzzles, and unforgettable moments.
          Whether you're a first-timer or a seasoned quest artist, your next
          adventure awaits just one click away.
        </p>

        {/* Красива кнопка */}
        <Link
          id="escaperooms-button"
          to="/escaperooms"
          className="mt-4 px-8 py-4 text-lg font-bold text-white bg-orange-600 rounded-2xl shadow-lg hover:bg-orange-700 hover:shadow-xl transition duration-300"
        >
          Browse Quest Rooms
        </Link>
      </div>
    </div>
  );
};

export default ChooseYourAdventureComponent;
