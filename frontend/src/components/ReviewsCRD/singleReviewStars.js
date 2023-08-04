import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const singleReviewStars = ({averageRating}) => {
    const renderingStars = () => {
        const roundedRating = Math.round(averageRating);
        
        const starsArray = [];
        for(let i = 1; i <= 5; i++) {
            const star = i <= roundedRating ? "filled" : "";
            starsArray.push(
                <span key={i} className={`star-icon ${star}`}>
                <FontAwesomeIcon icon={faStar} />
                </span>
            )
        }
            return <div className="stars-container">{starsArray}</div>
    }
    return renderingStars();
}


export default singleReviewStars