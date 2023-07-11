const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')

const { Spot, User, Booking, SpotImage, Review, ReviewImage } = require('../../db/models')

const router = express.Router()


const spotValidator = (req, res, next) => {
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

// Getting All Spots
router.get('/', spotValidator, async (req, res) => {

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

        reviews.forEach((review) => {
            totalRating += review.stars;
        });
        const avgRating = (totalRating / reviews.length).toFixed(2);
        spotJson.avgRating = avgRating;
        if (spotJson.SpotImages.length) {
            spotJson.previewImage = spotJson.SpotImages[0].url;
        }
        delete spotJson.Reviews;
        delete spotJson.SpotImages;

        return spotJson;
    });
    res.json({ Spots: spotWithRatings, page, size });
})

// Create Image for Spot

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        })
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to the current user",
        })
    }

    const { url, preview } = req.body;
    const newSpotImage = await SpotImage.create({
        spotId: req.params.spotId,
        url,
        preview
    });
    res.json({
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
    });
});


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

// Get Spot of a Current User

router.get('/current', requireAuth, async (req, res) => {
    
    const userId = req.user.id
    let spots = await Spot.findAll({
        include: [
            { model: Review }, { model: SpotImage, attributes: ["url"] }
        ],
        where: { ownerId: userId }
    })

    let userSpots = spots.map((spot) => {
        let spotJson = spot.toJSON();

        let totalRating = 0;
        let reviews = spotJson.Reviews;

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
        // console.log(userSpots);
        res.json({ Spots: userSpots });
      });

// Edit Spot

router.put('/:spotId', requireAuth, spotChecker, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
        })
    }
    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to the current user",
        })
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const editSpot = await spot.update({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.json(editSpot);
})

//Delete Spot

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to the current user",
        })
    }
    await spot.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;