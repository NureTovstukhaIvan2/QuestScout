import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ALLUSERS, ME_QUERY } from "../../utils/queries";
import { DELETE_USER } from "../../utils/mutations";
import { FaTrash, FaSearch, FaUserShield } from "react-icons/fa";

const ManageUsers = () => {
  const { loading, error, data } = useQuery(QUERY_ALLUSERS);
  const { data: meData } = useQuery(ME_QUERY);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: QUERY_ALLUSERS }],
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser({
        variables: { id: userId },
      });
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const filteredUsers =
    data?.getAllUsers?.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.isAdmin ? "admin" : "user").includes(searchLower)
      );
    }) || [];

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
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-gray-400">View and manage user accounts</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="bg-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  <div className="flex items-center">
                    {user.isAdmin && (
                      <FaUserShield className="text-yellow-500 mr-2" />
                    )}
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {user.isAdmin ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {confirmDelete === user.id ? (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="bg-gray-600 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      disabled={meData?.me?.id === user.id}
                      className={`text-red-600 hover:text-red-900 ${
                        meData?.me?.id === user.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={
                        meData?.me?.id === user.id
                          ? "You cannot delete your own account"
                          : "Delete user"
                      }
                      aria-label="Delete user"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
