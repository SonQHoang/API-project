import React from 'react';
import { useSelector } from 'react-redux'
import SpotTile from './SpotTile';
import { getAllSpots } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react'

const SpotsLandingPage = () => {
const dispatch = useDispatch()

    const spots = useSelector((state) => Object.values(state.spots.allSpots))
    // const newSpots = Object.values(spots[0])
    // console.log('spots checking this spot=====>', newSpots)
    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div>
          <h1>Welcome to GuitarBnB</h1>
          <div className="spot-tile-list">
            {spots.map((spot) => (
              <div key={spot.id} className="spot-tile-container">
                <SpotTile spot={spot} />
              </div>
            ))}
          </div>
        </div>
      );
    };

export default SpotsLandingPage