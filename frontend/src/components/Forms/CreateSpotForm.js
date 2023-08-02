import React, { useState } from 'react';
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

  const disable = 
  !address ||
  !city ||
  !state ||
  !country ||
  !name ||
  !description ||
  description.length < 30 ||
  !price;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorsObject = {};
    if (address === "") {
      errorsObject.address = "Address is required";
    }
    if (city === "") {
      errorsObject.city = "City is required";
    }
    if (state === "") {
      errorsObject.state = "State is required";
    }
    if (country === "") {
      errorsObject.country = "Country is required";
    }
    if (name === "") {
      errorsObject.name = "Name is required";
    }
    if (description === "") {
      errorsObject.description = "Description is required";
    }
    if (description.length < 30) {
      errorsObject.description = "Description needs 30 or more characters";
    }
    if (price === "") {
      errorsObject.price = "Price per night is required";
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
        const createdSpot = await dispatch(createSpot(updatedSpot))
        
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
        
        if(createdSpot && createdSpot.id) {
        history.push(`/spots/${createdSpot.id}`);
        }
      }
  };

  return (
    <>
      <h1>Create a New Spot</h1>
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
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <button type="submit" disabled={disable}>
          {buttonText || "Create Spot"}
        </button>
      </form>
    </>
  );
};

export default CreateSpotsForm;
