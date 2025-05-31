import React from "react";

const StarRating = ({ rating, setRating, isEditable = false }) => {
  const displayRating = rating || 0;

  const renderStar = (starNumber) => {
    const fillPercentage = Math.max(
      0,
      Math.min(100, (displayRating - (starNumber - 1)) * 100)
    );

    return (
      <div className="relative inline-block" key={starNumber}>
        <div className="relative">
          {/* Empty star background */}
          <span className="text-gray-400 text-2xl">★</span>
          {/* Filled star portion */}
          <span
            className="absolute top-0 left-0 text-yellow-400 text-2xl overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            ★
          </span>
        </div>
      </div>
    );
  };

  const handleStarClick = (starNumber) => {
    if (isEditable && setRating) {
      if (rating === starNumber) {
        setRating(null); // скидання рейтингу при повторному натисканні
      } else {
        setRating(starNumber);
      }
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`${isEditable ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => handleStarClick(star)}
          >
            {renderStar(star)}
          </div>
        ))}
      </div>
      {!isEditable && (
        <span className="ml-2 text-sm text-white">
          {rating ? `(${displayRating.toFixed(1)})` : "(No ratings yet)"}
        </span>
      )}
    </div>
  );
};

export default StarRating;
