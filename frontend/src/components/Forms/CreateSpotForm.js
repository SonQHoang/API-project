import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot } from '../../store/spots'

const CreateSpotsForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    //!9. Using useSelector for our component to listen to our changes in state
    
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [lat, setLat] = useState(50);
    const [lng, setLon] = useState(50);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [validationObject, setValidationObject] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
  
    useEffect(() => {
      const isValid = Object.keys(validationObject).length === 0;
      setIsFormValid(isValid);
    }, [validationObject]);
  
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
      if (name === "") {
        errorsObject.name = "You must submit a name";
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
        lat,
        lng,
        description,
        price,
      };
      dispatch(createSpot(spot));
  
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setName("");
    //   setLat("");
    //   setLon("");
      setDescription("");
      setPrice("");
  
      history.push("/");
    };
  
    return (
      <>
        <h1>User's Spots</h1>
        <h2>Where's your place located?</h2>
        <h3>Guests will only get exact address once they have booked a reservation.</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </label>
          {validationObject.address && (
            <p className="errors">{validationObject.address}</p>
          )}
          <label>
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </label>
          {validationObject.city && (
            <p className="errors">{validationObject.city}</p>
          )}
          <label>
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </label>
          {validationObject.state && (
            <p className="errors">{validationObject.state}</p>
          )}
          <label>
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
          </label>
          {validationObject.country && (
            <p className="errors">{validationObject.country}</p>
          )}
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </label>
          {validationObject.name && (
            <p className="errors">{validationObject.name}</p>
          )}
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </label>
          {validationObject.description && (
            <p className="errors">{validationObject.description}</p>
          )}
          <label>
            Price
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </label>
          {validationObject.price && (
            <p className="errors">{validationObject.price}</p>
          )}
          <button type="submit" disabled={!isFormValid}>
            Create a New Spot
          </button>
        </form>
      </>
    );
  };
  
  export default CreateSpotsForm;
  