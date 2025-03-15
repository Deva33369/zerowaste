import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    axios.get("http://192.168.1.79:3001/food") // ✅ Ensure this matches backend
      .then((response) => {
        setFoodItems(response.data);
      })
      .catch((error) => console.error("API Error:", error));
  }, []);

  return (
    <div>
      <h1>ZeroWaste Marketplace</h1>
      <ul>
        {foodItems.map((food) => (
          <li key={food._id}>{food.name} - Expires: {food.expiryDate}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
