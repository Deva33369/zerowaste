const express = require("express");
const FoodDonation = require("../models/FoodDonation");

const router = express.Router();

// Fetch all food donations
router.get("/", async (req, res) => {
  try {
    const foodItems = await FoodDonation.find();
    console.log("✅ API Data Fetched:", foodItems);  // Debugging log
    res.json(foodItems);
  } catch (error) {
    console.error("❌ Error fetching food:", error);
    res.status(500).json({ error: "Failed to fetch food donations" });
  }
});

module.exports = router;
