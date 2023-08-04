import React from 'react'
import singleReviewStars from './singleReviewStars';

const SingleReview = ({ review }) => {
    const {stars, reviewText, createdAt, user} = review

    const reviewDate = new Date(createdAt).toLocaleDateString();

    return (
        <div className="single-review">
            <div className="review-header">
                <singleReviewStars stars={stars}/>
                <p className="review-date">{reviewDate}</p>
            </div>
            <div className="review-text">{reviewText}</div>
            <div className="review-user">{user.firstName}</div>
        </div>
    )
}

export default SingleReview