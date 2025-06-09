import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from "../../utils/queries";
import { UPDATE_EMAIL, UPDATE_NAME } from "../../utils/mutations";
import { Link } from "react-router-dom";
import SnackBar from "../../components/SnackBarComponent/SnackBar";
import ScrollToTop from "../../components/ScrollToTopWrapper/ScrollToTopWrapper";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const MyAccountPage = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
  });
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  const { data: userInfo } = useQuery(ME_QUERY);
  const [updateEmail] = useMutation(UPDATE_EMAIL);
  const [updateName] = useMutation(UPDATE_NAME);

  useEffect(() => {
    const u = userInfo?.me || {};
    if (u) {
      setUser(u);
      setFormData({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
      });
    }
  }, [userInfo]);

  const showSnackbar = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    if (!editMode[field]) {
      setFormData((prev) => ({
        ...prev,
        [field === "name" ? "firstName" : "email"]:
          field === "name" ? user.firstName : user.email,
        [field === "name" ? "lastName" : ""]:
          field === "name" ? user.lastName : "",
      }));
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateEmail({
        variables: { email: formData.email },
      });
      if (data.updateEmail) {
        setUser(data.updateEmail);
        toggleEditMode("email");
        showSnackbar("Email updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setFormData({ ...formData, email: user.email });
      if (err.message === "Email is already in use.") {
        showSnackbar("This email is already in use. Please try another one.");
      } else {
        showSnackbar("Something went wrong. Please try again.");
      }
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateName({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        },
      });
      if (data.updateName) {
        setUser(data.updateName);
        toggleEditMode("name");
        showSnackbar("Name updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setFormData({
        ...formData,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      showSnackbar("Failed to update name. Please try again.");
    }
  };

  const isNameChanged =
    formData.firstName !== user.firstName ||
    formData.lastName !== user.lastName;

  const isEmailChanged = formData.email !== user.email;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 py-10 px-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <AccountCircleIcon
            className="text-orange-600"
            style={{ fontSize: "4rem" }}
          />
          <h1 className="text-3xl font-bold mt-4 underline decoration-orange-600">
            My Account
          </h1>
          <p className="text-slate-400">Manage your personal information</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!editMode.name ? (
              <button
                onClick={() => toggleEditMode("name")}
                className="text-orange-600 hover:text-orange-500 flex items-center"
              >
                <EditIcon className="mr-1" /> Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleEditMode("name")}
                  className="text-slate-400 hover:text-slate-300 flex items-center"
                >
                  <CloseIcon className="mr-1" /> Cancel
                </button>
                <button
                  onClick={handleNameSubmit}
                  disabled={!isNameChanged}
                  className={`flex items-center ${
                    !isNameChanged
                      ? "text-slate-500 cursor-not-allowed"
                      : "text-green-500 hover:text-green-400"
                  }`}
                >
                  <CheckIcon className="mr-1" /> Save
                </button>
              </div>
            )}
          </div>

          {editMode.name ? (
            <form onSubmit={handleNameSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-slate-400">First Name</p>
                <p className="text-lg">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Last Name</p>
                <p className="text-lg">{user.lastName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Email Address</h2>
            {!editMode.email ? (
              <button
                onClick={() => toggleEditMode("email")}
                className="text-orange-600 hover:text-orange-500 flex items-center"
              >
                <EditIcon className="mr-1" /> Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleEditMode("email")}
                  className="text-slate-400 hover:text-slate-300 flex items-center"
                >
                  <CloseIcon className="mr-1" /> Cancel
                </button>
                <button
                  onClick={handleEmailSubmit}
                  disabled={!isEmailChanged}
                  className={`flex items-center ${
                    !isEmailChanged
                      ? "text-slate-500 cursor-not-allowed"
                      : "text-green-500 hover:text-green-400"
                  }`}
                >
                  <CheckIcon className="mr-1" /> Save
                </button>
              </div>
            )}
          </div>

          {editMode.email ? (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>
            </form>
          ) : (
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          <Link
            to="/changepassword"
            className="w-full flex justify-between items-center bg-zinc-800 hover:bg-zinc-700 text-slate-100 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <span>Change Password</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
      {snackbar.show && <SnackBar message={snackbar.message} />}
    </div>
  );
};

export default ScrollToTop(MyAccountPage);
