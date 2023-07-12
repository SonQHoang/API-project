const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, User, Booking, SpotImage, Review, ReviewImage} = require("../../db/models");
const router = express.Router();

//------------------------------------------------------------------Deleting Review Image----------------------------------------------


router.delete('/:imageId', requireAuth, async (req, res) => {
    let reviewImageToDelete = await ReviewImage.findByPk(req.params.imageId, {
        include: [
            {
                model: Review
            }
        ]
    })
    

    if(!reviewImageToDelete) {
        res.status(404)
        return res.json({
            message: "Review Image couldn't be found"
        })
    }

    if(reviewImageToDelete.Review.userId !== req.user.id) {
        res.status(403)
        res.json({
            message: "Review must belong to the current user"
        })
    }
    await reviewImageToDelete.destroy()

    res.json({
        message: 'Successfully deleted'
    })

})

module.exports = router