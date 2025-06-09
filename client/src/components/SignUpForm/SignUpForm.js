import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CREATE_USER } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import SnackBar from "../SnackBarComponent/SnackBar";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [snackbar, setSnackbar] = useState({ show: false, message: "" });
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await Auth.initGoogleAuth();
        Auth.renderGoogleButton(
          "googleSignUpButton",
          handleGoogleResponse,
          true
        );
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
          action: "signup",
        }),
      });

      const data = await res.json();
      if (data.token) {
        Auth.login(data.token);
      } else {
        showSnackbar(data.error || "Google registration failed");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error during Google registration");
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name === "email") {
      newValue = value.toLowerCase();
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.firstName.length > 23 || formData.lastName.length > 23) {
        showSnackbar(
          "You've entered too long a first or last name. Try again."
        );
        return;
      }

      if (formData.password.length < 8 || formData.confirmpassword.length < 8) {
        showSnackbar("Please enter a password at least 8 characters long.");
        return;
      }

      if (formData.confirmpassword !== formData.password) {
        showSnackbar("Passwords don't match. Please try again.");
        return;
      }

      const { data } = await createUser({
        variables: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
      });

      Auth.login(data.createUser.token);
    } catch (err) {
      console.error(err);
      if (err.message === "Email is already in use.") {
        showSnackbar("This email is already in use. Please try another one.");
      } else {
        showSnackbar("Something went wrong. Please try again.");
      }
      return;
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmpassword: "",
    });
  };

  return (
    <div className="w-full max-w-md p-8 mt-6">
      <h1 className="font-semibold text-4xl mb-10 underline decoration-orange-600">
        Sign Up
      </h1>

      <form id="signup-form" onSubmit={handleFormSubmit}>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold lg:text-base"
            htmlFor="firstname"
          >
            First Name
          </label>
          <input
            autoComplete="given-name"
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            type="text"
            id="firstname"
            name="firstName"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold lg:text-base"
            htmlFor="lastname"
          >
            Last Name
          </label>
          <input
            autoComplete="family-name"
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            type="text"
            id="lastname"
            name="lastName"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold lg:text-base"
            htmlFor="email"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            type="email"
            id="email"
            name="email"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold lg:text-base"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            type="password"
            id="password"
            name="password"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold mb-0 lg:text-base"
            htmlFor="confirmpassword"
          >
            Confirm Password
          </label>
          <input
            className="w-full bg-zinc-950 border-b-2 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-orange-600"
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            required
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="w-full text-lg bg-orange-600 text-slate-100 font-semibold py-2 mt-5 rounded hover:bg-orange-700"
        >
          Sign Up
        </button>
      </form>

      <div className="my-6 text-center">
        <div id="googleSignUpButton"></div>
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-lg lg:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 hover:text-orange-700">
            Login
          </Link>
        </h2>
      </div>

      {snackbar.show && <SnackBar message={snackbar.message} />}
    </div>
  );
};

export default SignUpForm;
