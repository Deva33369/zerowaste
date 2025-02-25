const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const foodRoutes = require("./routes/foodRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Setup API route for food donations
app.use("/food", foodRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Food Donation Service is running!");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [Food Donation] MongoDB Connected"))
  .catch(err => console.error("❌ [Food Donation] MongoDB Connection Failed", err));

const PORT = process.env.FOOD_PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Food Donation Service running on port ${PORT}`));
