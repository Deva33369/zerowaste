const express = require("express");
const Review = require("../models/Review"); // ✅ Ensure this model exists

const router = express.Router();

// ✅ Fetch all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    console.log("✅ API Data Fetched (Reviews):", reviews);
    res.json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ✅ Create a new review
router.post("/", async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("❌ Error creating review:", error);
    res.status(400).json({ error: "Failed to create review" });
  }
});

module.exports = router;
