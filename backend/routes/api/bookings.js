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

//------------------------------------------------------------------Edit a Booking--------------------------------------------------------



//------------------------------------------------------------------Delete a Booking------------------------------------------------------

router.delete('/:bookingId'), validateBookingDeletion, async (req, res, next) => {
    if(!req.user) {
        res.status(401);
        return res.json({
            message: "Authentication required"
        })
    }

    const bookingToDelete = await Booking.findByPk(req.params.bookingId);
    if(!bookingToDelete) {
        res.status(404);
        return res.json({
            message: `Booking couldn't be found`
        })
    }

    await bookingToDelete.destroy();
    res.json({
        message: "Successfully deleted"
    })

    // add other requirements tomorrow
}
module.exports = router;