import React from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { deleteReviews } from '../../store/review';
import { useState } from 'react';
import DeleteModal from '../Modals/DeleteSpotModal';

const SingleReview = ({review}) => {
    // console.log('Checking the review prop for data ======>', review)
    const reviewObject = review[0]

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector((state) => state.session.user)
    // console.log('Is the user logged in=====> Yes they are', user.id)

    const handleDeleteReview = () => {
        dispatch(deleteReviews(reviewObject.id))
        setShowDeleteModal(true)
    }
    
    const spotReviews = useSelector((state) => state.reviews.singleSpot);

    return (
        <>
        <div className="review-container">
            <div className="review-comment">{review.comment}</div>

            {user && user.id === reviewObject.userId && (
                <button onClick={() => setShowDeleteModal(true)}>Delete</button>
            )}
            {Object.values(spotReviews).map((review) => (
                <div key={review.id} className="single-review">
                    <p>User: {review.userId}</p>
                    <p>Stars: {review.stars}</p>
                    <p>Review: {review.review}</p>
              </div>
                  ))}
              {showDeleteModal && (
                <DeleteModal 
                onSubmit={handleDeleteReview} 
                onClose={() => setShowDeleteModal(false )}
                isReview={true}
                />
              )}

        </div>
        </>
    )
}

export default SingleReview