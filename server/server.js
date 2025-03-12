import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("🔍 WEATHER_API_KEY:", process.env.WEATHER_API_KEY || "❌ MISSING");
console.log("🔍 GOOGLE_MAPS_API_KEY:", process.env.GOOGLE_MAPS_API_KEY || "❌ MISSING");

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ UV Index API
app.get("/api/uv", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ ERROR: WEATHER_API_KEY is missing in .env file.");
    return res.status(500).json({ error: "Server API Key not configured" });
  }

  if (!lat || !lon) {
    console.warn("⚠️ WARNING: Latitude and Longitude are required but missing.");
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
    console.log(`🌍 Fetching UV Index from: ${url}`);

    const response = await axios.get(url);
    console.log("✅ OpenWeather API Response:", JSON.stringify(response.data, null, 2));

    if (!response.data.current || response.data.current.uvi === undefined) {
      console.error("❌ ERROR: UV Index data is missing from OpenWeather API response.");
      return res.status(500).json({ error: "Missing UV Index data in API response" });
    }

    res.json({ uvIndex: response.data.current.uvi });
  } catch (error) {
    console.error("❌ ERROR: Failed to fetch UV Index.");
    console.error("🔴 API Error Details:", error.response?.data || error.message);

    res.status(500).json({ error: "Failed to fetch UV Index", details: error.response?.data || error.message });
  }
});

// ✅ Location API using Google Maps Geocoding
app.get("/api/location", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("❌ ERROR: GOOGLE_MAPS_API_KEY is missing in .env file.");
    return res.status(500).json({ error: "Google Maps API Key not configured" });
  }

  if (!lat || !lon) {
    console.warn("⚠️ WARNING: Latitude and Longitude are required but missing.");
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    console.log(`🌍 Fetching location from: ${url}`);

    const response = await axios.get(url);
    console.log("✅ Google Maps API Response:", JSON.stringify(response.data, null, 2));

    const location = response.data.results[0]?.formatted_address || "Unknown Location";
    res.json({ location });
  } catch (error) {
    console.error("❌ ERROR: Failed to fetch location.");
    console.error("🔴 API Error Details:", error.response?.data || error.message);

    res.status(500).json({ error: "Failed to fetch location name", details: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});