import React, { useState } from "react";
import { Card, CardContent, CardMedia, CardActions, CardActionArea, Typography, Button } from "@mui/material";

const mockFoodData = [
  {
    id: 1,
    name: "Vegan Salad Bowl",
    expiry: "2024-03-18 18:00",
    image: "https://via.placeholder.com/150",
    ingredients: "Lettuce, Tomatoes, Avocado (Contains Nuts)",
    price: 5.99,
  },
  {
    id: 2,
    name: "Grilled Chicken Wrap",
    expiry: "2024-03-18 20:00",
    image: "https://via.placeholder.com/150",
    ingredients: "Chicken, Lettuce, Cheese (Contains Dairy)",
    price: 7.49,
  },
  {
    id: 3,
    name: "Gluten-Free Pasta",
    expiry: "2024-03-18 19:30",
    image: "https://via.placeholder.com/150",
    ingredients: "Rice Pasta, Tomato Sauce (Gluten-Free)",
    price: 8.99,
  },
];

const FoodMarketplace = () => {
  const [priceFilter, setPriceFilter] = useState(10);
  const [allergenFilter, setAllergenFilter] = useState("");

  const filteredFood = mockFoodData.filter((food) => 
    food.price <= priceFilter && 
    (allergenFilter === "" || !food.ingredients.includes(allergenFilter))
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-green-700 mb-6 text-center">Surplus Food Marketplace</h2>
      
      <div className="flex justify-between mb-6">
        <div>
          <label className="font-semibold mr-2">Max Price: ${priceFilter}</label>
          <input 
            type="range" 
            min="1" max="20" 
            value={priceFilter} 
            onChange={(e) => setPriceFilter(Number(e.target.value))} 
            className="cursor-pointer"
          />
        </div>
        <div>
          <label className="font-semibold mr-2">Filter Allergens:</label>
          <select 
            value={allergenFilter} 
            onChange={(e) => setAllergenFilter(e.target.value)} 
            className="border p-2 rounded">
            <option value="">None</option>
            <option value="Nuts">Nut-Free</option>
            <option value="Dairy">Dairy-Free</option>
            <option value="Gluten">Gluten-Free</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredFood.map((food) => (
          <div key={food.id} className="bg-white rounded-lg shadow-md p-4">
            <Card sx={{ maxWidth: 345, margin: "auto", boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="140"
                image={food.image}
                alt={food.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {food.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expiry: {food.expiry}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingredients: {food.ingredients}
                </Typography>
                <Typography variant="h6" color="green">
                  ${food.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMarketplace;
