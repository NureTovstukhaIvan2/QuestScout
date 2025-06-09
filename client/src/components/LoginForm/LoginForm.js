import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LOGIN_USER } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import SnackBar from "../SnackBarComponent/SnackBar";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [login] = useMutation(LOGIN_USER);

  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await Auth.initGoogleAuth();
        Auth.renderGoogleButton("googleSignInButton", handleGoogleResponse);
      } catch (err) {
        console.error("Failed to initialize Google Auth:", err);
      }
    };

    initGoogleAuth();
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
          action: "login",
        }),
      });

      const data = await res.json();
      if (data.token) {
        Auth.login(data.token);
      } else {
        openSnackBar(data.error || "Google authentication failed");
      }
    } catch (err) {
      console.error(err);
      openSnackBar("Error during Google authentication");
    }
  };

  const openSnackBar = (
    message = "Something went wrong. Please try again."
  ) => {
    setShowSnackBar(true);
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedUserFormData = {
        email: formData.email.toLowerCase(),
        password: formData.password,
      };
      const { data } = await login({
        variables: updatedUserFormData,
      });

      if (data.login === null) {
        openSnackBar();
        return;
      }
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      openSnackBar();
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="w-full max-w-md p-8 mt-16">
      <h1 className="font-semibold text-4xl mb-10 underline decoration-orange-600">
        Login
      </h1>

      <form id="signup-form" onSubmit={handleFormSubmit}>
        <div className="mb-8">
          <label
            className="block text-lg font-semibold mb-2 lg:text-base"
            htmlFor="email-login"
          >
            Email
          </label>
          <input
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            autoComplete="email"
            type="email"
            id="email-login"
            name="email"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold mb-2 lg:text-base"
            htmlFor="password-login"
          >
            Password
          </label>
          <input
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            type="password"
            id="password-login"
            name="password"
            required
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-xl text-slate-100 font-semibold py-2 mt-5 rounded hover:bg-orange-700 lg:text-lg"
        >
          Login
        </button>
      </form>

      <div className="my-6 text-center">
        <div id="googleSignInButton"></div>
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-lg lg:text-base">
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-orange-600 hover:text-orange-700">
            Sign Up
          </Link>
        </h2>
      </div>

      {showSnackBar && (
        <SnackBar message="Wrong email or password. Please try again." />
      )}
    </div>
  );
};

export default LoginForm;
