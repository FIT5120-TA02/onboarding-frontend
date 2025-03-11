import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Fetching location...");
  const [currentTime, setCurrentTime] = useState(new Date());

  const weatherApiKey = "35d6bbe7265f1809722e6f1ed623cf71";
  const googleMapsApiKey = "AlzaSyAGjfZXico8GUg7TkylRGhNHnS21m6lECY"; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });

        fetchDetailedAddress(latitude, longitude);
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

      const uvInterval = setInterval(() => {
        fetchUvIndex(location.lat, location.lon);
      }, 5 * 60 * 1000);

      return () => clearInterval(uvInterval);
    }
  }, [location]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const fetchUvIndex = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${weatherApiKey}`;
      const response = await axios.get(url);
      setUvIndex(response.data.current.uvi);
    } catch (error) {
      console.error("Error fetching UV Index:", error);
      setError("Failed to fetch UV Index.");
    }
  };

  const fetchDetailedAddress = async (lat, lon) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleMapsApiKey}`;
      const response = await axios.get(url);

      if (response.data.status === "OK") {
        const results = response.data.results;
        if (results.length > 0) {
          const detailedAddress = results[0].formatted_address;
          setAddress(detailedAddress);
        } else {
          setAddress("Unknown Location");
        }
      } else {
        setAddress("Failed to fetch location");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Failed to fetch location");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>UV Index Checker</h1>
      <h3>{currentTime.toLocaleTimeString()}</h3>

      <p>
        Location: <strong>{address}</strong>
      </p>

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