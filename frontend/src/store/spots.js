import { csrfFetch } from "./csrf";

const CREATE_SPOT = "spots/newSpot";
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";

//-------------------------------------------------------------------------ACTION CREATORS-------------------------------------------------
//!6 Action Creator; Taking in info from Thunk Action Creator, sending to reducer
const acCreateSpot = (spots) => {
  return {
    type: CREATE_SPOT,
    spots,
  };
};

const acGetAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const acUpdateSpot = (spots) => {
  return {
    type: UPDATE_SPOT,
    spots,
  };
};

const acDeleteSpot = (spots) => {
  return {
    type: DELETE_SPOT,
    spots,
  };
};

//-------------------------------------------------------------------THUNK ACTION CREATORS ---------------------------------------------------------
//! 2 Thunk Action Creator for New Spots
//! Going to make the fetch request to the backend to gather our data

export const createSpot = (data) => async (dispatch) => {
  try {
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
      const errors = await response.text();
      throw new Error(`Failed to create spot: ${errors}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAllSpots = () => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots`);
    if(response.ok) {
      const data = await response.json()
      // console.log('What does our data look like?', data)
      const spots = data.Spots
      // console.log('What does our spot data look like?',spots)
      dispatch(acGetAllSpots(spots))
    }
  } catch (error) {
    console.error(error)
  }
};

export const updateSpot = (spots) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spots),
    });
    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(acUpdateSpot(updatedSpot));
      return updatedSpot;
    } else {
      const errors = await response.text();
      throw new Error(`Failed to create spot: ${errors}`);
    }
  } catch (error) {
    const errors = await error.json();
    return errors;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if(response.ok) {
      dispatch(acDeleteSpot(spotId))
    }
  }  catch (error) {
    const errors = await error.json();
    return errors;
  }
};

//-----------------------------------------------Reducer-------------------------------------------------
//! 7 Moving to Reducer FROM normal action creator

//! Coming from our Redux Store Shape
const initialState = { allSpots: {}, singleSpot: {} };

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT: {
      return {
        //? We create a shallow copy to make sure we don't mutate our original state
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spots.id]: action.spots,
        },
      };
    }
    case GET_ALL_SPOTS: {
      return {
        ...state,
        allSpots: action.spots
      };
    }
    case UPDATE_SPOT: {
      const updatedSpot = action.spots
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [updatedSpot.id]: updatedSpot
        }
      };
    }
    case DELETE_SPOT: {
      const spotId = action.spots
      const updatedAllSpots = { ...state.allSpots };
      delete updatedAllSpots[spotId]
      return {
        ...state,
        allSpots: updatedAllSpots
      };
    }

    default:
      return state;
  }
};

export default spotReducer;
