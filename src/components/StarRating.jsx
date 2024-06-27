import { doc, increment, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase/config";

const StarRating = ({
  Note,
  totalStars,
  chapter,
  ScoreRating,
  Rating,
  NrVote,
}) => {
  const [rating, setRating] = useState(Math.round(Rating));
  const [hover, setHover] = useState(0);

  async function handleRating(rating) {
    console.log(
      "Rating",
      Rating,
      "ratingNow",
      rating,
      "NrVote",
      NrVote,
      "Score Rating:",
      ScoreRating
    );
    await updateDoc(doc(db, "Lista Completa", `${chapter}`), {
      ScoreRating: ScoreRating + rating,
      Rating: (ScoreRating + rating) / NrVote,
      NrVote: increment(1),
    });
    // window.location.reload();
  }
  return (
    <div>
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <svg
              key={starValue}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className={`cursor-pointer ${
                starValue <= (hover || rating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              onClick={() => handleRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              fill="currentColor"
            >
              <path d="M12 .587l3.668 7.428 8.2 1.193-5.93 5.787 1.4 8.18L12 18.588l-7.338 3.857 1.4-8.18-5.93-5.787 8.2-1.193L12 .587z" />
            </svg>
          );
        })}
      </div>
      <p className="mt-2 text-lg">
        Rating: {Number.parseFloat(Rating).toFixed(2)} out of {totalStars} stars
      </p>
    </div>
  );
};

export default StarRating;
