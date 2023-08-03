import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot, updateSpot, createSpotImage } from '../../store/spots'

// Whatever we're using as a useSelector doesn't 'have the proper information when it gets rendered
// Remember useEffect fires last

const CreateSpotsForm = ({ spot, formType, buttonText }) => {
  const dispatch = useDispatch();
  const history = useHistory();

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
  const [formFilled, setFormFilled] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewImage2, setPreviewImage2] = useState('')
  const [previewImage3, setPreviewImage3] = useState('')
  const [previewImage4, setPreviewImage4] = useState('')
  const [previewImage5, setPreviewImage5] = useState('')

  const checkFormFilled = () => {
    if (
      address !== "" ||
      city !== "" ||
      state !== "" ||
      country !== "" ||
      name !== "" ||
      description !== "" ||
      price !== "" ||
      previewImageUrl !== "" ||
      imageUrls.some(url => url !== "")
    ) {
      setFormFilled(true)
    } else {
      setFormFilled(false)
    }
  }

  useEffect(() => {
    if (formType === "UpdateSpot" && spot) {
      setAddress(spot?.address || "");
      setCity(spot?.city || "");
      setState(spot?.state || "");
      setCountry(spot?.country || "");
      setName(spot?.name || "");
      setDescription(spot?.description || "");
      setPrice(spot?.price || "");
      setPreviewImageUrl(spot?.previewImageUrl || "");
      setImageUrls(spot?.imageUrls || ["", "", "", ""])
    }
    checkFormFilled()
  }, [formType, spot])

  useEffect(() => {
    const isValid = Object.keys(validationObject).length === 0;
    setIsFormValid(isValid);
    checkFormFilled()
  }, [validationObject, address, city, state, country, name, description, price, previewImageUrl, imageUrls]);

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
      setIsFormValid(false)
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

    
    if (formType === 'UpdateSpot') {
      updatedSpot.id = spot?.id
      dispatch(updateSpot(updatedSpot))
      history.push(`/spots/${spot.id}`)
      console.log('updatedSpot==========>', updatedSpot)
    } else {
      const createdSpot = await dispatch(createSpot(updatedSpot));
      await dispatch(createSpotImage(updatedSpot.id, previewImage))
      await dispatch(createSpotImage(updatedSpot.id, previewImage2))
      await dispatch(createSpotImage(updatedSpot.id, previewImage3))
      await dispatch(createSpotImage(updatedSpot.id, previewImage4))
      await dispatch(createSpotImage(updatedSpot.id, previewImage5))
      

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

      if (createdSpot && createdSpot.id) {
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
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImage2}
            onChange={(e) => setPreviewImage2(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImage3}
            onChange={(e) => setPreviewImage3(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImage4}
            onChange={(e) => setPreviewImage4(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={previewImage5}
            onChange={(e) => setPreviewImage5(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <button type="submit" disabled={!formFilled}>
          {buttonText || "Create Spot"}
        </button>
      </form>
    </>
  );
};

export default CreateSpotsForm;
