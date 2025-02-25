const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Setup API route for reviews
app.use("/review", reviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Review Service is running!");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [Review] MongoDB Connected"))
  .catch(err => console.error("❌ [Review] MongoDB Connection Failed", err));

const PORT = process.env.REVIEW_PORT || 4003;
app.listen(PORT, () => console.log(`🚀 Review Service running on port ${PORT}`));
