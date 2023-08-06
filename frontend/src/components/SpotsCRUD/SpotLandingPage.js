import React from 'react';
import { useSelector } from 'react-redux'
import SpotTile from './SpotTile';
import { getAllSpots } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react'
import './spotLandingPage.css'

const SpotsLandingPage = () => {
const dispatch = useDispatch()

    const spots = useSelector((state) => Object.values(state.spots.allSpots))
    console.log('How many spots are there?=======>', spots)
    const spotReviews = useSelector((state) => state.reviews.singleSpot)
    // const newSpots = Object.values(spots[0])
    // console.log('spots checking this spot=====>', newSpots)
    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div>
          <h1>Welcome to GuitarBnB</h1>
            {spots.map((spot) => (
                    <div key={spot.id} className="spot-tile-list">
                    <SpotTile spot={spot} />
              </div>
            ))}
          </div>
      );
    };

export default SpotsLandingPage