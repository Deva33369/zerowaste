const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const pickupRoutes = require("./routes/pickupRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Setup API route for pickups
app.use("/pickup", pickupRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Pickup Service is running!");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [Pickup] MongoDB Connected"))
  .catch(err => console.error("❌ [Pickup] MongoDB Connection Failed", err));

const PORT = process.env.PICKUP_PORT || 4002;
app.listen(PORT, () => console.log(`🚀 Pickup Service running on port ${PORT}`));
