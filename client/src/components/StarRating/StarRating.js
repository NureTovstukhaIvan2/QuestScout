import React from "react";

const StarRating = ({
  rating,
  setRating,
  isEditable = false,
  size = "medium",
}) => {
  const displayRating = rating || 0;

  const sizes = {
    small: {
      star: "text-lg",
      text: "text-xs",
    },
    medium: {
      star: "text-2xl",
      text: "text-sm",
    },
    large: {
      star: "text-3xl",
      text: "text-base",
    },
  };

  const renderStar = (starNumber) => {
    const fillPercentage = Math.max(
      0,
      Math.min(100, (displayRating - (starNumber - 1)) * 100)
    );

    return (
      <div className="relative inline-block" key={starNumber}>
        <div className="relative">
          {/* Empty star background */}
          <span className={`text-gray-400 ${sizes[size].star}`}>★</span>
          {/* Filled star portion */}
          <span
            className={`absolute top-0 left-0 text-yellow-400 ${sizes[size].star} overflow-hidden`}
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
        setRating(null);
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
        <span className={`ml-2 ${sizes[size].text} text-white`}>
          {rating ? `(${displayRating.toFixed(1)})` : "(No ratings yet)"}
        </span>
      )}
    </div>
  );
};

export default StarRating;
