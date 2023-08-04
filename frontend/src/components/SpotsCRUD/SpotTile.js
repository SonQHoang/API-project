import React from 'react';
import { useHistory } from 'react-router-dom'
const SpotTile = ({ spot }) => {
  const history = useHistory()
  return (
    <div onClick={() => { history.push(`/spots/${spot.id}`) }} className="spot-tile-list">
      <div key={spot.id} className="spot-tile-container">
        <img src={spot.previewImage} className="spot-image" alt="Logo" />
        <div className="spot-info">
          <p className="spot-city">{spot.city}</p>
          <p className="spot-state">{spot.state}</p>
        </div>
          <p className="spot-name" data-tooltip={spot.name}>{spot.name}</p>
        <p className="spot-rating">Star Rating</p>
        <p className="spot-price">{`$${spot.price} per night`}</p>
      </div>
    </div>
  );
};

// implement tool tip
export default SpotTile;
