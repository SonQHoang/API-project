import React, { useState } from 'react';
import './ReviewModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const ReviewModal = ({ onSubmit }) => {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ review, stars});
    setReview("")
    setStars("")
  };
  const disableButtonIf = review.length < 10 || stars === 0;
  return (
    <div className="modal">
      <div className="modal-content">
        <div>
        <h2>How was your stay?</h2>
        </div>
        <div>
        <form onSubmit={handleSubmit}>
          <textarea
          className="review-textarea"
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div>
          <label>
            <div className="stars-container">
                {[1,2,3,4,5].map((star) => (
                    <span
                    key={star}
                    onClick={() => setStars(star)}
                    >
                        <FontAwesomeIcon icon={star <= stars ? solidStar: regularStar} />
                    </span>
                ))}
            </div>
            <span className="stars-label">Stars</span>
          </label>
          </div>
        <div>
          <button className="review-button" disabled={disableButtonIf}>Submit Your Review</button>
        </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;