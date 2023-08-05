import { useSelector } from "react-redux/es/hooks/useSelector";

const ReviewList = ({spot}) => {
    const spotReviews = useSelector((state) => state.reviews.singleSpot);
    console.log('Are there multiple spotReview items?=======>', spotReviews)
    const user = useSelector((state) => state.session.user);

    const reviews = Object.values(spotReviews)
    .filter((review) => review.spotId === spot.id)
    .reverse()
    // const reversedReviews = [...reviews].reverse()
    // console.log('reversedReviews, we are checking the order======>', reversedReviews)

    if(reviews.length === 0 && user && user.id !== spot.ownerId) {
        return <p>Be the first to post a review!</p>
    }

    // Formatting the date so I can use the date in order to indicate the order of the reivews

    const formatDate = (dateString) => {
        console.log('What this the dateString look like?=====>', dateString)
        const date = new Date(dateString);
        console.log('What does date look like=====>', date)
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear()
        return `${month} ${year}`
      }

        return (
            <div className="review-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <p>User: {review.userId}</p>
                        <p>Month Year: {formatDate(review.createdAt)}</p>
                        <p>Review: {review.review}</p>
                </div>
                ))}
            </div>
        )
    }

    export default ReviewList