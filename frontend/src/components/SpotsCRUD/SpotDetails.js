import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSpotById } from '../../store/spots'
import { useEffect } from 'react'
import './spotDetailsStyles.css';

function SpotDetailsPage() {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    // console.log('What does this spot look like?=====>', spot)

    const spotPrice = spot?.price || 1;

    const handleReserveClick = () => {
        alert('Feature coming soon');
    }


    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])


    return (
        <div>
            <h2>{`${spot.name}`}</h2>
            <div className="details-container">
                <p>{`${spot.city}`}</p>
                <p>{`${spot.state}`}</p>
                <p>{`${spot.country}`}</p>
            </div>


            <div>
                {spot.largeImageUrl && <img className="large-image" src={spot.largeImageUrl} alt="Guitar" />}
                {spot.SpotImages && spot.SpotImages.map((image, index) => (
                    <img key={index} className="small-image" src={image.url} alt={`Guitar ${index + 1}`} />
                ))}
            </div>
            <div className="host-details-reserve-container">
                <div>
                    <p>{`Hosted by Son Hoang`}</p>
                    <p>{`Paragraph: ${spot.description}`}</p>
                </div>
                <div className="callout-container">
                    <p className="price">{`$${spotPrice} per night`}</p>
                    <button onClick={handleReserveClick}>Reserve</button>
                </div>
            </div>
        </div>
    )
}

export default SpotDetailsPage