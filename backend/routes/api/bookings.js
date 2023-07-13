const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, User, Booking, SpotImage, Review, ReviewImage,
} = require("../../db/models");
const router = express.Router();

//--------------------------------------------------------------------BookingValidator---------------------------------------------------------

const bookingValidator = (req, res, next) => {
    const { startDate, endDate } = req.body;

    const errors = {};
    if (endDate <= startDate) {
        errors.endDate = `endDate cannot be on or before startDate`;

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
                where: { preview: true },
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

router.put("/:bookingId", requireAuth, bookingValidator, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    let booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        })
    }

    const endDateTime = new Date(booking.endDate).getTime()
    const currentDate = Date.now();
    if (endDateTime <= currentDate) {
        res.status(403);
        return res.json({
            message: "Past bookings can't be modified"
        })
    }

    if (booking.userId !== req.user.id) {
        res.status(403);
        return res.json({
            message: "Booking must belong to the current user"
        })
    }

    const bookingStartDate = new Date(req.body.startDate);
    const bookingEndDate = new Date(req.body.endDate)

    const existingBooking = await Booking.findOne({
        where: {
            spotId: booking.spotId,
            [Op.or]: [
                {
                    startDate: { [Op.lte]: bookingEndDate },
                    endDate: { [Op.gte]: bookingStartDate },
                },
                {
                    startDate: { [Op.lte]: bookingEndDate },
                    endDate: { [Op.gte]: bookingEndDate },
                },
                {
                    startDate: { [Op.lt]: bookingStartDate },
                    endDate: { [Op.gte]: bookingEndDate },
                }
            ]
        }
    })

    if (existingBooking) {
        const errors = {}

        if (existingBooking.startDate <= bookingStartDate) {
            errors.startDate = "Start date conflicts with an existing booking"
        }

        if (existingBooking.endDate >= bookingEndDate) {
            errors.endDate = "End date conflicts with an existing booking"
        }

        res.status(403)
        res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: errors
        })
    } else {
        const editingBooking = await booking.update({
            startDate,
            endDate
        });
        res.json(editingBooking)
    }

})


//------------------------------------------------------------------Delete a Booking------------------------------------------------------
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
    let bookingToDelete = await Booking.findByPk(req.params.bookingId);

    if (!req.user) {
        res.status(401);
        return res.json({
            message: "Authentication required"
        })
    }

    if (!bookingToDelete) {
        res.status(404);
        return res.json({
            message: `Booking couldn't be found`
        })
    }

    let spot = await Spot.findByPk(bookingToDelete.spotId);
    if (bookingToDelete.userId !== req.user.id && spot.ownerId !== req.user.id) {
        res.status(403);
        res.json({
            message: `Booking must belong to the current user or the Spot must belong to the current user`
        })
    }

    const currentBookingTime = new Date(bookingToDelete.startDate).getTime();
    const currentTime = Date.now();
    // console.log(currentTime)

    if (currentBookingTime <= currentTime) {
        res.status(403);
        return res.json({
            message: `Bookings that have been started can't be deleted`
        })
    }

    await bookingToDelete.destroy()
    res.json({
        message: "Successfully deleted"
    })
})


module.exports = router;