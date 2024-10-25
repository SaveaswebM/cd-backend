
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const prisma = require('../../prismaClient');
const razorpay = new Razorpay({
    key_id: 'rzp_test_vCQDlKcu1PydlH',
    key_secret: 'ZGSmGmCjayjHig0zx7LGqZFy',
});

// Create Customer API
// Create Customer API
router.post('/create-customer', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Check if the user exists
        const checkUserExist = await prisma.user.findUnique({
            where: { email: email } // Use findUnique with where
        });

        if (checkUserExist) {
            // If user exists, check for subscriptions
            const subscriptions = await prisma.subscription.findMany({
                where: { userId: checkUserExist.id } // Filter subscriptions by userId
            });

            if (subscriptions.length > 0) {
                // If subscriptions exist, return the razorpayCustomerId
                return res.status(200).json({ razorpayCustomerId: subscriptions[0].razorpayCustomerId });
            }
        }

        // Create a new Razorpay customer if user doesn't exist or has no subscriptions
        const customer = await razorpay.customers.create({
            name,
            email,
        });

        // You might want to create the user in your database too, if they didn't exist
        if (!checkUserExist) {
            await prisma.subscription.create({
                data: {
                    userId: userId,
                    razorpayCustomerId: customer.id, // Save Razorpay Customer ID in Subscription
                    planId: "default_plan_id", // Set a default or fetched plan ID
                    amount: 0, // Set an appropriate amount
                    status: "Active", // Set the initial status
                    autoRenew: true, // Set to true or as needed
                },
            });

        }

        // Return the newly created customer ID
        res.status(201).json({ customerId: customer.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create customer' });
    }
});


module.exports = router;
