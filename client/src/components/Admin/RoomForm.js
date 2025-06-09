import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    theme: room?.theme || "",
    genre: room?.genre || "",
    difficulty: room?.difficulty || "Beginner",
    ageGroup: room?.ageGroup || "10+",
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

    if (priceError || !validatePlayers()) return;

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
              <label className="block mb-2">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2">Difficulty</label>
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
              <label className="block mb-2">Age Group</label>
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
              <label className="block mb-2">Duration (minutes)</label>
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
              <label className="block mb-2">Minimum Players</label>
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
              <label className="block mb-2">Maximum Players</label>
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
            <label className="block mb-2">Price (UAH)</label>
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
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Room Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
              required
            />
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
              disabled={isUploading || priceError || playersError}
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
