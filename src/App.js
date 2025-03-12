import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const App = () => {
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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>UV Index Checker</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <p>
            Location: <strong>{place}</strong>
          </p>
          <p>
            Current UV Index: <strong>{uvIndex !== null ? uvIndex : "N/A"}</strong>
          </p>
        </>
      )}
    </div>
  );
};

export default App;