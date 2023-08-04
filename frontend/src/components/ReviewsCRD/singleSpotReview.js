import React from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector';


const SingleReview = () => {
    // const { user, stars, reviewText } = review
    // console.log('User:', user);
    // console.log('Stars:', stars);
    // console.log('Review Text:', reviewText);
    // const reviewDate = new Date(createdAt).toLocaleDateString();
    const spotReviews = useSelector((state) => state.reviews.singleSpot);
    // console.log('Wonder if I will see it here=======>', spotReviews)
    return (
        <div>
            {Object.values(spotReviews).map((review) => (
                <div key={review.id} className="single-review">
                    <p>User: {review.userId}</p>
                    <p>Stars: {review.stars}</p>
                    <p>Review: {review.review}</p>
=                </div>
            ))}
        </div>
    )
}

export default SingleReview