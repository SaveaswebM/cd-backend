// routes/webhook.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/razorpay-webhook', async (req, res) => {
    const { event, payload } = req.body;

    if (event === 'subscription.activated') {
        const subscription = payload; // Get subscription details

        // Update the user subscription in the database
        await prisma.subscription.create({
            data: {
                userId: subscription.customer_id, // Link to user ID
                razorpayCustomerId: subscription.customer_id,
                planId: subscription.plan_id,
                startDate: new Date(subscription.current_start * 1000),
                endDate: new Date(subscription.current_start * 1000 + subscription.total_count * 30 * 24 * 60 * 60 * 1000), // Adjust based on plan
                amount: subscription.amount,
                status: subscription.status,
            },
        });
    }

    res.status(200).send('Webhook received');
});

module.exports = router;
