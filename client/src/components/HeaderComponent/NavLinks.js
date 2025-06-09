import { Link, useLocation } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Auth from "../../utils/auth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import GavelIcon from "@mui/icons-material/Gavel";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";

const NavLinks = ({ toggleSidebar, handleLogout }) => {
  const isAdmin = Auth.loggedIn() && Auth.isAdmin();
  const location = useLocation();

  const baseLinkStyles =
    "flex items-center gap-2 px-4 py-3 rounded-md transition-colors duration-300";
  const activeLinkStyles = "bg-orange-500 text-white shadow-lg";
  const hoverLinkStyles = "hover:bg-orange-100 hover:text-orange-600";

  const getLinkClass = (path) => {
    return location.pathname === path
      ? `${baseLinkStyles} ${activeLinkStyles}`
      : `${baseLinkStyles} ${hoverLinkStyles}`;
  };

  return (
    <ul className="lg:flex lg:justify-end lg:gap-x-4">
      {Auth.loggedIn() ? (
        isAdmin ? (
          <>
            <li className="mb-2 lg:mb-0">
              <Link
                to="/admin"
                onClick={toggleSidebar}
                className={getLinkClass("/admin")}
              >
                <DashboardIcon fontSize="medium" />
                <span>Admin Panel</span>
              </Link>
            </li>
            <li className="mb-2 lg:mb-0">
              <Link
                to="/myaccount"
                onClick={toggleSidebar}
                className={getLinkClass("/myaccount")}
              >
                <AccountCircleIcon fontSize="medium" />
                <span>My Account</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="mb-2 lg:mb-0">
              <Link
                to="/mybookings"
                onClick={toggleSidebar}
                className={getLinkClass("/mybookings")}
              >
                <CalendarMonthIcon fontSize="medium" />
                <span>My Bookings</span>
              </Link>
            </li>
            <li className="mb-2 lg:mb-0">
              <Link
                to="/booking-history"
                onClick={toggleSidebar}
                className={getLinkClass("/booking-history")}
              >
                <HistoryIcon fontSize="medium" />
                <span>Booking History</span>
              </Link>
            </li>
            <li className="mb-2 lg:mb-0">
              <Link
                to="/myaccount"
                onClick={toggleSidebar}
                className={getLinkClass("/myaccount")}
              >
                <AccountCircleIcon fontSize="medium" />
                <span>My Account</span>
              </Link>
            </li>
          </>
        )
      ) : null}

      {!isAdmin && (
        <>
          <li className="mb-2 lg:mb-0">
            <Link
              to="/escaperooms"
              onClick={toggleSidebar}
              className={getLinkClass("/escaperooms")}
            >
              <DoorSlidingIcon fontSize="medium" />
              <span>Quest Rooms</span>
            </Link>
          </li>
          <li className="mb-2 lg:mb-0">
            <Link
              to="/rules"
              onClick={toggleSidebar}
              className={getLinkClass("/rules")}
            >
              <GavelIcon fontSize="medium" />
              <span>Rules</span>
            </Link>
          </li>
          <li className="mb-2 lg:mb-0">
            <Link
              to="/howtobook"
              onClick={toggleSidebar}
              className={getLinkClass("/howtobook")}
            >
              <QuestionMarkIcon fontSize="medium" />
              <span>How to book</span>
            </Link>
          </li>
        </>
      )}

      <li className="mb-2 lg:mb-0">
        {Auth.loggedIn() ? (
          <button
            onClick={() => {
              handleLogout();
              toggleSidebar();
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-md text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-300 w-full lg:w-auto"
          >
            <LoginIcon fontSize="medium" />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={toggleSidebar}
            className={getLinkClass("/login")}
          >
            <LoginIcon fontSize="medium" />
            <span>Login</span>
          </Link>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
