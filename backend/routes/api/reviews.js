const express = require("express");
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const {Spot,User,Booking,SpotImage,Review,ReviewImage,
} = require("../../db/models");
const router = express.Router();

module.exports = router;