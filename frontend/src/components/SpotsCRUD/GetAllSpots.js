import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllSpots } from '../../store/spots';
import { useEffect } from 'react';
// import UpdateSpotModal from '../UpdateSpotModal'
import SpotTile from './SpotTile';
import './spotTile.css'

function GetAllSpots() {
    const history = useHistory();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    const spots = useSelector(state => Object.values(state.spots.allSpots)
    );
    // console.log('How many spots are in here=======?', spots)

    return (
        <div className="spot-tiles-wrapper">
            <h1>All Spots</h1>
                {spots.map(spot => (
                    <div key={spot.id} className="spot-tile-list">
                    <SpotTile  spot={spot} className="spot-tile-holder"/>
            </div>
                ))}

            {/* <h2>{spot.name}</h2>
            <p>{`Address: ${spot.address}`}</p>
            <p>{`City: ${spot.city}`}</p>
            <p>{`State: ${spot.state}`}</p>
            <p>{`Country: ${spot.country}`}</p>3
            <p>{`Description: ${spot.description}`}</p>
            {spot.largeImageUrl && <img src={spot.largeImageUrl} alt="Guitar" />}
            {spot.SpotImages && spot.SpotImages.map((image, index) => (
                <img key={index} src={image.url} alt={`Guitar ${index + 1}`} />
            ))} */}
            {/* {showUpdateModal && (
                <UpdateSpotModal
                    spotId={selectedSpotId}
                    onClose={() => setShowUpdateModal(false)}
                />
            )} */}
        </div>
    )
}

export default GetAllSpots