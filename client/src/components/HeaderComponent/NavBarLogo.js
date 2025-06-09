import { Link } from "react-router-dom";
import Auth from "../../utils/auth";

const NavBarLogo = ({ toggleSidebar, logo }) => {
  return (
    <Link
      onClick={toggleSidebar}
      to={Auth.loggedIn() ? (Auth.isAdmin() ? "/admin" : "/home") : "/"}
      className="block w-5/12 ml-8 pt-6 md:w-2/5 md:ml-16 lg:hidden"
    >
      <img src={logo} alt="logo" className="h-10" />
    </Link>
  );
};

export default NavBarLogo;
