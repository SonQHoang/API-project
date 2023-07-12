const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')

const { Spot, User, Booking, SpotImage, Review, ReviewImage } = require('../../db/models')

const router = express.Router()

//------------------------------------------------------------------spotQueryFilter----------------------------------------------

const spotQueryFilter = (req, res, next) => {
    let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query


    page = parseInt(page);
    size = parseInt(size);

    let errors = {}

    // error checking for page and size
    if (page < 1) errors.page = "Page must be greater than or equal to 1";
    if (size < 1) errors.size = "Size must be greater than or equal to 1";

    // error checking for min 
    // is there a specific value for min / lat? I'm guessing outside of the range given from the API documentation
    // Confirmed with Jojo there's no specific range, going to go with my ball park values

    // Error checking for latitude and longitude ranges
    if (minLat < -50)
        errors.minLat = "Minimum latitude is invalid";
    if (maxLat > 50)
        errors.maxLat = "Maximum latitude is invalid";
    if (minLng < -150)
        errors.minLng = "Minimum longitude is invalid";
    if (maxLng > 150)
        errors.maxLng = "Maximum longitude is invalid";

    // Error checking for price range
    if (minPrice < 0)
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice < 0)
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

//------------------------------------------------------------------spotChecker----------------------------------------------


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
    if (lat < -50 || lat > 50) errors.lat = "Latitude is not valid";
    if (lng < -150 || lng > 150) errors.lng = "Longitude is not valid";
    if (name.length >= 50) errors.name = "Name must be less than 50 characters";
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

//------------------------------------------------------------------validating Reviews----------------------------------------------

const reviewValidator = (req, res, next) => {
    const { review, stars } = req.body;

    const errors = {};
    if (!review) errors.review = "Review text is required";
    if (stars > 5 || stars < 1 || isNaN(stars)) errors.stars = "Stars must be an integer from 1 to 5"

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            error: errors
        });
    };
    next()
}

//------------------------------------------------------------------Validating Booking Dates----------------------------------------------

const properBookingDates = (req, res, next) => {
    const { startDate, endDate } = req.body;

    const errors = {}

    if (startDate >= endDate) {
        errors.endDate = "endDate cannot be on or before startDate"
    }

    if (Object.keys(errors).length > 0) {
        res.status(400);
        res.json({
            message: "Bad Request",
            errors: errors
        })
    }
    next()
}
//------------------------------------------------------------------Get All Spots----------------------------------------------

router.get('/', spotQueryFilter, async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    page = page === undefined ? 1 : parseInt(page);
    size = size === undefined ? 20 : parseInt(size);

    // spot filter

    const where = {};
    if (minPrice && maxPrice) where.price = { [Op.between]: [minPrice, maxPrice] };
    if (minLat && maxLat) where.lat = { [Op.between]: [minLat, maxLat] };
    if (minLng && maxLng) where.lng = { [Op.between]: [minLng, maxLng] };


    const spots = await Spot.findAll({
        include: [{ model: Review }, { model: SpotImage, attributes: ['url'] }],
        where,
        limit: size,
        offset: size * (page - 1),
    });

    let spotRating = spots.map((spot) => {
        let jsonSpot = spot.toJSON();

        let totalRating = 0;
        let reviews = jsonSpot.Reviews;

        reviews.forEach((review) => {
            totalRating += review.stars;
        })

        const avgRating = totalRating / reviews.length
        jsonSpot.avgRating = avgRating;

        if (jsonSpot.SpotImages.length) {
            jsonSpot.previewImage = jsonSpot.SpotImages[0].url;
        }

        delete jsonSpot.SpotImages;
        delete jsonSpot.Reviews;

        return jsonSpot;
    });

    let response = {
        Spots: spotRating.map((spot) => ({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.avgRating,
            previewImage: spot.previewImage,
        })),
        page, size
    }
    res.json(response)
})

//------------------------------------------------------------------Get Current User Spots----------------------------------------------

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
    res.json({ Spots: userSpots });
});


//------------------------------------------------------------------Create New Spot----------------------------------------------

router.post('/', requireAuth, spotChecker, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

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
        price
    })
    res.status(201);
    res.json(newSpot)
})

//------------------------------------------------------------------Create Image for a Spot ----------------------------------------------

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

//------------------------------------------------------------------Get Reviews Based on Spot Id ----------------------------------------------

router.get('/:spotId/reviews', async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            { model: User, attributes: ["id", "firstName", "lastName"] },
            { model: ReviewImage, attributes: ["id", 'url'] }
        ]
    })

    let specificSpot = await Spot.findByPk(req.params.spotId)
    if (!specificSpot) {
        res.status(404),
            res.json({
                message: `Spot couldn't be found`
            })
    }
    res.json({
        Reviews: reviews
    })
})
//-------------------------------------------------------------------Booking Based on Spot Id----------------------------------------------

router.post('/:spotId/bookings', requireAuth, properBookingDates, async (req, res) => {
    let prospectiveSpot = await Spot.findByPk(req.params.spotId);

    // if the spot isnt' there, throw an error

    if (!prospectiveSpot) {
        res.status(400);
        res.json({
            message: `Spot couldn't be found`
        })
    }

    // Owner of Spot cannot book that spot

    if (prospectiveSpot.ownerId === req.user.id) {
        res.status(403)
        res.json({
            message: 'Spot must NOT belong to the current user'
        })
    }

    // conflicting booking reservations
    let errors = {}

    const existingBooking = await Booking.findOne({
        where: {
            startDate: { [Op.lte]: req.body.endDate },
            endDate: { [Op.gte]: req.body.startDate }
        }
    })

    if (existingBooking) {
        errors.startDate = "Start date conflicts with an existing booking";
            errors.endDate = "End date conflicts with an exiting booking";
    }

    if (Object.keys(errors).length > 0) {
        res.status(403)
        res.json({
            errors: errors
        })
    } else {
        // No errors means that you can book the spot
        let bookingSpot = await Booking.create({
            userId: req.user.id,
            spotId: req.params.spotId,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        })
        res.json(bookingSpot)
    }


})

//------------------------------------------------------------------Get Spot Details Based on Spot ID----------------------------------------------

router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            { model: Review },
            {
                model: SpotImage,
                attributes: ["id", 'url', "preview"]
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", 'firstName', "lastName"]
            }
        ]
    })
    if (!spot) {
        res.status(404);
        return res.json({
            message: `Spot couldn't be found`
        })
    }

    let jsonSpot = spot.toJSON();
    let reviews = jsonSpot.Reviews;
    jsonSpot.numReviews = reviews.length;
    let totalRating = 0;
    reviews.forEach((review => {
        totalRating += review.stars;
    }))

    const avgRating = totalRating / reviews.length
    jsonSpot.avgRating = avgRating
    delete jsonSpot.Reviews;
    res.json(jsonSpot)
})


//------------------------------------------------------------------Creating a New Review based on Spot Id----------------------------------------------

router.post('/:spotId/reviews', requireAuth, reviewValidator, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    const findingExistingReview = await Review.findOne({
        where: {
            userId: req.user.id,
            spotId: req.params.spotId
        }
    })

    if (findingExistingReview) {
        res.status(500)
        return res.json({
            message: "User already has a review for this spot"
        })
    }
    const { review, stars } = req.body;
    const newReview = await Review.create({
        userId: req.user.id,
        spotId: req.params.spotId,
        review,
        stars
    })
    res.status(201);
    res.json(newReview)
})

//---------------------------------------------------------------------Edit A Spot ----------------------------------------------

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

//------------------------------------------------------------------Delete A Spot ----------------------------------------------

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404)
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