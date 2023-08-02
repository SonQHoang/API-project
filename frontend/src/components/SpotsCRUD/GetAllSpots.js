import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllSpots, deleteSpot } from '../../store/spots';
import { useEffect, useState } from 'react';
// import UpdateSpotModal from '../UpdateSpotModal'

function GetAllSpots() {
    const history = useHistory();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    const spots = useSelector(state => Object.values(state.spots.allSpots)
    );


    // const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState(null)

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
        <>
            <h1>Your Spots</h1>

            {spots.map(spot => {
                return (
                    <div key={spot.id}>
                        <h2>{spot.name}</h2>
                        <p>{`Address: ${spot.address}`}</p>
                        <p>{`City: ${spot.city}`}</p>
                        <p>{`State: ${spot.state}`}</p>
                        <p>{`Country: ${spot.country}`}</p>
                        <p>{`Description: ${spot.description}`}</p>
                        <button onClick={() => handleDelete(spot.id)}>Delete</button>
                        <button onClick={() => handleUpdate(spot.id)}>Update</button>
                    </div>
                )
            })}
            {/* {showUpdateModal && (
                <UpdateSpotModal
                    spotId={selectedSpotId}
                    onClose={() => setShowUpdateModal(false)}
                />
            )} */}
        </>
    )
}

export default GetAllSpots