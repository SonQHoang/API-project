import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './spotTile.css'

// Passing these as props from the reviewList file
const SpotTile = ({ spot, reviewCount, onDeleteButtonClick  }) => {

  //Took away reviewCount, it wasn't being used // 

  // console.log('spot=======>', spot)
  // console.log('reviewCount=======>', reviewCount)
  // console.log('averageRating=======>', averageRating)
  const history = useHistory()

  return (
    <div onClick={() => { history.push(`/spots/${spot.id}`) }} className="spot-tile-list">
      <div key={spot.id} className="spot-tile-container" title={spot.name}>
        <img src={spot.previewImage} className="spot-image" alt="Logo" />
        <div className="spot-info">
          <p className="spot-city">{spot.city}</p>
          <p className="spot-state">{spot.state}</p>
        </div>
        <p className="spot-name" data-tooltip={spot.name}>{spot.name}</p>
        <div className="spot-rating">
          <i className="fas fa-star"></i>

          {spot.avgRating !== null ? (
            <>
              {spot.avgRating?.toFixed(2)}
              {/* {reviewCount > 0 && <span className="dot">·</span>} */}
            </>
          ) : (
            "New"
            )}

          {/* {reviewCount > 0 && <span className="review-count">{reviewCount} Review{reviewCount > 1 ? 's' : ''}</span>} */}
        </div>
        <p className="spot-price">{`$${spot.price} per night`}</p>
      </div>
    </div>
  );
};

export default SpotTile;
