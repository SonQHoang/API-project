import React from 'react';
import { useSelector } from 'react-redux'
import SpotTile from './SpotTile';
import GetAllSpots from './GetAllSpots';

const SpotsLandingPage = () => {

    const spots = useSelector((state) => Object.values(state.spots))

    return (
        <div>
            <h1> Welcome to GuitarBnB</h1>
            <div className="spot-tile-list">
                {spots.map((spot) => (
                    <div key={spot.id} className="spot-tile-container">
                        <SpotTile spot={spot}/>
                        <GetAllSpots />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpotsLandingPage