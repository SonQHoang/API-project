import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserSpots, deleteSpot } from '../../store/spots';
import { useEffect, useState } from 'react';
import SpotTile from './SpotTile';


function GetAllUserSpots() {
    const history = useHistory();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserSpots())
    }, [dispatch])

    const spots = useSelector(state => Object.values(state.spots.allSpots)
    );

    const [selectedSpotId, setSelectedSpotId] = useState(null)

    const handleDelete = (spotId) => {
        setSelectedSpotId(spotId)
        dispatch(deleteSpot(spotId))
    }

    const handleUpdate = (spotId) => {
        setSelectedSpotId(spotId);
        history.push(`/spots/${spotId}/update`)
    }

    if(spots.length > 0) {
    return (
        <>
            <h1>Manage Spots</h1>
            {spots.map(spot => (
                    <div key={spot.id} className="spot-tile-list">
                        <SpotTile spot={spot} className="spot-tile-holder"/>
                        {/* <h2>{spot.name}</h2>
                        <p>{`Address: ${spot.address}`}</p>
                        <p>{`City: ${spot.city}`}</p>
                        <p>{`State: ${spot.state}`}</p>
                        <p>{`Country: ${spot.country}`}</p>
                        <p>{`Description: ${spot.description}`}</p> */}
                        <button onClick={() => handleDelete(spot.id)}>Delete</button>
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