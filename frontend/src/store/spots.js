import { csrfFetch } from "./csrf";
import arrayToObjectByKey from '../utils'

const CREATE_SPOT = "spots/newSpot";
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const GET_SPOT_BY_ID = "spots/GET_SPOT_BY_ID"

//-------------------------------------------------------------------------ACTION CREATORS-------------------------------------------------
//!6 Action Creator; Taking in info from Thunk Action Creator, sending to reducer
const acCreateSpot = (spots) => {
  // console.log('Action payload:========>', spots);
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

const acGetSpotById = (spotId) => {
  // console.log('Action payload:========>', spotId);
  return {
    type: GET_SPOT_BY_ID,
    spotId,
  };
};

const acUpdateSpot = (spots) => {
  return {
    type: UPDATE_SPOT,
    spots,
  };
};

const acDeleteSpot = (spots) => {
  // console.log('Action payload:========>', spots);
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
    if (response.ok) {
      const data = await response.json()
      const spots = data.Spots
      dispatch(acGetAllSpots(spots))
    }
  } catch (error) {
    console.error(error)
  }
};

export const getSpotById = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();

      dispatch(acGetSpotById(spot))
    } else {
      throw new Error('Failed to fetch spot by ID')
    }
  } catch (error) {
    console.error(error)
  }
}

export const updateSpot = (spot) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
        description: spot.description,
        price: spot.price,
        previewImageUrl: spot.previewImageUrl,
        imageUrls: spot.imageUrls,
      }),
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
    if (response.ok) {
      dispatch(acDeleteSpot(spotId))
    }
  } catch (error) {
    const errors = await error.json();
    return errors;
  }
};

//-----------------------------------------------Reducer-------------------------------------------------
//! 7 Moving to Reducer FROM normal action creator

//! Coming from our Redux Store Shape
const initialState = {
  allSpots: {},
  singleSpot: {}
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spots.id]: action.spots,
        },
      };
    }
    case GET_ALL_SPOTS: {
      const allSpotsObject = arrayToObjectByKey(action.spots, 'id');
      return {
        ...state,
        allSpots: allSpotsObject
      }
    }
    case GET_SPOT_BY_ID: {
      return {
        ...state,
        singleSpot: action.spotId,
      };
    }
    case UPDATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spots.id]: action.spots,
        }
      }
    }
    case DELETE_SPOT: {
      const spotId = action.spots
      const allSpotsCopy = { ...state.allSpots };
      delete allSpotsCopy[spotId];
      return {
        ...state,
        allSpots: allSpotsCopy
      }

      // const stateObject = {}
      // state.allSpots.forEach((spot) => {
      //   stateObject[spot.id] = spot
      // })
      // delete stateObject[spotId]
      // const stateArray = Object.values(stateObject)
      // return {
      //   ...state,
      //   allSpots: stateArray
      // };
      // console.log('Looking at spotId========>',spotId)
      // const updatedAllSpots = { ...state.allSpots };
      // console.log('Looking updatedAllSpots===>', updatedAllSpots)
      // delete updatedAllSpots[spotId]
    }

    default:
      return state;
    }
};

export default spotReducer;
