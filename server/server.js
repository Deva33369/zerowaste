const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.error(err));

const FoodSchema = new mongoose.Schema({
  name: String,
  expiryDate: String
});

const Food = mongoose.model("Food", FoodSchema);

app.post("/donate", async (req, res) => {
  const food = new Food(req.body);
  await food.save();
  res.json({ message: "Food donation added!" });
});

app.get("/food", async (req, res) => {
  const foodItems = await Food.find();
  res.json(foodItems);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
