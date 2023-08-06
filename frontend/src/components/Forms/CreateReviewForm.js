import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getSpotById,  } from '../../store/spots';
import { createReviews } from '../../store/review';
import ReviewModal from '../Modals/ReviewModal/ReviewModal';
import './CreateReviewForm.css'

const CreateReview = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()

    const [review, setReview] = useState("");
    const [stars, setStars] = useState("")
    // const [error, setErrors] = useState({})
    const [serverError, setServerError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const spot = useSelector(state => state.spots[spotId])
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    const handleReviewSubmit = async (reviewData) => {
      // console.log('reviewData======>', reviewData)
      try {
        setReview(reviewData.review)
        setStars(reviewData.stars)
        const response = await dispatch(createReviews(spotId, reviewData, user))
        console.log('Checking out the response =====>', response)
        setIsModalOpen(false)
        
        setReview("")
      } catch (error) {
        if (error.response) {
          setServerError(null);
        } else {
          // Hard coding this, but need to figure out later how to make it dynamic
          setServerError(`You've already posted a review for this spot`);
        }
      }
    }

    const clearServerError = () => {
      setServerError(null)
    }

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        // setErrors({});
        setReview("")
    }

    //!  IF user is LOGGED IN and OWNER OF SPOT HIDE THE BUTTON
    const isCurrentUserOwner = user && spot && user.id === spot.ownerId;

    //! IF user has ALREADY POSTED A REVIEW for THIS SPOT HIDE THE BUTTON
    const hasPostedReview = user && spot && spot.reviews.some(review => review.userId === user.id)

    const hideReviewButton = isCurrentUserOwner || hasPostedReview


    //!! Come back to this AFTER finishing Reviews
    // console.log("isCurrentUserOwner", isCurrentUserOwner)
    // console.log("hasPostedReview", hasPostedReview)
    // console.log("hideReviewButton", hideReviewButton)

    return (
        <div>
            {!hideReviewButton && (
                <button onClick={handleModalOpen}>Post Your Review</button>
            )}
        {isModalOpen && (
          <div className="create-review-overlay">
            <div className="create-review-content">
              <ReviewModal onSubmit={handleReviewSubmit} onClose={handleModalClose} serverError={serverError} clearServerError={clearServerError} />
            </div>
          </div>
        )}
      </div>
    )
}
export default CreateReview;
