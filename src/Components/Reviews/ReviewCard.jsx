import React from "react";

const ReviewCard = ({ review }) => {
  const {
    userName,
    ratings,
    reviewText,
    user_photoURL,
    title
  } = review;

  const displayText =
    reviewText ||
    "Amazing experience! Highly recommended.";

  const displayName = userName || "Customer";
  const position = title || "Loading";
  const displayRating = Number(ratings) || 5;
  const displayPhoto =
    user_photoURL ||
    "https://randomuser.me/api/portraits/men/32.jpg";

  // stars
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < displayRating ? "⭐" : "☆"}
      </span>
    ));
  };

  return (
        <div className="bg-white max-w-xl mx-auto rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
        
        {/* Quote */}
        <p className="text-gray-600 italic mb-6">
            "{displayText}"
        </p>

        {/* Stars */}
        <div className="mb-4 text-lg">
            {renderStars()}
        </div>

        {/* User Info */}
        <div className="flex items-center justify-center gap-4 mt-6">
                <img
                src={displayPhoto}
                alt={displayName}
                className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex items-center flex-col">
                    <h2 className="font-bold text-gray-800">
                        {displayName}
                    </h2>
                    <h5>
                        {position}
                    </h5>
                </div>
        </div>
    </div>
);
};

export default ReviewCard;