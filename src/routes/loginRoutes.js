// src/routes/loginRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../prismaClient');

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by username
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', {

        });

        res.json({
            success: true, token, user: {
                name: user.name,
                email: user.email,
                userType: user.userType,
                subscriptionType: user.subscriptionType
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/dashboard', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by username
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.userType != "Superadmin") {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', {

        });

        res.json({
            success: true, token, user: {
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }



        // Delete the user
        await prisma.user.delete({
            where: { email },
        });

        return res.status(200).json({ success: "Account deleted successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


});
module.exports = router;
