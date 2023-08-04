import React from 'react';
import { Link } from 'react-router-dom';
import { getSpotById } from '../../store/spots'
import { useEffect } from 'react'
import { useState } from 'react';
import { deleteSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';

const SpotTile = ({ spot }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [selectedSpotId, setSelectedSpotId] = useState(null)
    const { spotId } = useParams();
    // const spot = useSelector((state) => state.spots.singleSpot)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    const handleDelete = (spotId) => {
        setSelectedSpotId(spotId)
        dispatch(deleteSpot(spotId))
    }

    const handleUpdate = (spotId) => {
        setSelectedSpotId(spotId);
        history.push(`/spots/${spotId}/update`)
    }
    return (
        <Link to={`/spots/${spot.id}`}>
            <div className="spot-tile">
                <div className="spot-image-container">
                    <img src={spot.previewImage} className="spot-image" alt="Logo" />
                </div>
                <div className="spot-info">
                    <div></div>
                    <p className="spot-city">{spot.city}</p>
                    <p className="spot-state">{spot.state}</p>
                    <p className="spot-name" data-tooltip={spot.name}>{spot.name}</p>
                    <p className="spot-rating">Star Rating</p>
                    <p className="spot-price">{`$${spot.price} per night`}</p>
                </div>
            <div>
            <button onClick={() => handleDelete(spot.id)}>Delete</button>
            <button onClick={() => handleUpdate(spot.id)}>Update</button>
            </div>
            </div>
        </Link>
    )
}

// implement tool tip
export default SpotTile