const express = require('express');
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


router.post('/',
    '',
    validateSignup,
    async (req, res) => {
        const { email, password, username } = req.body;

        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            email,
            username,
            hashedPassword
        });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        })
    })

module.exports = router;