import React, { useState } from "react";

const FoodListingForm = () => {
  const [foodData, setFoodData] = useState({
    name: "",
    expiry: "",
    image: "",
    ingredients: "",
    price: "",
  });

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoodData({ ...foodData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Food Submitted:", foodData);
    // API call can be integrated here
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">List Your Surplus Food</h1>
        <p className="text-lg text-gray-600">Help reduce food waste by sharing surplus food with those in need.</p>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4 text-green-700">List Surplus Food</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={foodData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="expiry"
          value={foodData.expiry}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
          required
        />
        {foodData.image && <img src={foodData.image} alt="Preview" className="w-32 h-32 mt-2 object-cover" />}
        <textarea
          name="ingredients"
          placeholder="List ingredients & allergens (e.g., Contains nuts, dairy-free)"
          value={foodData.ingredients}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={foodData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded hover:bg-green-700 w-full"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
};

export default FoodListingForm;
