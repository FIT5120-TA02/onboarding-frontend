import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Weather.css";

const API_BASE_URL = "http://localhost:3001";

const Weather = () => {
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [uvResponse, locationResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/uv?lat=${lat}&lon=${lon}`),
        axios.get(`${API_BASE_URL}/api/location?lat=${lat}&lon=${lon}`),
      ]);
      setUvIndex(uvResponse.data.uvIndex);
      setPlace(locationResponse.data.location);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Location access denied. Enable location services.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetchData(location.lat, location.lon);
    }
  }, [location, fetchData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="weather-container">
      <h2>UV Index Checker</h2>
      <p>
        Location: <strong>{place}</strong>
      </p>
      <p>
        Current UV Index: <strong>{uvIndex !== null ? uvIndex : "N/A"}</strong>
      </p>
    </div>
  );
};

export default Weather;