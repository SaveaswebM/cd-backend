// src/routes/registerRoutes.js

const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../../prismaClient");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password, userType, subscriptionType } = req.body;

  if (!name || !email || !password || !userType || !subscriptionType) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType,
        subscriptionType
        // tableDataId: 1 // Adjust according to your logic
      }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
