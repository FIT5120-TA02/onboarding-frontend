import { useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://13.211.47.126/api/"; // TODO: Remove fallback

/**
 * Weather component to fetch weather data
 * @param {Object} props - Component props
 * @param {Object} props.location - Location coordinates
 * @param {Function} props.setWeatherData - Function to set weather data
 * @returns {null} This component doesn't render anything
 */
const Weather = ({ location, setWeatherData }) => {
  const fetchData = useCallback(
    async (lat, lon) => {
      if (!lat || !lon) {
        console.error("Invalid location coordinates");
        return;
      }

      try {
        // Get weather data from backend API
        const weatherResponse = await axios.post(
          `${API_BASE_URL}/api/v1/weather/`,
          {
            lat: lat,
            lon: lon,
            name: "SunSafe User", // Required by the API
          }
        );

        const weatherData = weatherResponse.data;

        // Determine background class based on weather conditions
        const weatherMain = weatherData.current.weather[0].main;
        const isDaytime =
          weatherData.current.sunrise &&
          weatherData.current.sunset &&
          weatherData.current.sunrise < Date.now() / 1000 &&
          Date.now() / 1000 < weatherData.current.sunset;

        let bgClass = "day";
        if (!isDaytime) bgClass = "night";
        else if (["Clouds", "Mist", "Fog"].includes(weatherMain))
          bgClass = "cloudy";
        else if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain))
          bgClass = "rainy";

        // Set weather data for the app
        setWeatherData({
          uvIndex: weatherData.current.uvi,
          temperature: Math.round(weatherData.current.temp),
          weatherMain,
          isDaytime,
          place:
            weatherData.location.name ||
            weatherData.location.address ||
            "Unknown Location",
          bgClass,
        });
      } catch (err) {
        console.error("Error fetching weather data:", err);
      }
    },
    [setWeatherData]
  );

  useEffect(() => {
    if (location?.lat && location?.lon) {
      fetchData(location.lat, location.lon);
    }
  }, [location, fetchData]);

  return null;
};

export default Weather;
