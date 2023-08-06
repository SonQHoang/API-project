import { useSelector } from "react-redux/es/hooks/useSelector";

const ReviewList = ({spot, spotReviews}) => {
    // const spotReviews = useSelector((state) => state.reviews.singleSpot);
    console.log('Are there multiple spotReview items?=======>', spotReviews)
    const user = useSelector((state) => state.session.user);

    const reviews = Object.values(spotReviews)
    .filter((review) => review.spotId === spot.id)
    .reverse()
    // const reversedReviews = [...reviews].reverse()
    // console.log('reversedReviews, we are checking the order======>', reversedReviews)


    //Calculating averageRating
    
    const calculateAverageRating = () => {
        if (reviews.length === 0) return null;
        const totalRating = reviews.reduce((sum, review) => sum + review.stars, 0);
        return totalRating / reviews.length;
      };
    
      const averageRating = calculateAverageRating();

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
            <div>
            {averageRating !== null ? (
              <div className="rating-section">
                <i className="fas fa-star"></i>
                {averageRating.toFixed(1)}
                {reviews.length > 0 && <span className="dot">·</span>}
                <span className="review-count">
                  {reviews.length} Review{reviews.length > 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              reviews.length > 0 && (
                <span className="dot">·</span>
              )
            )}
      
            {/* {reviews.length === 0 && user && user.id !== spot.ownerId && (
              <p>Be the first to post a review!</p>
            )} */}

            <div className="review-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        {/* <p>User: {review.userId}</p>
                        <p>Month Year: {formatDate(review.createdAt)}</p>
                        <p>Review: {review.review}</p> */}
                </div>
                ))}
            </div>
            </div>

        )
    }

    export default ReviewList