import React from "react";
import StarRating from "../StarRating/StarRating";

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-white mt-4">No reviews yet.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-white">Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 bg-zinc-900 rounded-lg border border-zinc-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white">
                  {review.user.firstName} {review.user.lastName}
                </h4>
                {review.rating && (
                  <StarRating rating={review.rating} isEditable={false} />
                )}
              </div>
              <span className="text-sm text-white">{review.created_at}</span>
            </div>
            {review.comment && (
              <p className="mt-2 text-white whitespace-pre-wrap break-words">
                {review.comment}
              </p>
            )}
            {review.reply && (
              <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-orange-500">
                    Admin reply:
                  </span>
                </div>
                <p className="text-white whitespace-pre-wrap break-words">
                  {review.reply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
