import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import "./LearnMore.css";

const API_BASE_URL = "http://13.211.47.126/api/"; // TODO: Remove fallback

const LearnMore = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [uvData, setUvData] = useState([]);
  const [uvMapUrl, setUvMapUrl] = useState(null);
  const [temperatureMapUrl, setTemperatureMapUrl] = useState(null);
  const [selectedChart, setSelectedChart] = useState("UV Index Heatmap");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UV Map options
  const [uvPeriod, setUvPeriod] = useState("annual");

  // Temperature Map options
  const [tempType, setTempType] = useState("max");
  const [tempRegion, setTempRegion] = useState("aus");
  const [tempPeriod, setTempPeriod] = useState("annual");

  // Month options for dropdowns
  const months = [
    { name: "January", value: "jan" },
    { name: "February", value: "feb" },
    { name: "March", value: "mar" },
    { name: "April", value: "apr" },
    { name: "May", value: "may" },
    { name: "June", value: "jun" },
    { name: "July", value: "jul" },
    { name: "August", value: "aug" },
    { name: "September", value: "sep" },
    { name: "October", value: "oct" },
    { name: "November", value: "nov" },
    { name: "December", value: "dec" },
  ];

  // Region options for temperature map
  const regions = [
    { name: "Australia", value: "aus" },
    { name: "New South Wales", value: "ns" },
    { name: "Northern Territory", value: "nt" },
    { name: "Queensland", value: "qd" },
    { name: "South Australia", value: "sa" },
    { name: "Tasmania", value: "ta" },
    { name: "Victoria", value: "vc" },
    { name: "Western Australia", value: "wa" },
  ];

  // Temperature type options
  const tempTypes = [
    { name: "Mean", value: "mean" },
    { name: "Maximum", value: "max" },
    { name: "Minimum", value: "min" },
  ];

  // Fetch historical temperature and UV index data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const tempResponse = await axios.get(
          `${API_BASE_URL}/api/v1/weather/temperature-records`
        );
        const uvResponse = await axios.get(
          `${API_BASE_URL}/api/v1/weather/uv-records`
        );

        // Format temperature data
        const formattedTempData = tempResponse.data.map((record) => ({
          time: moment(record.created_at).format("YYYY-MM-DD HH:mm"),
          temperature: record.temperature,
        }));

        // Format UV index data
        const formattedUvData = uvResponse.data.map((record) => ({
          time: moment(record.created_at).format("YYYY-MM-DD HH:mm"),
          uv_index: record.uv_index,
        }));

        setTemperatureData(formattedTempData);
        setUvData(formattedUvData);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch historical data", err);
        setError("Failed to load historical data.");
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  // Fetch UV map based on selected period
  const fetchUvMap = async (period) => {
    try {
      setIsLoading(true);
      const uvMapResponse = await axios.get(
        `${API_BASE_URL}/api/v1/weather/uv-index-heatmap?period=${period}`
      );
      setUvMapUrl(`${API_BASE_URL}${uvMapResponse.data.url}`);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch UV map data", err);
      setError("Failed to load UV map data.");
      setIsLoading(false);
    }
  };

  // Fetch temperature map based on selected options
  const fetchTemperatureMap = async (type, region, period) => {
    try {
      setIsLoading(true);
      const tempMapResponse = await axios.get(
        `${API_BASE_URL}/api/v1/weather/temperature-map?temp_type=${type}&region=${region}&period=${period}`
      );
      setTemperatureMapUrl(`${API_BASE_URL}${tempMapResponse.data.url}`);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch temperature map data", err);
      setError("Failed to load temperature map data.");
      setIsLoading(false);
    }
  };

  // Fetch initial maps
  useEffect(() => {
    fetchUvMap(uvPeriod);
    fetchTemperatureMap(tempType, tempRegion, tempPeriod);
  }, [uvPeriod, tempType, tempRegion, tempPeriod]);

  // Handle UV period change
  const handleUvPeriodChange = (e) => {
    const newPeriod = e.target.value;
    setUvPeriod(newPeriod);
    fetchUvMap(newPeriod);
  };

  // Handle temperature map option changes
  const handleTempTypeChange = (e) => {
    const newType = e.target.value;
    setTempType(newType);
    fetchTemperatureMap(newType, tempRegion, tempPeriod);
  };

  const handleTempRegionChange = (e) => {
    const newRegion = e.target.value;
    setTempRegion(newRegion);
    fetchTemperatureMap(tempType, newRegion, tempPeriod);
  };

  const handleTempPeriodChange = (e) => {
    const newPeriod = e.target.value;
    setTempPeriod(newPeriod);
    fetchTemperatureMap(tempType, tempRegion, newPeriod);
  };

  return (
    <div className="learn-more-page default-bg">
      <div className="learn-more-content">
        <h1 className="page-title">Learn More About Sunburn</h1>

        {/* Loading state */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="learn-more-container">
            {/* Dropdown menu to select charts */}
            <div className="chart-selector">
              <label>Select Chart: </label>
              <select
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option value="UV Index Heatmap">UV Index Heatmap</option>
                <option value="Temperature Map">Temperature Map</option>
                <option value="Temperature Trend">Temperature Trend</option>
                <option value="UV Index Trend">UV Index Trend</option>
              </select>
            </div>

            {/* Conditionally render the selected chart */}
            <div className="chart-container">
              {selectedChart === "UV Index Heatmap" && (
                <div className="chart-item">
                  <h2>UV Index Heatmap</h2>

                  {/* UV Map period selector */}
                  <div className="chart-options">
                    <div className="option-group">
                      <label>Period: </label>
                      <select value={uvPeriod} onChange={handleUvPeriodChange}>
                        <option value="annual">Annual</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {uvMapUrl && <img src={uvMapUrl} alt="UV Index Heatmap" />}
                </div>
              )}

              {selectedChart === "Temperature Map" && (
                <div className="chart-item">
                  <h2>Temperature Map</h2>

                  {/* Temperature Map options */}
                  <div className="chart-options">
                    <div className="option-group">
                      <label>Temperature Type: </label>
                      <select value={tempType} onChange={handleTempTypeChange}>
                        {tempTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="option-group">
                      <label>Region: </label>
                      <select
                        value={tempRegion}
                        onChange={handleTempRegionChange}
                      >
                        {regions.map((region) => (
                          <option key={region.value} value={region.value}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="option-group">
                      <label>Period: </label>
                      <select
                        value={tempPeriod}
                        onChange={handleTempPeriodChange}
                      >
                        <option value="annual">Annual</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {temperatureMapUrl && (
                    <img src={temperatureMapUrl} alt="Temperature Map" />
                  )}
                </div>
              )}

              {selectedChart === "Temperature Trend" &&
                temperatureData.length > 0 && (
                  <div className="chart-item">
                    <h2>Temperature Trend</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={temperatureData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                      >
                        <XAxis
                          dataKey="time"
                          label={{
                            value: "Date/Time",
                            position: "insideBottom",
                            offset: -20,
                            fill: "#e0e0e0",
                            fontSize: 14,
                          }}
                          tick={{ fill: "#8884d8" }}
                        />
                        <YAxis
                          label={{
                            value: "Temperature (°C)",
                            angle: -90,
                            position: "insideLeft",
                            dy: 50,
                            fill: "#e0e0e0",
                            fontSize: 14,
                          }}
                          tick={{ fill: "#8884d8" }}
                        />
                        <Tooltip
                          labelFormatter={(label) => `Time: ${label}`}
                          formatter={(value) => [`${value}°C`, "Temperature"]}
                        />
                        <Legend
                          verticalAlign="top"
                          align="center"
                          height={36}
                          iconSize={12}
                          wrapperStyle={{
                            fontSize: 12,
                            color: "#8884d8",
                          }}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ fill: "#8884d8", r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Temperature"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

              {selectedChart === "UV Index Trend" && uvData.length > 0 && (
                <div className="chart-item">
                  <h2>UV Index Trend</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={uvData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                    >
                      <XAxis
                        dataKey="time"
                        label={{
                          value: "Date/Time",
                          position: "insideBottom",
                          offset: 0,
                          fill: "#e0e0e0",
                          fontSize: 14,
                        }}
                        tick={{ fill: "#82ca9d" }}
                      />
                      <YAxis
                        label={{
                          value: "UV Index",
                          angle: -90,
                          position: "insideLeft",
                          dy: 50,
                          fill: "#e0e0e0",
                          fontSize: 14,
                        }}
                        tick={{ fill: "#82ca9d" }}
                      />
                      <Tooltip
                        labelFormatter={(label) => `Time: ${label}`}
                        formatter={(value) => [`${value}`, "UV Index"]}
                      />
                      <Legend
                        verticalAlign="top"
                        align="center"
                        height={36}
                        iconSize={12}
                        wrapperStyle={{
                          fontSize: 12,
                          color: "#82ca9d",
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <Bar dataKey="uv_index" fill="#82ca9d" name="UV Index" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnMore;
