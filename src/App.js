import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get User's Current Location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Location access denied. Enable location services.");
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetchUvIndex(location.lat, location.lon);

      // Set interval to update UV Index every 5 minutes
      const interval = setInterval(() => {
        fetchUvIndex(location.lat, location.lon);
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [location]);

  const fetchUvIndex = async (lat, lon) => {
    try {
      const apiKey = "35d6bbe7265f1809722e6f1ed623cf71";
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;

      const response = await axios.get(url);
      setUvIndex(response.data.current.uvi); // Correct field name
    } catch (error) {
      console.error("Error fetching UV Index:", error);
      setError("Failed to fetch UV Index.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>UV Index Checker</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : uvIndex !== null ? (
        <p>Current UV Index: <strong>{uvIndex}</strong></p>
      ) : (
        <p>Loading UV Index...</p>
      )}
    </div>
  );
};

export default App;
