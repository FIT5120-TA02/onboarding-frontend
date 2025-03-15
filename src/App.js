import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LearnMore from "./components/LearnMore/LearnMore";
import WeatherIcon from "./components/Weather/WeatherIcon";
import UVWarning from "./components/UVWarning/UVWarning";
import Weather from "./components/Weather/Weather";
import "./App.css";

const App = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Unable to retrieve location. Please check your browser settings.");
      }
    );
  }, []);

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {error && <p className="error-text">{error}</p>}
                {location ? (
                  <Weather location={location} setWeatherData={setWeatherData} />
                ) : (
                  <p className="loading-text">Getting your location...</p>
                )}

                {weatherData && (
                  <div className={`weather-container ${weatherData.bgClass}`}>
                    <div style={{ fontSize: "50px", textAlign: "center", marginTop: "20px" }}>
                      <p>
                        Current UV Index: <strong>{weatherData.uvIndex !== null ? weatherData.uvIndex : "N/A"}</strong>
                      </p>
                    </div>
                    <UVWarning uvIndex={weatherData.uvIndex} />
                    <p>
                      Location: <strong>{weatherData.place}</strong>
                    </p>
                    <p>
                      Current Temperature: <strong>{weatherData.temperature !== null ? weatherData.temperature : "N/A"} °C</strong>
                    </p>
                    {location && weatherData.weatherMain && <WeatherIcon lat={location.lat} lon={location.lon} />}
                  </div>
                )}
              </>
            }
          />
          <Route path="/learn-more" element={<LearnMore />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;