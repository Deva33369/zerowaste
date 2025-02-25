const mongoose = require("mongoose");

const PickupSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodDonation", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  pickupDate: { type: Date, required: true }
});

module.exports = mongoose.model("Pickup", PickupSchema);
