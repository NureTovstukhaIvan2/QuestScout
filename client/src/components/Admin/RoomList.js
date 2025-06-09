import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const RoomList = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-zinc-900 rounded-lg overflow-hidden">
        <thead className="bg-zinc-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
              Theme
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
              Genre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
              Players
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-zinc-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={room.image_url}
                      alt={room.theme}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-slate-100">
                      {room.theme}
                    </div>
                    <div className="text-sm text-gray-500">
                      {room.duration} min
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                {room.genre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    room.difficulty === "Beginner"
                      ? "bg-green-900 text-green-300"
                      : room.difficulty === "Intermediate"
                      ? "bg-yellow-900 text-yellow-300"
                      : room.difficulty === "Advanced"
                      ? "bg-orange-900 text-orange-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {room.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                {room.playersMin}-{room.playersMax}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                {room.price} UAH
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(room)}
                  className="text-orange-600 hover:text-orange-900 mr-4"
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(room.id)}
                  className="text-red-600 hover:text-red-900"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
