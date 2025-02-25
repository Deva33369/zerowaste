const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const FoodSchema = new mongoose.Schema({
  name: String,
  expiryDate: Date,
  donor: String,
  location: String
});

const Food = mongoose.model("Food", FoodSchema);

app.post("/donate", async (req, res) => {
  const food = new Food(req.body);
  await food.save();
  res.json({ message: "Food donation recorded!" });
});

app.get("/food", async (req, res) => {
  const foodItems = await Food.find();
  res.json(foodItems);
});

app.listen(5000, () => console.log("Server running on port 5000"));
