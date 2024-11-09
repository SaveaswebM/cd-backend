// routes/subscription.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const prisma = require('../../prismaClient');
const razorpay = new Razorpay({
    key_id: 'rzp_test_vCQDlKcu1PydlH',
    key_secret: 'ZGSmGmCjayjHig0zx7LGqZFy',
});

// Create Subscription API
router.post('/create-subscription', async (req, res) => {
    const { plan_id, customer_id, email } = req.body;

    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id,
            // customer_id,
            total_count: 12, // Number of months for the subscription
            current_start: Math.floor(Date.now() / 1000), // Subscription starts immediately
            customer: {
                email: email,
            },
            notify: {
                email: true,
                sms: false,
            },
            notify_info: {

                notify_email: email
            }
        });
        // res.status(201).json(subscription);
        res.status(201).json({ subscriptionId: subscription.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

router.post("/update-subscription-after-payment", async (req, res) => {
    const {
        email,
        subscriptionType,
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id,
    } = req.body;

    try {
        // Verify payment signature
        // const isValid = razorpay.utils.validateWebhookSignature(
        //     `${razorpay_payment_id}|${razorpay_subscription_id}`,
        //     razorpay_signature,
        //     "cd1234" // replace with your webhook secret
        // );

        // if (!isValid) {
        //     return res.status(400).json({ message: "Payment verification failed" });
        // }

        // Payment verified successfully
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

        if (paymentDetails.status !== "captured") {
            return res.status(400).json({ message: "Payment not captured" });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update subscription type in the user record
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: { subscriptionType: subscriptionType },
        });

        return res.status(200).json({
            message: "Subscription updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
