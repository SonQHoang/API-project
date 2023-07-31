import { csrfFetch } from './csrf'

const CREATE_SPOT = "spots/newSpot";
// const READ_SPOT = "spots/READ_SPOT";
// const UPDATE_SPOT = "spots/UPDATE_SPOT";
// const DELETE_SPOT = "spots/DELETE_SPOT"

//!6 Action Creator; Taking in info from Thunk Action Creator, sending to reducer
const acCreateSpot = (spots) => {
  return {
    type: CREATE_SPOT,
    spots
  };
};
//! 2 Thunk Action Creator for New Spots
//! Going to make the fetch request to the backend to gather our data

export const createSpot = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  //! 5 Getting the data back, sending it up to normal action creator
  if (response.ok) {
    const spots = await response.json();
    dispatch(acCreateSpot(spots));
    return spots;
  } else {
    const errors = await response.json();
    return errors;
  }
};

//-----------------------------------------------Reducer-------------------------------------------------
//! 7 Moving to Reducer FROM normal action creator

//! Coming from our Redux Store Shape
const initialState = { allSpots: {}, singleSpot: {} };

const newSpotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT: {
      return {
        //? We create a shallow copy to make sure we don't mutate our original state
        ...state, allSpots: {[action.spots.id]: action.spots}}
    }
    default:
      return state;
  }
};

export default newSpotReducer;
