import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSpotById } from '../../store/spots'
import { useEffect} from 'react'


function SpotDetailsPage() {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    console.log('What does this spot look like?=====>', spot)

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])


    return (
        <div>
            <h2>{`${spot.name}`}</h2>
            <p>{`City: ${spot.city}`}</p>
            <p>{`State: ${spot.state}`}</p>
            <p>{`Country: ${spot.country}`}</p>
            <p>{`Large Image`}</p>
            <p>{`Small Image 1`}</p>
            <p>{`Small Image 2`}</p>
            <p>{`Small Image 3`}</p>
            <p>{`Small Image 4`}</p>
            <p>{`Hosted by Son Hoang`}</p>
            <p>{`Paragraph: ${spot.description}`}</p>
        </div>
    )
}

export default SpotDetailsPage