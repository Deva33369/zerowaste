const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Setup API route for users
app.use("/user", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 User Service is running!");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [User] MongoDB Connected"))
  .catch(err => console.error("❌ [User] MongoDB Connection Failed", err));

const PORT = process.env.USER_PORT || 4004;
app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
