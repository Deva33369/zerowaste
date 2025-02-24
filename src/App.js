import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/food").then((response) => {
      setDonations(response.data);
    });
  }, []);

  return (
    <div>
      <h1>ZeroWaste Marketplace</h1>
      <h2>Available Food Donations:</h2>
      <ul>
        {donations.map((food) => (
          <li key={food._id}>
            {food.name} - Expiry: {food.expiryDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
