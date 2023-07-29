import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, useHistory } from "react-redux";
// import '.Spots.css';

//! 1. Form for collecting User Data on Creating a Spot
const CreateSpot = () => {
  const dispatch = useDispatch();
  const newSpotList = useSelector((state) => Object.values(state.newSpot));

  const [spot, setSpot] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    name: "",
    description: "",
    price: "",
  });

  //!9. Using useSelector for our component to listen to our changes in state
  const newSpot = useSelector((state) => Object.values(state.newSpot))

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the fields of the spot object
    if (
      !spot.address ||
      !spot.city ||
      !spot.state ||
      !spot.country ||
      !spot.name ||
      !spot.description ||
      !spot.price
    ) {
      alert("All fields must be filled out.");
      return;
    }

    dispatch(createSpot(spot));

  return (
    <>
    <h1>User's Spots</h1>
    {newSpotList.map((spot) => (
      <p key={spot.id}>{spot.name}</p>
    ))}
    <form onSubmit={handleSubmit}>
      <input
      type="text"
      value={spot.address}
      onChange={(e) => setSpot({...spot, address: e.target.value})}
      placeholder="Address"
      />
      {/* for city, state, country, name, description, price */}
      <input/> 
      <input/>
      <input/>
      <input/>
      <input/>
      <input/>
      <button type="submit">Create a New Spot</button>
    </form>
      </>
  )
};

export default CreateSpot