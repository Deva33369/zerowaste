const express = require("express");
const Pickup = require("../models/Pickup"); // ✅ Ensure this model exists

const router = express.Router();

// ✅ Fetch all pickups
router.get("/", async (req, res) => {
  try {
    const pickups = await Pickup.find();
    console.log("✅ API Data Fetched (Pickups):", pickups);
    res.json(pickups);
  } catch (error) {
    console.error("❌ Error fetching pickups:", error);
    res.status(500).json({ error: "Failed to fetch pickups" });
  }
});

// ✅ Create a new pickup request
router.post("/", async (req, res) => {
  try {
    const newPickup = new Pickup(req.body);
    await newPickup.save();
    res.status(201).json(newPickup);
  } catch (error) {
    console.error("❌ Error creating pickup:", error);
    res.status(400).json({ error: "Failed to create pickup" });
  }
});

module.exports = router;
