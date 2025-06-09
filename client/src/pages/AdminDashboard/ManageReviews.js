import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ALLREVIEWS, GET_REVIEW } from "../../utils/queries";
import { UPDATE_REVIEW, DELETE_REVIEW } from "../../utils/mutations";
import { FaTrash, FaCheck, FaTimes, FaEdit, FaSearch } from "react-icons/fa";
import SnackBar from "../../components/SnackBarComponent/SnackBar";

const ManageReviews = () => {
  const { loading, error, data } = useQuery(QUERY_ALLREVIEWS);
  const [updateReview] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [{ query: QUERY_ALLREVIEWS }],
  });
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    refetchQueries: [{ query: QUERY_ALLREVIEWS }],
  });
  const [editingReview, setEditingReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  const showSnack = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setReplyText(review.reply || "");
  };

  const handleSaveReply = async (reviewId) => {
    try {
      await updateReview({
        variables: {
          id: reviewId,
          input: {
            reply: replyText,
          },
        },
      });
      setEditingReview(null);
      showSnack("Reply saved successfully!");
    } catch (err) {
      console.error("Failed to update review:", err);
      showSnack("Failed to save reply. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview({
        variables: { id: reviewId },
      });
      setConfirmDelete(null);
      showSnack("Review deleted successfully!");
    } catch (err) {
      console.error("Failed to delete review:", err);
      showSnack("Failed to delete review. Please try again.");
    }
  };

  const filteredReviews =
    data?.getAllReviews?.filter((review) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        review.user.firstName.toLowerCase().includes(searchLower) ||
        review.user.lastName.toLowerCase().includes(searchLower) ||
        review.user.email.toLowerCase().includes(searchLower) ||
        review.escaperoom.theme.toLowerCase().includes(searchLower) ||
        (review.comment &&
          review.comment.toLowerCase().includes(searchLower)) ||
        (review.reply && review.reply.toLowerCase().includes(searchLower))
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
          <h1 className="text-3xl font-bold">Manage Reviews</h1>
          <p className="text-gray-400">View and respond to customer reviews</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reviews..."
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
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Reply
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-100 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredReviews.map((review) => (
              <tr
                key={review.id}
                className="hover:bg-zinc-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {review.user.firstName} {review.user.lastName}
                  <div className="text-gray-500">{review.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {review.escaperoom.theme}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {review.rating ? `${review.rating}/5` : "No rating"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-100 max-w-xs break-words">
                  {review.comment || "No comment"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-100 max-w-xs break-words">
                  {editingReview === review.id ? (
                    <textarea
                      className="w-full bg-zinc-800 text-slate-100 p-2 rounded"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                  ) : (
                    review.reply || "No reply"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {review.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingReview === review.id ? (
                    <>
                      <button
                        onClick={() => handleSaveReply(review.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                        aria-label="Save"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => setEditingReview(null)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : confirmDelete === review.id ? (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
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
                    <>
                      <button
                        onClick={() => handleEditClick(review)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(review.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {snackbar.show && <SnackBar message={snackbar.message} />}
    </div>
  );
};

export default ManageReviews;
