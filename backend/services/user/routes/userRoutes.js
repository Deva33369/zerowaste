const express = require("express");
const User = require("../models/User"); // ✅ Ensure this model exists

const router = express.Router();

// ✅ Fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("✅ API Data Fetched (Users):", users);
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(400).json({ error: "Failed to create user" });
  }
});

module.exports = router;
