import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSpotById } from '../../store/spots'
import { useEffect } from 'react'
import { useState } from 'react';
import { deleteSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './spotDetailsStyles.css';
import CreateReview from '../Forms/CreateReviewForm';

function SpotDetailsPage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    const user = useSelector((state) => state.session.user)

    const spotPrice = spot?.price || 1;

    const handleReserveClick = () => {
        alert('Feature coming soon');
    }

    const isReviewable = 
    user && spot && user.id !== spot.ownerId && ((review) => review.userId === user.Id)
    // const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState(null)
    console.log(isReviewable)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    const handleDelete = (spotId) => {
        setSelectedSpotId(spotId)
        // setShowUpdateModal(true)
        dispatch(deleteSpot(spotId))
    }

    const handleUpdate = (spotId) => {
        setSelectedSpotId(spotId);
        history.push(`/spots/${spotId}/update`)
        // setShowUpdateModal(true)
    }

    return (
        <div>
            <h2>{`${spot.name}`}</h2>
            <div className="details-container">
                <p>{`${spot.city}`}</p>
                <p>{`${spot.state}`}</p>
                <p>{`${spot.country}`}</p>
            </div>
            <div>
                {spot.largeImageUrl && <img className="large-image" src={spot.largeImageUrl} alt="Guitar" />}
                {spot.SpotImages && spot.SpotImages.map((image, index) => (
                    <img key={index} className="small-image" src={image.url} alt={`Guitar ${index + 1}`} />
                ))}
            </div>
            <div className="host-details-reserve-container">
                <div>
                    <p>{`Hosted by Son Hoang`}</p>
                    <p>{`Paragraph: ${spot.description}`}</p>
                </div>
                <div className="callout-container">
                    <p className="price">{`$${spotPrice} per night`}</p>
                    <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
                </div>
            </div>
            <button onClick={() => handleDelete(spot.id)}>Delete</button>
            <button onClick={() => handleUpdate(spot.id)}>Update</button>
            <div>
            {<CreateReview spotId={spotId} />}
            </div>
        </div>

    )
}

export default SpotDetailsPage