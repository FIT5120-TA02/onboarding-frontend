import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.get("/api/uv", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("Error: WEATHER_API_KEY is missing in .env file.");
    return res.status(500).json({ error: "Server API Key not configured" });
  }

  if (!lat || !lon) {
    console.warn("Warning: Latitude and Longitude are required but missing.");
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data.current || response.data.current.uvi === undefined) {
      console.error("Error: UV Index data is missing from OpenWeather API response.");
      return res.status(500).json({ error: "Missing UV Index data in API response" });
    }

    res.json({ uvIndex: response.data.current.uvi });
  } catch (error) {
    console.error("Error fetching UV Index:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch UV Index" });
  }
});


app.get("/api/location", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Error: GOOGLE_MAPS_API_KEY is missing in .env file.");
    return res.status(500).json({ error: "Google Maps API Key not configured" });
  }

  if (!lat || !lon) {
    console.warn("Warning: Latitude and Longitude are required but missing.");
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&result_type=locality`;
    const response = await axios.get(url);

    if (!response.data.results || response.data.results.length === 0) {
      return res.json({ location: "Unknown Location" });
    }

    const location = response.data.results[0].formatted_address || "Unknown Location";
    res.json({ location });
  } catch (error) {
    console.error("Error fetching location:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch location name" });
  }
});

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("Error: WEATHER_API_KEY is missing in .env file.");
    return res.status(500).json({ error: "Server API Key not configured" });
  }

  if (!lat || !lon) {
    console.warn("Warning: Latitude and Longitude are required but missing.");
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data.main || response.data.main.temp === undefined) {
      console.error("Error: Temperature data is missing from OpenWeather API response.");
      return res.status(500).json({ error: "Missing temperature data in API response" });
    }

    const temperature = response.data.main.temp; 
    res.json({ temperature });
  } catch (error) {
    console.error("Error fetching temperature:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch temperature" });
  }
});

app.get("/api/weatherCondition", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("Error: WEATHER_API_KEY is missing in .env file.");
    return res.status(500).json({ error: "Server API Key not configured" });
  }

  if (!lat || !lon) {
    console.warn("Warning: Latitude and Longitude are required but missing.");
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data.current || !response.data.current.weather) {
      return res.status(500).json({ error: "No weather data found" });
    }


    const weatherMain = response.data.current.weather[0].main; 
    const sunrise = response.data.current.sunrise;             
    const sunset = response.data.current.sunset;               

    res.json({ weatherMain, sunrise, sunset });
  } catch (error) {
    console.error("Error fetching weather condition:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather condition" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});