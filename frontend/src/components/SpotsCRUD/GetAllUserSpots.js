import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserSpots, deleteSpot } from '../../store/spots';
import { useEffect, useState } from 'react';
import SpotTile from './SpotTile';
import DeleteModal from '../Modals/DeleteSpotModal';

function GetAllUserSpots() {
    const history = useHistory();
    const dispatch = useDispatch()

    const spotObject = useSelector(state => state.spots.allSpots);
    const spots = Object.values(spotObject)

    console.log('seeing what happens to spots=========>', spotObject)

    const [selectedSpotId, setSelectedSpotId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Declare the state for the modal

    useEffect(() => {
        dispatch(getUserSpots())
    }, [dispatch])

    const handleDeleteButtonClick = (spotId) => {
        setSelectedSpotId(spotId)
        setShowDeleteModal(true)
    }

    const handleDelete = () => {
        if(selectedSpotId)
        dispatch(deleteSpot(selectedSpotId))
        setShowDeleteModal(false)
        setSelectedSpotId(null)
    }


    const handleUpdate = (spotId) => {
        setSelectedSpotId(spotId);
        history.push(`/spots/${spotId}/update`)
    }

    if (spots.length > 0) {
        return (
            <>
                <h1>Manage Spots</h1>
                {spots.map(spot => (
                    <div key={spot.id} className="spot-tile-list">
                        <SpotTile spot={spot} className="spot-tile-holder" onDeleteButtonClick={() => handleDeleteButtonClick(spot.id)} />
                        {/* <h2>{spot.name}</h2>
                        <p>{`Address: ${spot.address}`}</p>
                        <p>{`City: ${spot.city}`}</p>
                        <p>{`State: ${spot.state}`}</p>
                        <p>{`Country: ${spot.country}`}</p>
                        <p>{`Description: ${spot.description}`}</p> */}
                        {showDeleteModal && (
                            <DeleteModal onSubmit={handleDelete} onClose={() => setShowDeleteModal(false)} />
                        )}
                        <button onClick={() => handleDeleteButtonClick(spot.id)}>Delete</button>
                        <button onClick={() => handleUpdate(spot.id)}>Update</button>
                    </div>

                ))}
            </>
        )
    } else {
        return (
            <>
                <h2>Create your first spot now!</h2>
                <button onClick={() => history.push('/spots/new')}>Create a New Spot</button>
            </>
        )
    }
}

export default GetAllUserSpots

{/* {showUpdateModal && (
                <UpdateSpotModal
                    spotId={selectedSpotId}
                    onClose={() => setShowUpdateModal(false)}
                />
            )} */}