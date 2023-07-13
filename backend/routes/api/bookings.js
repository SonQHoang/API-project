const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, User, Booking, SpotImage, Review, ReviewImage,
} = require("../../db/models");
const router = express.Router();


//------------------------------------------------------------------Get All Current User's Bookings----------------------------------------------

router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [{
            model: Spot,
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'price'
            ],
            include: [{
                model: SpotImage,
                attributes: ['url'],
                where: { preview: true},
                required: false,
            }]
        }],
    })
    let bookingsSpotImages = bookings.map((booking) => {
        const jsonBooking = booking.toJSON();

        if (jsonBooking.Spot.SpotImages.length) {
            jsonBooking.Spot.previewImage = jsonBooking.Spot.SpotImages[0].url
        }
        delete jsonBooking.Spot['SpotImages'];
        return jsonBooking
    })
    res.json({
        Bookings: bookingsSpotImages
    })
})
module.exports = router;