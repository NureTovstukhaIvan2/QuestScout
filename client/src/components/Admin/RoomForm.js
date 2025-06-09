import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    theme: room?.theme || "",
    genre: room?.genre || "",
    difficulty: room?.difficulty || "Beginner",
    ageGroup: room?.ageGroup || "6+",
    playersMin: room?.playersMin || 2,
    playersMax: room?.playersMax || 4,
    price: room?.price || 500,
    description: room?.description || "",
    duration: room?.duration || 60,
    image_url: room?.image_url || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [playersError, setPlayersError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    theme: "",
    genre: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    validatePlayers();
  }, [formData.playersMin, formData.playersMax]);

  const validatePlayers = () => {
    if (parseInt(formData.playersMin) > parseInt(formData.playersMax)) {
      setPlayersError("Minimum players cannot be greater than maximum");
      return false;
    }
    setPlayersError("");
    return true;
  };

  const validateFields = () => {
    const errors = {
      theme:
        formData.theme.length > 40 ? "Theme must be 40 characters or less" : "",
      genre:
        formData.genre.length > 20 ? "Genre must be 20 characters or less" : "",
      description:
        formData.description.length > 400
          ? "Description must be 400 characters or less"
          : "",
      image:
        !room && !imageFile && !formData.image_url ? "Image is required" : "",
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      if (isNaN(value) || value < 0) {
        setPriceError("Price must be a positive number");
      } else {
        setPriceError("");
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (priceError || !validatePlayers() || !validateFields()) return;

    if (imageFile) {
      setIsUploading(true);
      try {
        const base64Image = await convertToBase64(imageFile);
        onSubmit({
          ...formData,
          image_url: base64Image,
        });
      } catch (error) {
        console.error("Image conversion error:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      onSubmit(formData);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image_url: reader.result,
        });
        setValidationErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {room ? "Edit Room" : "Add New Room"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Theme:</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                maxLength={40}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              />
              {validationErrors.theme && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.theme}
                </p>
              )}
              <p className="text-xs text-gray-400 text-right">
                {formData.theme.length}/40
              </p>
            </div>
            <div>
              <label className="block mb-2">Genre:</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                maxLength={20}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              />
              {validationErrors.genre && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.genre}
                </p>
              )}
              <p className="text-xs text-gray-400 text-right">
                {formData.genre.length}/20
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2">Difficulty:</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Age Group:</label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              >
                <option value="6+">6+</option>
                <option value="10+">10+</option>
                <option value="13+">13+</option>
                <option value="16+">16+</option>
                <option value="18+">18+</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Duration (minutes):</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              >
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="120">120</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Minimum Players:</label>
              <input
                type="number"
                name="playersMin"
                value={formData.playersMin}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Maximum Players:</label>
              <input
                type="number"
                name="playersMax"
                value={formData.playersMax}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              />
            </div>
          </div>
          {playersError && (
            <div className="col-span-2 text-red-500 text-sm mb-2">
              {playersError}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">Price (UAH):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
              required
            />
            {priceError && (
              <p className="text-red-500 text-sm mt-1">{priceError}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={400}
              rows="4"
              className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.description}
              </p>
            )}
            <p className="text-xs text-gray-400 text-right">
              {formData.description.length}/400
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Room Image: {!room && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="fileInput"
              />
              <div className="w-full bg-zinc-800 text-slate-100 p-2 rounded flex items-center justify-between">
                <span>{imageFile ? imageFile.name : "Choose file"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {validationErrors.image && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.image}
              </p>
            )}
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              disabled={
                isUploading ||
                priceError ||
                playersError ||
                Object.values(validationErrors).some((error) => error !== "")
              }
            >
              {isUploading
                ? "Uploading..."
                : room
                ? "Update Room"
                : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
