// routes/updateSubscription.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Update User Subscription API
router.post("/update-subscription", async (req, res) => {
  const { userId, subscriptionId, status } = req.body;

  try {
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status
      }
    });

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update subscription" });
  }
});

module.exports = router;
