import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_AllESCAPEROOMS } from "../../utils/queries";
import {
  CREATE_ESCAPEROOM,
  UPDATE_ESCAPEROOM,
  DELETE_ESCAPEROOM,
} from "../../utils/mutations";
import { useNavigate } from "react-router-dom";
import RoomForm from "../../components/Admin/RoomForm";
import RoomList from "../../components/Admin/RoomList";
import SnackBar from "../../components/SnackBarComponent/SnackBar";

const ManageRooms = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(QUERY_AllESCAPEROOMS);
  const [createRoom] = useMutation(CREATE_ESCAPEROOM);
  const [updateRoom] = useMutation(UPDATE_ESCAPEROOM);
  const [deleteRoom] = useMutation(DELETE_ESCAPEROOM);

  const handleCreateRoom = async (roomData) => {
    try {
      if (parseInt(roomData.playersMin) > parseInt(roomData.playersMax)) {
        showError("Minimum players cannot be greater than maximum");
        return;
      }

      await createRoom({
        variables: {
          input: {
            ...roomData,
            price: parseFloat(roomData.price),
            playersMin: parseInt(roomData.playersMin),
            playersMax: parseInt(roomData.playersMax),
            duration: parseInt(roomData.duration),
          },
        },
      });
      refetch();
      setShowForm(false);
      showSuccess("Room created successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to create room. Please try again.");
    }
  };

  const handleUpdateRoom = async (roomData) => {
    try {
      if (parseInt(roomData.playersMin) > parseInt(roomData.playersMax)) {
        showError("Minimum players cannot be greater than maximum");
        return;
      }

      await updateRoom({
        variables: {
          id: editingRoom.id,
          input: {
            ...roomData,
            price: parseFloat(roomData.price),
            playersMin: parseInt(roomData.playersMin),
            playersMax: parseInt(roomData.playersMax),
            duration: parseInt(roomData.duration),
          },
        },
      });
      refetch();
      setEditingRoom(null);
      setShowForm(false);
      showSuccess("Room updated successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to update room. Please try again.");
    }
  };

  const handleDeleteClick = (id) => {
    setRoomToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRoom({ variables: { id: roomToDelete } });
      refetch();
      showSuccess("Room deleted successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to delete room. Please try again.");
    }
    setShowDeleteConfirm(false);
    setRoomToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setRoomToDelete(null);
  };

  const showSuccess = (message) => {
    setSnackBarMessage(message);
    setShowSnackBar(true);
    setTimeout(() => setShowSnackBar(false), 3000);
  };

  const showError = (message) => {
    setSnackBarMessage(message);
    setShowSnackBar(true);
    setTimeout(() => setShowSnackBar(false), 3000);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Quest Rooms</h1>
          <p className="text-gray-400">Create, edit and delete quest rooms</p>
        </div>
        <button
          onClick={() => {
            setEditingRoom(null);
            setShowForm(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <span>+</span> Add New Room
        </button>
      </div>

      {showForm && (
        <RoomForm
          room={editingRoom}
          onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
          onCancel={() => {
            setShowForm(false);
            setEditingRoom(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this room? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <RoomList
        rooms={data.getAllEscapeRooms}
        onEdit={(room) => {
          setEditingRoom(room);
          setShowForm(true);
        }}
        onDelete={handleDeleteClick}
      />

      {showSnackBar && <SnackBar message={snackBarMessage} />}
    </div>
  );
};

export default ManageRooms;
