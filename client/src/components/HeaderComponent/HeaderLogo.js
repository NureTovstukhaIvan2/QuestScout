import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

const HeaderLogo = ({ logo }) => {
  return (
    <Link
      to={Auth.loggedIn() ? (Auth.isAdmin() ? "/admin" : "/home") : "/"}
      className="w-4/12 py-1 md:w-2/5 lg:w-1/6"
    >
      <img src={logo} alt="logo" className="h-14" />
    </Link>
  );
};

export default HeaderLogo;
