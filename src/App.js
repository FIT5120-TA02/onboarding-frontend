import React, { useState, useEffect } from "react";
import Weather from "./components/Weather/Weather";
import "./App.css";



function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Unable to retrieve location. Please check your browser settings.");
      }
    );
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Weather & UV Checker</h1>
      {error && <p className="error-text">{error}</p>}
      {lat && lon ? <Weather lat={lat} lon={lon} /> : <p className="loading-text">Getting your location...</p>}
    </div>
  );
}

export default App;