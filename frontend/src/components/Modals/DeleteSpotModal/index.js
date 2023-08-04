import React, { useEffect, useRef } from 'react';
import './DeleteModal.css';

const DeleteModal = ({ onSubmit, onClose, isReview }) => {
  const modalOverlayRef = useRef();

  const handleClickOutside = (e) => {
    if (modalOverlayRef.current === e.target) {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="delete-modal-overlay" ref={modalOverlayRef}>
      <div className="delete-modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to {isReview ? 'delete this review' : 'remove this spot'}?</p>
        <div className="delete-modal-buttons">
          <button 
          className="delete-button" 
          onClick={onSubmit}>
            {isReview ? 'Yes (Delete Review)' : 'Yes (Delete Spot)'}
            </button>
          <button 
          className="cancel-button" 
          onClick={onClose}>
            {isReview ? 'No (Keep Review)' : 'No (Keep Spot)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
