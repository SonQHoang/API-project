import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { getAllSpots } from '../../store/spots';
import { useParams } from 'react-router-dom';
import CreateSpotsForm from './CreateSpotForm';
import { getSpotById } from '../../store/spots'

function UpdateSpotForm() {
    const { spotId } = useParams()
    // console.log('SpotId from URL =============>', spotId)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])
    
    const spot = useSelector((state) => state.spots.singleSpot)
    // console.log('I should have the spot matching spotId here===>', spot)


    return <CreateSpotsForm spot={spot} formType="UpdateSpot" buttonText="Update your Spot"/>;
}

export default UpdateSpotForm