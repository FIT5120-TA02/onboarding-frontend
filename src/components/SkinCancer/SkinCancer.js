import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SkinCancer.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://13.211.47.126"; // TODO: Remove fallback

// Age group options
const ageGroups = [
  { value: "All ages combined", label: "All ages combined" },
  { value: "00-04", label: "0-4 years" },
  { value: "05-09", label: "5-9 years" },
  { value: "10-14", label: "10-14 years" },
  { value: "15-19", label: "15-19 years" },
  { value: "20-24", label: "20-24 years" },
  { value: "25-29", label: "25-29 years" },
  { value: "30-34", label: "30-34 years" },
  { value: "35-39", label: "35-39 years" },
  { value: "40-44", label: "40-44 years" },
  { value: "45-49", label: "45-49 years" },
  { value: "50-54", label: "50-54 years" },
  { value: "55-59", label: "55-59 years" },
  { value: "60-64", label: "60-64 years" },
  { value: "65-69", label: "65-69 years" },
  { value: "70-74", label: "70-74 years" },
  { value: "75-79", label: "75-79 years" },
  { value: "80-84", label: "80-84 years" },
  { value: "85-89", label: "85-89 years" },
  { value: "90+", label: "90+ years" },
];

// Gender options
const genderOptions = [
  { value: "", label: "All Genders" },
  { value: "Females", label: "Females" },
  { value: "Males", label: "Males" },
  { value: "Persons", label: "All Persons" },
];

const SkinCancer = () => {
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(
    "Trend of Skin Cancer Cases"
  );

  // Filters
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All ages combined");
  const [selectedGender, setSelectedGender] = useState("");

  // Fetch data with optional filters
  const fetchSkinCancerData = async (ageGroup, gender) => {
    setIsLoading(true);
    try {
      let url = `${API_BASE_URL}/api/v1/skin-cancer/`;
      const params = { limit: 3000 };

      if (ageGroup && ageGroup !== "All ages combined") {
        params.age_group = ageGroup;
      }

      if (gender && gender !== "") {
        params.sex = gender;
      }

      // Add query parameters if filters are selected
      if (Object.keys(params).length > 0) {
        url += "?" + new URLSearchParams(params);
      }

      const response = await axios.get(url);

      if (Array.isArray(response.data.data)) {
        setRawData(response.data.data);
        processDataForChart(
          response.data.data,
          selectedAgeGroup,
          selectedGender
        );
      } else {
        console.error("Invalid data format:", response.data);
        setError("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching skin cancer data:", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkinCancerData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Process data for chart based on filters
  const processDataForChart = (data, ageGroup, gender) => {
    if (!data || data.length === 0) return;

    // Group data by year
    const groupedByYear = {};

    data.forEach((item) => {
      // Skip entries that don't match our filters if filters are set
      if (
        (ageGroup &&
          ageGroup !== "All ages combined" &&
          item.age_group !== ageGroup) ||
        (gender && gender !== "" && item.sex !== gender)
      ) {
        return;
      }

      if (!groupedByYear[item.year]) {
        groupedByYear[item.year] = { year: item.year };
      }

      // Create a key based on gender or use default if not filtering by gender
      const key = item.sex;
      groupedByYear[item.year][key] =
        (groupedByYear[item.year][key] || 0) + item.count;
    });

    // Convert to array and sort by year
    const processedData = Object.values(groupedByYear).sort(
      (a, b) => a.year - b.year
    );
    setChartData(processedData);
  };

  // Update data when filters change
  useEffect(() => {
    if (rawData.length > 0) {
      processDataForChart(rawData, selectedAgeGroup, selectedGender);
    }
  }, [selectedAgeGroup, selectedGender, rawData]);

  // Handle filter changes
  const handleAgeGroupChange = (e) => {
    setSelectedAgeGroup(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  // Custom tooltip to format the values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${new Intl.NumberFormat().format(
                entry.value
              )} cases`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="skin-cancer-page default-bg">
      <div className="skin-cancer-content">
        <h1 className="page-title">Skin Cancer Data</h1>

        {/* Loading state */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="skin-cancer-container">
            {/* Chart Selection Dropdown */}
            <div className="chart-selector">
              <label>Select Chart: </label>
              <select
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option value="Trend of Skin Cancer Cases">
                  Trend of Skin Cancer Cases
                </option>
                <option value="Raw Data">Raw Data</option>
              </select>
            </div>

            {/* Filters for Trend Chart */}
            {selectedChart === "Trend of Skin Cancer Cases" && (
              <div className="chart-filters">
                <div className="filter-group">
                  <label>Age Group: </label>
                  <select
                    value={selectedAgeGroup}
                    onChange={handleAgeGroupChange}
                  >
                    {ageGroups.map((group) => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Gender: </label>
                  <select value={selectedGender} onChange={handleGenderChange}>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Conditionally Render Charts */}
            <div className="chart-container">
              {selectedChart === "Trend of Skin Cancer Cases" &&
                chartData.length > 0 && (
                  <div className="chart-item">
                    <h2>Trend of Skin Cancer Cases by Year</h2>
                    <p className="chart-description">
                      {selectedAgeGroup === "All ages combined"
                        ? "All age groups"
                        : `Age group: ${selectedAgeGroup}`}
                      {selectedGender ? ` | Gender: ${selectedGender}` : ""}
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="year"
                          label={{
                            value: "Year",
                            position: "insideBottom",
                            offset: -20,
                            fill: "#333",
                            fontSize: 14,
                          }}
                          tick={{ fill: "#333" }}
                        />
                        <YAxis
                          label={{
                            value: "Number of Cases",
                            angle: -90,
                            position: "insideLeft",
                            dy: 50,
                            fill: "#333",
                            fontSize: 14,
                          }}
                          tick={{ fill: "#333" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="top"
                          align="center"
                          height={36}
                          iconSize={12}
                          wrapperStyle={{
                            fontSize: 12,
                            color: "#333",
                          }}
                        />
                        {/* Conditional rendering of lines based on filters */}
                        {(selectedGender === "" ||
                          selectedGender === "Females") && (
                          <Line
                            type="monotone"
                            dataKey="Females"
                            stroke="#FF6B8B"
                            strokeWidth={2}
                            dot={{ fill: "#FF6B8B", r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Females"
                          />
                        )}
                        {(selectedGender === "" ||
                          selectedGender === "Males") && (
                          <Line
                            type="monotone"
                            dataKey="Males"
                            stroke="#5DA5DA"
                            strokeWidth={2}
                            dot={{ fill: "#5DA5DA", r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Males"
                          />
                        )}
                        {(selectedGender === "" ||
                          selectedGender === "Persons") && (
                          <Line
                            type="monotone"
                            dataKey="Persons"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ fill: "#8884d8", r: 4 }}
                            activeDot={{ r: 6 }}
                            name="All Persons"
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

              {selectedChart === "Raw Data" && (
                <div className="data-table-container">
                  <h2>Raw Data</h2>
                  <div className="table-wrapper">
                    <table className="data-table">
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
                        {rawData.length > 0 ? (
                          rawData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.year}</td>
                              <td>{item.sex}</td>
                              <td>{item.age_group}</td>
                              <td>
                                {new Intl.NumberFormat().format(item.count)}
                              </td>
                              <td>
                                {item.age_specific_rate
                                  ? item.age_specific_rate.toFixed(2)
                                  : "N/A"}
                              </td>
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinCancer;
