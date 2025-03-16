import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import "./SkinCancer.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SkinCancer = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState("Trend of Skin Cancer Cases");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/v1/skin-cancer/`)
      .then(response => {
        console.log("Skin Cancer Data:", response.data);
        if (Array.isArray(response.data.data)) {
          setData(response.data.data);  
        } else {
          console.error("Invalid data format:", response.data);
          setError("Invalid data format");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching skin cancer data:", error);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="skin-cancer-container">
      <h2>Skin Cancer Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* Chart Selection Dropdown */}
      <div className="chart-selector">
        <label>Select Chart: </label>
        <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
          <option value="Trend of Skin Cancer Cases">Trend of Skin Cancer Cases</option>
          <option value="Skin Cancer Cases by Age Group">Skin Cancer Cases by Age Group</option>
          <option value="Raw Data">Raw Data</option>
        </select>
      </div>

      {/* Conditionally Render Charts */}
      <div className="chart-container">
        {selectedChart === "Trend of Skin Cancer Cases" && data.length > 0 && (
          <div>
            <h3>Trend of Skin Cancer Cases</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === "Skin Cancer Cases by Age Group" && data.length > 0 && (
          <div>
            <h3>Skin Cancer Cases by Age Group</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === "Raw Data" && (
          <div>
            <h3>Raw Data</h3>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Sex</th>
                  <th>Age Group</th>
                  <th>Count</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.year}</td>
                      <td>{item.sex}</td>
                      <td>{item.age_group}</td>
                      <td>{new Intl.NumberFormat().format(item.count)}</td>
                      <td>{item.age_specific_rate ? item.age_specific_rate.toFixed(2) : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinCancer;