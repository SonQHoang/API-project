import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import '.Spots.css';

//! 1. Form for collecting User Data on Creating a Spot
const CreateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  //!9. Using useSelector for our component to listen to our changes in state
  const newSpotList = useSelector((state) => Object.values(state.newSpot));

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [validationObject, setValidationObject] = useState({});

  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the fields of the spot object
    const errorsObject = {};
    if (address === "") {
      errorsObject.address = "You must submit an address";
    }
    if (city === "") {
      errorsObject.city = "You must submit a city";
    }
    if (state === "") {
      errorsObject.state = "You must submit a state";
    }
    if (country === "") {
      errorsObject.country = "You must submit a country";
    }
    if (description === "") {
      errorsObject.description = "You must submit a description";
    }
    if (price === "") {
      errorsObject.price = "You must submit a price";
    }
    setValidationObject(errorsObject);

    if (Object.keys(errorsObject).length > 0) {
      return;
    }

    const spot = {
      address,
      city,
      state,
      country,
      name,
      description,
      price,
    };
    dispatch(CreateSpot(spot));

    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setName("");
    setDescription("");
    setPrice("");

    history.push("/")
  };

  return (
    <>
      <h1>User's Spots</h1>
      {newSpotList.map((spot) => (
        <p key={spot.id}>{spot.name}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value )}
          placeholder="City"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <button type="submit">Create a New Spot</button>
      </form>
    </>
  );
};

export default CreateSpot;
