const CREATE_NEW_SPOT = "spots/newSpot";

//!6 Action Creator; Taking in info from Thunk Action Creator, sending to reducer
const newSpot = (spot) => {
  console.log('this is our spot data', spot)
  return {
    type: CREATE_NEW_SPOT,
    // payload here
    payload: spot,
  };
};
//! 2 Thunk Action Creator for New Spots
//! Going to make the fetch request to the backend to gather our data

export const createSpot = (payload) => async (dispatch) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

//! 7 Moving to Reducer FROM normal action creator

const initialState = { spots: {}, singleSpot: {} };

const newSpotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_SPOT: {
      //! Coming from our Redux Store Shape
      const newSpot = action.payload;
      return {
        //? We create a shallow copy to make sure we don't mutate our original state
        ...state,
        
        spots: {
          //? We're creating a shallow copy of our original (current) state.spots, which is a new ref in memory
          ...state.spots,
          [newSpot.id]: newSpot,
        },
        singleSpot: newSpot, 
      };
    }
    default:
      return state;
  }
};

export default newSpotReducer;
