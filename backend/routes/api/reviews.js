const express = require("express");
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, User, Booking, SpotImage, Review, ReviewImage } = require('../../db/models')

const router = express.Router();

// review Validator

const reviewValidator = (req, res, next) => {
    const { review, stars } = req.body;

    const errors = {};
    if (!review) {
        errors.review = "Review text is required"
    }
    if (NaN(stars) || stars > 5 || stars < 1) {
        errors.stars = "Stars must be an integer from 1 to 5"
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        })
    }
}

//------------------------------------------------------------------Adding Image Based on Review Id----------------------------------------------

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    // if review doesn't exist throw error
    if (!review) {
        res.status(404);
        res.json({ message: "Review couldn't be found" })
    }
    if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Review must belong to the current user" })
    }
    let totalImagesFromReview = await ReviewImage.count({
        where: { reviewId: req.params.reviewId }
    })
    if (totalImagesFromReview >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
    }
    const newReviewImage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url: req.body.url
    })
    res.json({
        id: newReviewImage.id,
        url: newReviewImage.url
    })
})

//------------------------------------------------------------------Get All Reviews of Current User----------------------------------------------

router.get('/current', requireAuth, async (req, res) => {
    let totalReviews = await Review.findAll({
        include: [
            { model: User, attributes: ["id", 'firstName', "lastName"] },
            { model: ReviewImage, attributes: ["id", 'url'] },
            { model: Spot,attributes: 
                ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',],
                include: [
                    { model: SpotImage, attributes: ['url']}
                ]
            }
        ],
        where: { userId: req.user.id }
    });
    let reviewImages = totalReviews.map((review) => {
        let jsonReview = review.toJSON();
        if (jsonReview.Spot.SpotImages.length) {
            jsonReview.Spot.previewImage = jsonReview.Spot.SpotImages[0].url
        }
        delete jsonReview.Spot.SpotImages

        return jsonReview
    })

    // brute forcing the response to look like how it should in the API docs
    
    let response = {
        Reviews: reviewImages.map((review) => ({
            id: review.id,
            spotId: review.spotId,
            userId: review.userId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.User.id,
                firstName: review.User.firstName,
                lastName: review.User.lastName,
            },
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                state: review.Spot.state,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.previewImage,
            },
            ReviewImages: review.ReviewImages.map((image) => ({
                id: image.id,
                url: image.url
            }))
        }))
    }
    res.json(response)
})

// Editing Reviews

router.put("/:reviewId", requireAuth, reviewValidator, async (req, res) => {

})

// Deleting Reviews

router.delete('/:reviewId', requireAuth, async (req, res, next) => {})

module.exports = router;