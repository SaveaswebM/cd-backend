// src/index.js
const express = require("express");
const Razorpay = require('razorpay');
const cors = require("cors");
const app = express();
// const userRoutes = require('./routes/userRoutes');
const prisma = require('../prismaClient');
const tableDataRoutes = require('./routes/tableDataRoutes');
const activityDataRoutes = require('./routes/activityDataRoutes');
const yearDataRoutes = require('./routes/yearDataRoutes');
const activityRoutes = require('./routes/activityRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
// const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
const otpRoutes = require('./routes/otpRoutes'); // Include OTP routes
const otpVerificationRoutes = require("./routes/otpVerificationRoutes");
const passwordVerificationRoutes = require("./routes/passwordVerificationRoutes");
const linkDataUpdateRoutes = require("./routes/linkDataUpdateRoutes");

app.use(express.json()); // For parsing application/json

app.use(cors());
// Use the routes
// app.use('/api/users', userRoutes);
app.use("/api/activityData", activityDataRoutes);
app.use("/api/tabledata", tableDataRoutes);
app.use("/api/yearData", yearDataRoutes);
app.use("/api/activity", activityRoutes);
app.use('/api/tabledata', tableDataRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/register', registerRoutes);
// app.use('/api/forgot-password', forgotPasswordRoutes);
app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/otp', otpRoutes); // Use OTP routes
app.use("/api/verify-otp", otpVerificationRoutes);
app.use("/api/verify-password", passwordVerificationRoutes);
app.use("/api/link-data", linkDataUpdateRoutes);

const razorpay = new Razorpay({
  key_id: 'rzp_test_vCQDlKcu1PydlH',
  key_secret: 'ZGSmGmCjayjHig0zx7LGqZFy',
});

app.post('/create-subscription', async (req, res) => {
  const { plan_id } = req.body; // Plan ID from Razorpay dashboard

  const options = {
    plan_id: plan_id,
    customer_notify: 1, // Notify the customer about the subscription
    total_count: 12, // Total payments in the subscription
  };

  try {
    const subscription = await razorpay.subscriptions.create(options);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('api/createOrder', async (req, res) => {
  const options = {
    amount: 50000, // amount in the smallest currency unit (e.g., paise for INR)
    currency: 'INR',
    receipt: 'receipt_order_1',
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});
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
          result.Quarterly[name][year] = {};
        }
        const quarter =
          data.quarterlyType.startMonth + "-" + data.quarterlyType.endMonth;
        if (!result.Quarterly[name][year][quarter]) {
          result.Quarterly[name][year][quarter] = [];
        }
        result.Quarterly[name][year][quarter].push({
          name: data.taskName,
          dueDate
        });
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
