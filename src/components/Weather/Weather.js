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
  const [weatherMain, setWeatherMain] = useState(null);
  const [isDaytime, setIsDaytime] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (lat, lon) => {
    if (!lat || !lon) {
      console.error("Invalid location coordinates");
      setError("Invalid location data.");
      return;
    }

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
      setWeatherMain(weatherResponse.data.current.weather[0].main);
      setIsDaytime(
        weatherResponse.data.current.dt > weatherResponse.data.current.sunrise &&
        weatherResponse.data.current.dt < weatherResponse.data.current.sunset
      );

      const formattedLocation = locationResponse.data.results?.[0]?.formatted_address || "Unknown Location";
      setPlace(formattedLocation);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (query) => {
    // If query is an object (lat/lon), update location directly
    if (typeof query === "object" && query.lat && query.lon) {
      console.log("Directly updating location:", query);
      setLocation(query);
      return;
    }

    // If query is not a string, show an error
    if (typeof query !== "string") {
      console.error("Invalid query:", query);
      setError("Invalid input. Please enter a valid location.");
      return;
    }

    query = query.trim();

    if (!query) {
      setError("Please enter a location.");
      return;
    }

    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!res.data.results || res.data.results.length === 0) {
        setError("Location not found. Try a more specific location.");
        return;
      }

      const { lat, lng } = res.data.results[0].geometry.location;
      console.log("Updated location:", { lat, lon: lng });

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
    if (location?.lat && location?.lon) {
      fetchData(location.lat, location.lon);
    }
  }, [location, fetchData]);

  let bgClass = "day";
  if (!isDaytime) {
    bgClass = "night";
  } else if (weatherMain === "Clouds" || weatherMain === "Mist" || weatherMain === "Fog") {
    bgClass = "cloudy";
  } else if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm") {
    bgClass = "rainy";
  }

  return (
    <div className={`weather-container ${bgClass}`}>
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

      {location && weatherMain && <WeatherIcon lat={location.lat} lon={location.lon} />}
    </div>
  );
};

export default Weather;