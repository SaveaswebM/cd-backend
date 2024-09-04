// src/routes/otpVerificationRoutes.js

const express = require('express');
const prisma = require('../../prismaClient');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
