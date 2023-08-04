import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpotById, deleteSpot } from '../../store/spots';
import './DeleteSpotModal.css';
import './DeleteSpotForm.css'


const DeleteSpotModal = ({onSubmit, onClose, isReview}) => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const spot = useSelector((state) => state.spots[spotId]);
  const user = useSelector((state) => state.session.user);

  const handleDeleteSpot = async () => {
    await dispatch(deleteSpot(spotId));
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const isCurrentUserOwner = user && spot && user.id === spot.ownerId;

  const hideDeleteButton = !isCurrentUserOwner;

  return (
    <div>
      {!hideDeleteButton && (
        <button onClick={handleModalOpen}>Delete Spot</button>
      )}
      {isModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to {isReview ? 'delete this review' : 'remove this spot'}?</p>
            <div className="delete-modal-buttons">
              <button className="delete-button" onClick={onSubmit}>
                {isReview ? 'Yes (Delete Review)' : 'Yes (Delete Spot)'}</button>
              <button className="cancel-button" onClick={onClose}>
                {isReview ? 'No (Keep Review' : "No (Keep Spot)"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteSpotModal;
