import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateSpot } from "../../store/spots";
// import "./SignupForm.css";

function UpdateSpotModal( {spotId}) {

  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.singleSpot)
//   console.log('I wanna see this spot now============>', spot)
  const { closeModal } = useModal();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if(spot) {
        setName(spot.name);
        setCity(spot.city);
        setState(spot.state);
        setCountry(spot.country);
    }
  }, [spot])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({})

       dispatch(
        updateSpot(spotId, {
            name,
            city,
            state,
            country
        })
      )
        .then(closeModal)
        .catch((err) => {
// I'll update this in a little bit once I get the modal up and running
        });
    }
    return (
      <>
        <h1>Update Spot</h1>
        <form onSubmit={handleSubmit}>
          <label>
              Name
              <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
          </label>
          <label>
              City
              <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              />
          </label>
          <label>
              State
              <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              />
          </label>
          <label>
              Country
              <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              />
          </label>
          <button type="submit">Update</button>
        </form>
      </>
    );
  };



export default UpdateSpotModal;
