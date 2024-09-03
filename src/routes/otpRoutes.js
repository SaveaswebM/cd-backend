// src/routes/otpRoutes.js

const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const prisma = require('../../prismaClient');

const router = express.Router();

// Setup your email transporter (example using Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiration },
        });

        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        });

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
