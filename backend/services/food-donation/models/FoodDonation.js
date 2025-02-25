const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["available", "claimed"], default: "available" }
});

module.exports = mongoose.model("FoodDonation", FoodSchema);
