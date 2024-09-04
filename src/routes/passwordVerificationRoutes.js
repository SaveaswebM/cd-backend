

const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../../prismaClient');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New Password must be at least 8 characters long' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
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
