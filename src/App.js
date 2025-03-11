import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Fetching location...");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const weatherApiKey = "35d6bbe7265f1809722e6f1ed623cf71";  // OpenWeather API
  const googleMapsApiKey = "AIzaSyBmMUdLcJFxq50_gh-d452pCx1iTo3qzG8"; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        reverseGeocode(latitude, longitude); 
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Location access denied. Enable location services.");
        setAddress("Failed to fetch location");
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetchUvIndex(location.lat, location.lon);
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        fetchUvIndex(location.lat, location.lon);
        reverseGeocode(location.lat, location.lon);
      }
      setCurrentTime(new Date().toLocaleTimeString());
    }, 5 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [location]);

  const reverseGeocode = async (lat, lon) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleMapsApiKey}`;
      const response = await axios.get(url);
      
      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address);
      } else {
        setAddress("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setAddress("Failed to fetch location");
    }
  };

  const fetchUvIndex = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${weatherApiKey}&units=metric&timestamp=${Date.now()}`;
      const response = await axios.get(url);

      if (response.data.current && response.data.current.uvi !== undefined) {
        setUvIndex(response.data.current.uvi);
      } else {
        setUvIndex(null);
        setError("UV Index data unavailable.");
      }
    } catch (error) {
      console.error("Error fetching UV Index:", error);
      setError("Failed to fetch UV Index.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>UV Index Checker</h1>
      <h2>{currentTime}</h2>
      <p>Location: <strong>{address}</strong></p>
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