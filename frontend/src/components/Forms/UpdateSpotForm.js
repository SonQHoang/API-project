import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';
import { useParams } from 'react-router-dom';
import CreateSpotsForm from './CreateSpotForm';
import { getSpotById } from '../../store/spots'

function UpdateSpotForm() {
    const { spotId } = useParams()
    console.log('SpotId from URL =============>', spotId)
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.singleSpot)
    console.log('Final data check, all of the spot data should be here ============>', spot)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    return <CreateSpotsForm spot={spot} formType="Update Spot" buttonText="Update your Spot"/>;
}

export default UpdateSpotForm