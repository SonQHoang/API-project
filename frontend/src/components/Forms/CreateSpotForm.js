import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot, updateSpot } from '../../store/spots'

// Whatever we're using as a useSelector doesn't 'have the proper information when it gets rendered
// Remember useEffect fires last

const CreateSpotsForm = ({spot, formType, buttonText}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  //!9. Using useSelector for our component to listen to our changes in state

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [lat, setLat] = useState(50);
  const [lng, setLng] = useState(50);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", ""])
  const [validationObject, setValidationObject] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if(formType === "UpdateSpot" && spot) {
      setAddress(spot?.address || "");
      setCity(spot?.city || "");
      setState(spot?.state || "");
      setCountry(spot?.country || "");
      setName(spot?.name || "");
      setDescription(spot?.description || "");
      setPrice(spot?.price || "");
      setPreviewImageUrl(spot?.preventDefault || "");
      setImageUrls(spot?.imageUrls || ["", "", "", ""])
    }
  }, [formType, spot])

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
    if (description.length < 30) {
      errorsObject.description = "Description must be at least 30 characters";
    }
    if (price === "") {
      errorsObject.price = "You must submit a price";
    }
    setValidationObject(errorsObject);

    if (Object.keys(errorsObject).length > 0) {
      return;
    }

    const updatedSpot = {
      address,
      city,
      state,
      country,
      name,
      lat,
      lng,
      description,
      price,
      previewImageUrl,
      imageUrls,
    };


      if(formType === 'UpdateSpot') {
        updatedSpot.id = spot?.id
        dispatch(updateSpot(updatedSpot))
      } else {
        dispatch(createSpot(updatedSpot));
      }

    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setName("");
    setLat(50);
    setLng(50);
    setDescription("");
    setPrice("");
    setPreviewImageUrl("");
    setImageUrls(["", "", "", ""])

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
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking,and what you love about the  neighborhood</p>
        <label>
          Please write at least 30 characters
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
          />
        </label>
        {validationObject.description && (
          <p className="errors">{validationObject.description}</p>
          )}
          <h2>Create a title for your spot</h2>
          <p>Catch guests' attention with a post title that highlights what makes your place special.</p>
          <label>
            Name of your spot
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of your spot"
            />
          </label>
          {validationObject.name && (
            <p className="errors">{validationObject.name}</p>
          )}
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <label>
          Price per night (USD)
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
          />
        </label>
        {validationObject.price && (
          <p className="errors">{validationObject.price}</p>
        )}
        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot.</h3>
        <label>
          Preview Image URL
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        <label>
          Preview Image URL
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        <label>
          Preview Image URL
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        <label>
          Preview Image URL
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        <button type="submit" disabled={!isFormValid}>
          {buttonText || "Create a New Spot"}
        </button>
      </form>
    </>
  );
};

export default CreateSpotsForm;
