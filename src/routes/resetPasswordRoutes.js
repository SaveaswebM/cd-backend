// src/routes/resetPasswordRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../../prismaClient');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New Password must be at least 8 characters long' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpiration: null,
            },
        });

        res.json({ message: 'Password has been reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
