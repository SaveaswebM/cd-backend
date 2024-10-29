// src/index.js
const express = require("express");
const Razorpay = require("razorpay");
const multer = require("multer");
const cors = require("cors");
const app = express();
// const userRoutes = require('./routes/userRoutes');
const prisma = require("../prismaClient");
const tableDataRoutes = require("./routes/tableDataRoutes");
const activityDataRoutes = require("./routes/activityDataRoutes");
const yearDataRoutes = require("./routes/yearDataRoutes");
const activityRoutes = require("./routes/activityRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
// const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const otpRoutes = require("./routes/otpRoutes"); // Include OTP routes
const otpVerificationRoutes = require("./routes/otpVerificationRoutes");
const passwordVerificationRoutes = require("./routes/passwordVerificationRoutes");
const linkDataUpdateRoutes = require("./routes/linkDataUpdateRoutes");
// razorpay
const customerRoutes = require("./routes/customer");
const subscriptionRoutes = require("./routes/subscription");
const webhookRoutes = require("./routes/webhook");
const updateSubscriptionRoutes = require("./routes/updateSubscription");

app.use(express.json()); // For parsing application/json

app.use(cors());
// Use the routes
// app.use('/api/users', userRoutes);
app.use("/api/activityData", activityDataRoutes);
app.use("/api/tabledata", tableDataRoutes);
app.use("/api/yearData", yearDataRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/tabledata", tableDataRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/register", registerRoutes);
// app.use('/api/forgot-password', forgotPasswordRoutes);
app.use("/api/reset-password", resetPasswordRoutes);
app.use("/api/otp", otpRoutes); // Use OTP routes
app.use("/api/verify-otp", otpVerificationRoutes);
app.use("/api/verify-password", passwordVerificationRoutes);
app.use("/api/link-data", linkDataUpdateRoutes);
app.use("/api", customerRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", webhookRoutes);
app.use("/api", updateSubscriptionRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));
app.post("/api/ad/upload", upload.single("image"), async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const imageUrl = `https://cd-backend-1.onrender.com/uploads/${req.file
      .filename}`;

    const newAd = await prisma.ad.create({
      data: {
        contentUrl: imageUrl,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.status(201).json({ message: "Ad created successfully", ad: newAd });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get('/api/ads', async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch ads active in the current date range
    const activeAds = await prisma.ad.findMany({
      where: {
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
    });

    if (activeAds.length === 0) {
      return res.status(404).json({ message: 'No active ads' });
    }

    res.json({
      ads: activeAds,
      displayDuration: 25000, // Display duration in milliseconds (25 seconds)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
const razorpay = new Razorpay({
  key_id: "rzp_test_vCQDlKcu1PydlH",
  key_secret: "ZGSmGmCjayjHig0zx7LGqZFy"
});

app.post("/create-subscription", async (req, res) => {
  const { plan_id } = req.body; // Plan ID from Razorpay dashboard

  const options = {
    plan_id: plan_id,
    customer_notify: 1, // Notify the customer about the subscription
    total_count: 12 // Total payments in the subscription
  };

  try {
    const subscription = await razorpay.subscriptions.create(options);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/updateSuccessfulPayment", async (req, res) => { });
app.get("/api/data", async (req, res) => {
  try {
    const activityData = await prisma.activityData.findMany({
      include: {
        year: true,
        activity: true,
        quarterlyType: true
      }
    });

    const result = {
      Monthly: {},
      Quarterly: {},
      Yearly: {}
    };

    activityData.forEach(data => {
      const year = data.year.year;
      const month = data.month;
      const name = data.activity.name;
      const dueDate = data.dueDate.toISOString().split("T")[0]; // Format date to 'YYYY-MM-DD'

      if (data.type === "Monthly") {
        if (!result.Monthly[name]) {
          result.Monthly[name] = {};
        }
        if (!result.Monthly[name][year]) {
          result.Monthly[name][year] = {};
        }
        if (!result.Monthly[name][year][month]) {
          result.Monthly[name][year][month] = [];
        }
        result.Monthly[name][year][month].push({
          name: data.taskName,
          dueDate
        });
      } else if (data.type === "Quarterly") {
        if (!result.Quarterly[name]) {
          result.Quarterly[name] = {};
        }
        if (!result.Quarterly[name][year]) {
          result.Quarterly[name][year] = [];
        }
        result.Quarterly[name][year].push({ name: data.taskName, dueDate });

      } else if (data.type === "Yearly") {
        if (!result.Yearly[name]) {
          result.Yearly[name] = {};
        }
        if (!result.Yearly[name][year]) {
          result.Yearly[name][year] = [];
        }
        result.Yearly[name][year].push({ name: data.taskName, dueDate });
      }
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
