import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts";
import "./LearnMore.css";

const LearnMore = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [uvData, setUvData] = useState([]);
  const [uvMapUrl, setUvMapUrl] = useState(null);
  const [temperatureMapUrl, setTemperatureMapUrl] = useState(null);
  const [selectedChart, setSelectedChart] = useState("UV Index Heatmap");
  const [error, setError] = useState(null);

  // Fetch historical temperature and UV index data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const tempResponse = await axios.get("http://127.0.0.1:8000/api/v1/weather/temperature-records");
        const uvResponse = await axios.get("http://127.0.0.1:8000/api/v1/weather/uv-records");

        // Format temperature data
        const formattedTempData = tempResponse.data.map(record => ({
          time: moment(record.created_at).format("YYYY-MM-DD HH:mm"),
          temperature: record.temperature,
        }));

        // Format UV index data
        const formattedUvData = uvResponse.data.map(record => ({
          time: moment(record.created_at).format("YYYY-MM-DD HH:mm"),
          uv_index: record.uv_index,
        }));

        setTemperatureData(formattedTempData);
        setUvData(formattedUvData);
      } catch (err) {
        console.error("Failed to fetch historical data", err);
        setError("Failed to load historical data.");
      }
    };

    fetchHistoricalData();
  }, []);

  // Fetch maps
  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const uvMapResponse = await axios.get("http://127.0.0.1:8000/api/v1/weather/uv-index-heatmap?period=annual");
        const tempMapResponse = await axios.get("http://127.0.0.1:8000/api/v1/weather/temperature-map?temp_type=max&region=aus&period=dec");

        setUvMapUrl(uvMapResponse.data.url);
        setTemperatureMapUrl(tempMapResponse.data.url);
      } catch (err) {
        console.error("Failed to fetch map data", err);
        setError("Failed to load map data.");
      }
    };

    fetchMaps();
  }, []);

  return (
    <div className="learn-more-container">
      <h1>Learn More About Sunburn</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Dropdown menu to select charts */}
      <div className="chart-selector">
        <label>Select Chart: </label>
        <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
          <option value="UV Index Heatmap">UV Index Heatmap</option>
          <option value="Temperature Map">Temperature Map</option>
          <option value="Temperature Trend">Temperature Trend</option>
          <option value="UV Index Trend">UV Index Trend</option>
        </select>
      </div>

      {/* Conditionally render the selected chart */}
      <div className="chart-container">
        {selectedChart === "UV Index Heatmap" && uvMapUrl && (
          <div>
            <h2>UV Index Heatmap</h2>
            <img src={uvMapUrl} alt="UV Index Heatmap" width="80%" />
          </div>
        )}

        {selectedChart === "Temperature Map" && temperatureMapUrl && (
          <div>
            <h2>Temperature Map</h2>
            <img src={temperatureMapUrl} alt="Temperature Map" width="80%" />
          </div>
        )}

        {selectedChart === "Temperature Trend" && temperatureData.length > 0 && (
          <div>
            <h2>Temperature Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === "UV Index Trend" && uvData.length > 0 && (
          <div>
            <h2>UV Index Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={uvData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="uv_index" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnMore;