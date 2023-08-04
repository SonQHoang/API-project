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
    const [error, setErrors] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        try {
            await dispatch(createReviews(spotId, review))

            setIsModalOpen(false);
            setReview("")
        } catch (err) {
            setErrors('An error occurred while submitting your review. Please try again')
        }
    }

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setErrors({});
        setReview("")
    }

    return (
        <div>
        {isModalOpen && (
          <div className="create-review-overlay">
            <div className="create-review-content">
              <ReviewModal onSubmit={handleSubmit} onClose={handleModalClose} />
            </div>
          </div>
        )}
        <button onClick={handleModalOpen}>Post Your Review</button>
      </div>
    )
}
export default CreateReview;
