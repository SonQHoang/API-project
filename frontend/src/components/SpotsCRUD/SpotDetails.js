import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSpotById } from '../../store/spots'
import { useEffect} from 'react'


function SpotDetailsPage() {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.allSpots[spotId])
    // console.log('What does this look like?============>',spot)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    if(!spot) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>Spot Details</h2>
            <p>{`Name: ${spot.name}`}</p>
            <p>{`Address: ${spot.address}`}</p>
            <p>{`City: ${spot.city}`}</p>
            <p>{`State: ${spot.state}`}</p>
            <p>{`Country: ${spot.country}`}</p>
        </div>
    )
}

export default SpotDetailsPage