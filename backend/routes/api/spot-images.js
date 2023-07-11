const express = require("express");
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, SpotImage } = require("../../db/models");
const router = express.Router();

// Deleting Spot Image

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let spotImage = await SpotImage.findByPk(req.params.imageId, {
        include: [{ model: Spot}]
    })

    if(!spotImage) {
        res.status(404);
        return res.json({
            message: "Spot image couldn't be found",
        })
    }

    if(spotImage.Spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to the current user"
        })
    }

    await spotImage.destroy()

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;