import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSpotById } from '../../store/spots'
import { useEffect, useState } from 'react'
import { deleteSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './spotDetailsStyles.css';
import CreateReview from '../Forms/CreateReviewForm';
import SingleReview from '../ReviewsCRD/singleSpotReview';
import { getSpotReviews } from '../../store/review';
import DeleteModal from '../Modals/DeleteSpotModal';
import ReviewList from '../ReviewsCRD/reviewsList';

// ! Helper fxn to help abstract some of avg rating calculations
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return "New";
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return (totalStars / reviews.length).toFixed(2)
}

function SpotDetailsPage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    // console.log('spot======== looks like===>', spot.SpotImages.map(image => image.id))

    const user = useSelector((state) => state.session.user)

    const spotPrice = spot?.price || 1;
    const spotReviewsObject = useSelector((state) => state.reviews.singleSpot);
    const spotReviews = Object.values(spotReviewsObject)
    const averageRating = calculateAverageRating(spotReviews)

    const handleReserveClick = () => {
        alert('Feature coming soon');
    }

    const isReviewable =
        user && spot && user.id !== spot.ownerId && ((review) => review.userId === user.Id)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState(null)
    // console.log(isReviewable)

    const handleDeleteButtonClick = () => {
        setShowDeleteModal(true);
    };

    const handleModalClose = () => {
        setShowDeleteModal(false);
        setSelectedSpotId(spotId)
        dispatch(deleteSpot(spotId))
    };



    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    //! This useEffect is for getting spotReviews
    // console.log('spotId is working?====>', spotId)
    useEffect(() => {
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId])
    //! useSelector for spotReviews

    // console.log('What does spotReviews look like now====>', spotReviews)
    const handleDelete = (spotId) => {
        dispatch(deleteSpot(spotId))
        setSelectedSpotId(null)
    }

    if (!spot) {
        return <div>Spot not found or has been deleted.</div>;
    }

    const handleUpdate = (spotId) => {
        setSelectedSpotId(spotId);
        history.push(`/spots/${spotId}/update`)
        // setShowUpdateModal(true)
    }

    // Fake3      User      FakeUser3    FakeUser3@gmail.com 
    return (
        <>
            <div className="horizontal-Line"></div>
            <div className='spot-details-container'>
                <h2>{`${spot.name}`}</h2>
                <div className="details-container">
                    <p>{`${spot.city}`}, {`${spot.state}`}, {`${spot.country}`}</p>
                </div>
                <div className="image-wrapper">
                    <div className='large-image-container'>
                        {spot.SpotImages && <img 
                        className="large-image" 
                        src={spot.SpotImages[0].url} 
                        alt="Guitar" />}
                    </div>
                    <div className="small-images-container">
                        {spot.SpotImages && spot.SpotImages.slice(1,5).map((image, index) => (
                            <img key={index} className="small-image" src={image.url} alt={`Small Image Preview ${index + 1}`} />
                        ))}
                    </div>
                </div>
                <div className="host-details-reserve-container">
                    <div>
                        <p>{`Hosted by Son Hoang`}</p>
                        <p>{`Paragraph: ${spot.description}`}</p>
                    </div>

                    <div className="callout-container">
                        <div className="review-summary">

                            {averageRating !== null ? (
                                <>
                                    <i className="fas fa-star"></i>
                                    {averageRating}
                                    {spotReviews.length > 0 && <span className="dot">·</span>}
                                </>
                            ) : (
                                spotReviews.length > 0 && <span className="dot">·</span>
                            )}
                            {spotReviews.length > 0 && (
                                <span className="review-count">
                                    {spotReviews.length} Review{spotReviews.length > 1 ? 's' : ""}
                                </span>
                            )}
                            <p className="price">{`$${spotPrice} per night`}</p>
                        </div>
                        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
                    </div>
                </div>
                {showDeleteModal && (
                    <DeleteModal onSubmit={handleDelete} onClose={handleModalClose} />
                )}
                {/* <button onClick={() => handleDelete(spot.id)}>Delete</button> */}
                {/* <button onClick={() => handleUpdate(spot.id)}>Update</button>
            <button onClick={handleDeleteButtonClick}>Delete Spot</button> */}

                {/* Our Reviews List info above the list of reviews */}
                <div>
                    <ReviewList spot={spot} spotReviews={spotReviews} />
                </div>
                <div>
                    {spotReviews.length > 0 ? (
                        spotReviews.map((review) => <SingleReview key={review.id} review={review} />)
                    ) : (
                        <div>Be the first to post a review!</div>
                    )}
                </div>
            </div>
        </>

    )
}

export default SpotDetailsPage