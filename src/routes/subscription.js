// routes/subscription.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.KEY_TEST_ID,
    key_secret: process.env.KEY_TEST_SECRET,
});

// Create Subscription API
router.post('/create-subscription', async (req, res) => {
    const { plan_id, customer_id } = req.body;

    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id,
            customer_id,
            total_count: 12, // Number of months for the subscription
            current_start: Math.floor(Date.now() / 1000), // Subscription starts immediately
            // Add any other parameters as needed
        });

        res.status(201).json({ subscriptionId: subscription.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

module.exports = router;
