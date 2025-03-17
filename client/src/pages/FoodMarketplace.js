import React, { useState } from "react";

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
            <img src={food.image} alt={food.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{food.name}</h3>
            <p className="text-gray-600 text-sm">Expiry: {food.expiry}</p>
            <p className="text-gray-500 text-sm">Ingredients: {food.ingredients}</p>
            <p className="text-lg font-bold text-green-700 mt-2">${food.price.toFixed(2)}</p>
            <button className="bg-green-600 text-white px-4 py-2 mt-3 w-full rounded-lg hover:bg-green-700">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMarketplace;
