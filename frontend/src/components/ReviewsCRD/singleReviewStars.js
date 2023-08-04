import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const SingleReviewStars = ({ averageRating }) => {
  return (
    <div className="stars-container">
      <span className="star-icon">
        <FontAwesomeIcon icon={faStar} />
      </span>
      <span className="average-rating">{averageRating.toFixed(2)}</span>
    </div>
  );
};

export default SingleReviewStars;