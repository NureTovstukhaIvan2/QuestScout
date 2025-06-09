import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Auth from "../../utils/auth";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-slate-100 font-roboto border-t-2 border-orange-600 pt-7 pb-5 px-4 text-center lg:justify-around">
      <div className="lg:w-1/4 lg:mx-auto">
        <Link
          to={Auth.loggedIn() ? (Auth.isAdmin() ? "/admin" : "/home") : "/"}
          className="w-6/12 block md:w-1/3 lg:w-7/12 lg:block mx-auto"
        >
          <img src={logo} alt="QuestScout logo" />
        </Link>
        <p className="text-xs lg:text-base mt-3">
          &copy; 2025 QuestScout – Immersive Adventures. <br />
          All rights reserved. Crafted with passion for adventure and mystery.
        </p>
      </div>

      <div className="mt-6 lg:flex lg:items-center lg:justify-center lg:text-lg">
        <div>
          <Link
            to="/escaperooms"
            className="mx-4 lg:mr-8 hover:text-orange-400 transition-colors duration-300"
          >
            Quest Rooms
          </Link>
          <Link
            to="/rules"
            className="mx-4 lg:mr-8 hover:text-orange-400 transition-colors duration-300"
          >
            Rules
          </Link>
          <Link
            to="/howtobook"
            className="mx-4 lg:mr-8 hover:text-orange-400 transition-colors duration-300"
          >
            How to Book
          </Link>
        </div>
        <div className="mt-2 lg:mt-0">
          <Link
            to="/aboutus"
            className="mx-6 lg:mr-8 hover:text-orange-400 transition-colors duration-300"
          >
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
