import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import "./LearnMore.css";

const LearnMore = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [formattedHourlyData, setFormattedHourlyData] = useState([]);
  const [uvMapUrl, setUvMapUrl] = useState(null);
  const [temperatureMapUrl, setTemperatureMapUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherResponse = await axios.post(
          "http://127.0.0.1:8000/api/v1/weather/",
          {
            lat: -37.8136,
            lon: 144.9631,
            name: "Melbourne"
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const uvResponse = await axios.get("http://127.0.0.1:8000/api/v1/weather/uv-index-heatmap?period=annual");
        const tempResponse = await axios.get("http://127.0.0.1:8000/api/v1/weather/temperature-map?temp_type=max&region=aus&period=dec");

        setWeatherData(weatherResponse.data);
        setUvMapUrl(uvResponse.data.url);
        setTemperatureMapUrl(tempResponse.data.url);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (weatherData?.hourly) {
      setFormattedHourlyData(
        weatherData.hourly.map((entry) => ({
          hour: moment.unix(entry.dt).format("h A"),
          temp: entry.temp,
          uvi: entry.uvi
        }))
      );
    }
  }, [weatherData]);

  return (
    <div className="learn-more-container">
      <h1>Learn More About Sunburn</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>UV Index Heatmap</h2>
      {uvMapUrl ? <img src={uvMapUrl} alt="UV Index Heatmap" width="80%" /> : <p>Loading UV heatmap...</p>}

      <h2>Temperature Map</h2>
      {temperatureMapUrl ? <img src={temperatureMapUrl} alt="Temperature Map" width="80%" /> : <p>Loading Temperature Map...</p>}

      <h2>Temperature Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedHourlyData}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2>UV Index Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedHourlyData}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="uvi" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LearnMore;