import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TiWeatherCloudy,
  TiWeatherSunny,
  TiWeatherNight,
  TiWeatherShower,
} from "react-icons/ti";

const API_BASE_URL = "http://localhost:3001";

function getIcon(weatherMain, isDaytime) {
  if (weatherMain === "Clouds") {
    return <TiWeatherCloudy />;
  } else if (weatherMain === "Rain") {
    return <TiWeatherShower />;
  } else if (weatherMain === "Clear") {
    return isDaytime ? <TiWeatherSunny /> : <TiWeatherNight />;
  }
  return <TiWeatherCloudy />;
}

const WeatherIcon = ({ lat, lon }) => {
  const [weatherMain, setWeatherMain] = useState("Clear");
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/weatherCondition?lat=${lat}&lon=${lon}`
        );
        setWeatherMain(res.data.weatherMain);
        setSunrise(res.data.sunrise);
        setSunset(res.data.sunset);
      } catch (err) {
        console.error("Error fetching weather condition:", err);
        setError("Failed to fetch weather condition.");
      }
    };
    fetchWeather();
  }, [lat, lon]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  if (sunrise === null || sunset === null) {
    return <p>Loading weather icon...</p>;
  }

  const now = Math.floor(Date.now() / 1000);
  const isDaytime = now > sunrise && now < sunset;
  const icon = getIcon(weatherMain, isDaytime);

  return (
    <div style={{ fontSize: "100px", textAlign: "center" }}>
      {icon}
    </div>
  );
};
export default WeatherIcon;