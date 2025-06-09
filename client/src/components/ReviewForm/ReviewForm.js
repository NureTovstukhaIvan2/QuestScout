import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW } from "../../utils/mutations";
import StarRating from "../StarRating/StarRating";
import SnackBar from "../SnackBarComponent/SnackBar";

const ReviewForm = ({ escapeRoomId, refetch }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createReview] = useMutation(CREATE_REVIEW);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating && !comment) return;

    try {
      await createReview({
        variables: {
          escape_room_id: escapeRoomId,
          rating: rating,
          comment: comment,
        },
      });
      setRating(null);
      setComment("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8 p-4 bg-zinc-900 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg mb-2 text-white">Rating</label>
          <StarRating rating={rating} setRating={setRating} isEditable={true} />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-lg mb-2 text-white">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            className="w-full bg-zinc-950 text-white border border-orange-500 rounded py-2 px-3 focus:outline-none focus:border-orange-600"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-orange-600 text-white font-bold py-2 px-4 rounded hover:bg-orange-700"
        >
          Submit Review
        </button>
      </form>
      {showSuccess && <SnackBar message="Review submitted successfully!" />}
    </div>
  );
};

export default ReviewForm;
