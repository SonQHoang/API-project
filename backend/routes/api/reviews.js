const express = require("express");
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, User, Booking, SpotImage, Review, ReviewImage } = require('../../db/models')

const router = express.Router();


// Adding image to review based on Review Id

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    // if review doesn't exist throw error
    if (!review) {
        res.status(404);
        res.json({
            message: "Review couldn't be found"
        })
    }

    if (review.userId !== req.user.id) {
        return res.status(403).json({
            message: "Review must belong to the current user"
        })
    }

    let totalImagesFromReview = await ReviewImage.count({
        where: {
            reviewId: req.params.reviewId
        }
    })

    if (totalImagesFromReview >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
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

module.exports = router;