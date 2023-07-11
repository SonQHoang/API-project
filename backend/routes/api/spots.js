const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')

const { Spot, User, Booking, SpotImage, Review, ReviewImage } = require('../../db/models')

const router = express.Router()


const queryFilterForGettingSpots = (req, res, next) => {
    let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query


    page = parseInt(page);
    size = parseInt(size);

    let errors = {}

    // error checking for page and size
    if (page || page < 1) errors.page = "Page must be greater than or equal to 1";
    if (page || page < 1) errors.size = "Size must be greater than or equal to 1";

    // error checking for min 
    // is there a specific value for min / lat? I'm guessing outside of the range given from the API documentation
    // Confirmed with Jojo there's no specific range, going to go with my ball park values

    // Error checking for latitude and longitude ranges
    if (minLat && (minLat < -50 || minLat > 50))
        errors.minLat = "Minimum latitude is invalid";
    if (maxLat && (maxLat < -50 || maxLat > 50))
        errors.maxLat = "Maximum latitude is invalid";
    if (minLng && (minLng < -150 || minLng > 150))
        errors.minLng = "Minimum longitude is invalid";
    if (maxLng && (maxLng < -150 || maxLng > 150))
        errors.maxLng = "Maximum longitude is invalid";

    // Error checking for price range
    if (minPrice && minPrice < 0)
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice && maxPrice < 0)
        errors.maxPrice = "Maximum price must be greater than or equal to 0";

    // Any length inside of our error object means there's an error
    // Object.keys gives me all of the keys to my error object
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        })
    }
    next()
}

// Getting all the Spots
router.get('/', queryFilterForGettingSpots, async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

page = page === undefined ? 1 : parseInt(page);
size = size === undefined ? 20 : parseInt(size);

// spot filter

const where = {};
if (minPrice && maxPrice)
  where.price = { [Op.between]: [minPrice, maxPrice] };
if (maxLat && minLat) where.lat = { [Op.between]: [minLat, maxLat] };
if (minLng && maxLng) where.lng = { [Op.between]: [minLng, maxLng] };


const spots = await Spot.findAll({
    include: [{ model: Review }, { model: SpotImage, attributes: ["url"] }],
    where,
    limit: size,
    offset: size * (page - 1),
  });

  let spotWithRatings = spots.map((spot) => {
    let spotJson = spot.toJSON();
    console.log(spotJson);
    let totalRating = 0;
    let reviews = spotJson.Reviews;
    // console.log(reviews);

    reviews.forEach((review) => {
      totalRating += review.stars;
      // console.log(totalRating);
    });
    const avgRating = (totalRating / reviews.length).toFixed(2);
    spotJson.avgRating = avgRating;
    // console.log(spot);
    if (spotJson.SpotImages.length) {
      spotJson.previewImage = spotJson.SpotImages[0].url;
    }
    delete spotJson.Reviews;
    delete spotJson.SpotImages;

    return spotJson;
  });
  // console.log(spotWithRatings);
  res.json({ Spots: spotWithRatings, page, size });
})

const spotChecker = (req, res, next) => {
    const {
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
  
    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
    if (lng < -180 || lng > 180) errors.lng = "Longitude is not valid";
    if (name.length >= 50) errors.name = "Name must be less than 50 )characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors: errors,
      });
    }
  
    next();
  };

// Create a Spot

router.post('/', requireAuth, spotChecker, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });
    res.status(201).json(newSpot)
});

module.exports = router;