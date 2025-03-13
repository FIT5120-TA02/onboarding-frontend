import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import WeatherIcon from "./WeatherIcon";
import UVWarning from "../UVWarning/UVWarning";
import "./Weather.css";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Weather = () => {
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState("Loading...");
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherResponse, locationResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${WEATHER_API_KEY}`
        ),
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}&result_type=locality`
        ),
      ]);

      setUvIndex(weatherResponse.data.current.uvi);
      setTemperature(Math.round(weatherResponse.data.current.temp));
      setPlace(locationResponse.data.results?.[0]?.formatted_address || "Unknown Location");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (query) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}, AU&region=au&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (res.data.results.length === 0) {
        setError("Location not found. Try a more specific location.");
        return;
      }

      const { lat, lng } = res.data.results[0].geometry.location;
      setLocation({ lat, lon: lng });
      setError(null);
    } catch (err) {
      console.error("Error fetching location:", err);
      setError("Failed to fetch location.");
    }
  };

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
    <div className="weather-container">
      <div className="header-container">
        <h1>UV Checker</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ fontSize: "50px", textAlign: "center", marginTop: "20px" }}>
        <p>Current UV Index: <strong>{uvIndex !== null ? uvIndex : "N/A"}</strong></p>
      </div>

      <UVWarning uvIndex={uvIndex} />

      <p>Location: <strong>{place}</strong></p>
      <p>Current Temperature: <strong>{temperature !== null ? temperature : "N/A"} °C</strong></p>

      {location && <WeatherIcon lat={location.lat} lon={location.lon} />}
    </div>
  );
};

export default Weather;