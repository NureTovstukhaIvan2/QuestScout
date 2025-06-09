import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Auth from "../src/utils/auth";
import { Navigate } from "react-router-dom";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import Header from "./components/HeaderComponent/Header";
import { DarkModeProvider } from "./utils/DarkModeContext";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserHomePage from "./pages/UserHomePage/UserHomePage";
import BookingPage from "./pages/BookingPage/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage/MyBookingsPage";
import Footer from "./components/FooterComponent/Footer";
import EscapeRoomsPage from "./pages/EscapeRoomsPage/EscapeRoomsPage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import RulesPage from "./pages/RulesPage/RulesPage";
import HowToBookPage from "./pages/HowToBookPage/HowToBookPage";
import MyAccountPage from "./pages/MyAccountPage/MyAccountPage";
import { UserBookingsProvider } from "./utils/UserBookingsContext";
import ChangePasswordPage from "./pages/ChangePasswordPage.js/ChangePasswordPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ManageRooms from "./pages/AdminDashboard/ManageRooms";
import ManageBookings from "./pages/AdminDashboard/ManageBookings";
import ManageUsers from "./pages/AdminDashboard/ManageUsers";
import ManageReviews from "./pages/AdminDashboard/ManageReviews";
import BookingHistoryPage from "./pages/BookingHistoryPage/BookingHistoryPage";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <DarkModeProvider>
        <UserBookingsProvider>
          <Router>
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  Auth.loggedIn() ? (
                    Auth.isAdmin() ? (
                      <Navigate to="/admin" />
                    ) : (
                      <Navigate to="/home" />
                    )
                  ) : (
                    <WelcomePage />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  Auth.loggedIn() ? <Navigate to="/home" /> : <SignUpPage />
                }
              />
              <Route
                path="/login"
                element={
                  Auth.loggedIn() ? <Navigate to="/home" /> : <LoginPage />
                }
              />
              <Route path="/escaperooms" element={<EscapeRoomsPage />} />
              <Route
                path="/home"
                element={
                  Auth.loggedIn() ? <UserHomePage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/booking/:roomId"
                element={
                  Auth.loggedIn() ? <BookingPage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/mybookings"
                element={
                  Auth.loggedIn() ? (
                    <MyBookingsPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/booking-history"
                element={
                  Auth.loggedIn() ? (
                    <BookingHistoryPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/myaccount"
                element={
                  Auth.loggedIn() ? <MyAccountPage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/changepassword"
                element={
                  Auth.loggedIn() ? (
                    <ChangePasswordPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/howtobook" element={<HowToBookPage />} />
              <Route path="/aboutus" element={<AboutUsPage />} />
              <Route
                path="/admin"
                element={
                  Auth.loggedIn() && Auth.isAdmin() ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/rooms"
                element={
                  Auth.loggedIn() && Auth.isAdmin() ? (
                    <ManageRooms />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  Auth.loggedIn() && Auth.isAdmin() ? (
                    <ManageBookings />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/users"
                element={
                  Auth.loggedIn() && Auth.isAdmin() ? (
                    <ManageUsers />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  Auth.loggedIn() && Auth.isAdmin() ? (
                    <ManageReviews />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
            <Footer />
          </Router>
        </UserBookingsProvider>
      </DarkModeProvider>
    </ApolloProvider>
  );
}

export default App;
