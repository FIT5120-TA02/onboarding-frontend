import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TiWeatherCloudy,
  TiWeatherSunny,
  TiWeatherNight,
  TiWeatherShower,
} from "react-icons/ti";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function getIcon(weatherMain, isDaytime) {
  console.log("Weather condition received in getIcon:", weatherMain);

  switch (weatherMain) {
    case "Clouds":
    case "Mist":
    case "Fog":
      return <TiWeatherCloudy />;
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      return <TiWeatherShower />;
    case "Clear":
    case "Sunny": 
      return isDaytime ? <TiWeatherSunny /> : <TiWeatherNight />;
    default:
      return <TiWeatherCloudy />;
  }
}

const WeatherIcon = ({ lat, lon }) => {
  const [weatherMain, setWeatherMain] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${WEATHER_API_KEY}`
        );

        console.log("WeatherIcon API response:", res.data);

        if (!res.data.current || !res.data.current.weather || res.data.current.weather.length === 0) {
          throw new Error("Weather data is missing.");
        }

        const weatherMainValue = res.data.current.weather[0].main;
        console.log("Extracted weather condition:", weatherMainValue);

        setWeatherMain(weatherMainValue);
        setSunrise(res.data.current.sunrise);
        setSunset(res.data.current.sunset);
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
  if (!weatherMain || sunrise === null || sunset === null) {
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
