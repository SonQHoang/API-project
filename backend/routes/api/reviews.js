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

// Adding image to review based on Review Id

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

// Getting all User Reviews

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
        return jsonReview
    })
    res.json({ Reviews: reviewImages })
})

// Editing Reviews

router.put("/:reviewId", requireAuth, createReviewChecker, async (req, res) => {

})

// Deleting Reviews

router.delete('/:reviewId', requireAuth, async (req, res, next) => {

})
module.exports = router;