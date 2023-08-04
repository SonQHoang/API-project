import { csrfFetch } from './csrf'

const GET_ALL_REVIEWS = "reviews/GET_ALL_REVIEWS"
const GET_SPOT_REVIEWS = "spots/GET_SPOT_REVIEWS"
const CREATE_REVIEWS = "reviews/CREATE_REVIEWS";
const DELETE_REVIEWS = "reviews/DELETE_REVIEWS";

const acGetAllReviews = (reviews) => ({
    type: GET_ALL_REVIEWS,
    reviews
})

const acGetSpotReviews = (spotReviews) => ({
    type: GET_SPOT_REVIEWS,
    spotReviews
})

const acCreateReviews = (review) => ({
    type: CREATE_REVIEWS,
    review
})

const acDeleteReviews = (reviewId) => ({
    type: DELETE_REVIEWS,
    reviewId
})


export const getCurrentReviews = (spots) => async (dispatch) => {
    try {
        const response = await csrfFetch(`api/reviews/current`)

        if(response.ok) {
            const reviews = await response.json()
            dispatch(acGetAllReviews(reviews))
        }
    } catch(error) {
        const errors = await error.json()
        return errors
    }
}

export const getSpotReviews = (spotId) => async (dispatch) => {
    try {
        const response = await fetch(`api/spots/${spotId}/reviews`);

        if(response.ok){
            const spotReviews = await response.json()
            dispatch(acGetSpotReviews(spotReviews))
        }
    } catch(error) {
        const errors = await error.json()
        return errors;
    }
}

export const createReviews = (spotId, data, user) => async (dispatch) => {
    try{
        const response = await csrfFetch(`api/spots/${spotId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            const review = await response.json();
            review.User = user
            dispatch(acCreateReviews(review));
            return review;
        }
    } catch (error) {
        const errors = await error.json()
        return errors;
    }
}

export const deleteReviews = (reviewId) => async dispatch => {
    try {
        const response = await csrfFetch(`api/reviews/${reviewId}`, {
            method: "DELETE"
        });

        if(response.ok) {
            dispatch(acDeleteReviews(reviewId));
        }
    } catch (error) {
        const errors = await error.json()
        return errors
    }
}

const initialState = {
    singleSpot: {}
}

export default function reviewsReducer(state = initialState, action) {
    switch(action.type) {
        case GET_ALL_REVIEWS: {
            return {
                ...state, singleSpot: {
                    ...action.reviews
                }
            }
        }
        case GET_SPOT_REVIEWS: {
            let newState = {
                ...state,
                singleSpot: {
                    ...state.singleSpot
                }
            }

            newState.singleSpot = {}
            action.singleSpot.Reviews.forEach(element => {
                newState.singleSpot[element.id] = element
            })
            return {...newState}
        }

        case CREATE_REVIEWS: {
            const newState = {
                ...state,
                singleSpot: {
                    ...state.singleSpot
                }
            }
            delete newState.spot[action.review]
            return newState
        }
        default:
            return state;
    }
}