import { useEffect, useCallback } from "react";
import axios from "axios";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Weather = ({ location, setWeatherData }) => {
  const fetchData = useCallback(async (lat, lon) => {
    if (!lat || !lon) {
      console.error("Invalid location coordinates");
      return;
    }

    try {
      const [weatherResponse, locationResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${WEATHER_API_KEY}`
        ),
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}&result_type=locality`
        ),
      ]);

      const weatherMain = weatherResponse.data.current.weather[0].main;
      const isDaytime =
        weatherResponse.data.current.dt > weatherResponse.data.current.sunrise &&
        weatherResponse.data.current.dt < weatherResponse.data.current.sunset;

      let bgClass = "day";
      if (!isDaytime) bgClass = "night";
      else if (["Clouds", "Mist", "Fog"].includes(weatherMain)) bgClass = "cloudy";
      else if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain)) bgClass = "rainy";

      setWeatherData({
        uvIndex: weatherResponse.data.current.uvi,
        temperature: Math.round(weatherResponse.data.current.temp),
        weatherMain,
        isDaytime,
        place: locationResponse.data.results?.[0]?.formatted_address || "Unknown Location",
        bgClass,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [setWeatherData]);

  useEffect(() => {
    if (location?.lat && location?.lon) {
      fetchData(location.lat, location.lon);
    }
  }, [location, fetchData]);

  return null; 
};

export default Weather;