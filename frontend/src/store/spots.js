const CREATE_NEW_SPOT = "spots/newSpot";

//!6 Action Creator; Taking in info from Thunk Action Creator, sending to reducer
const newSpot = (spot) => {
  return {
    type: CREATE_NEW_SPOT,
    spot,
    // payload here
  };
};
//! 2 Thunk Action Creator for New Spots
//! Going to make the fetch request to the backend to gather our data

export const createSpot = (spotData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(spotData),
  };
  //! 5 Getting the data back, sending it up to normal action creator
  const response = await fetch("api/spots/newSpot", options);
  if (response.ok) {
    const spotData = await response.json();
    console.log("Checking that data is what we're looking for", spotData);
    dispatch(newSpot(spotData));
    return spotData;
  } else {
    throw new Error(`Error creating spot`);
  }
};

//! 7 Taking in data from normal action creator

const initialState = {};

const newSpotReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_NEW_SPOT: {
        const newSpot = action.spot;
        // If errors, check state with console logo HERE
        if (!newSpot) return state;
        return {
          ...state,
          [newSpot.id]: newSpot,
        };
      }
      default: 
      return state;
    }
}

export default newSpotReducer;
