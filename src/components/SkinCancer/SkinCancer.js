import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SkinCancer.css";

const SkinCancer = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/skin-cancer/")
      .then(response => {
        console.log("Skin Cancer Data:", response.data);
        setData(response.data);
      })
      .catch(error => console.error("Error fetching skin cancer data:", error));
  }, []);

  return (
    <div className="skin-cancer-container">
      <h2>Skin Cancer Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

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
                <td>{item.count}</td>
                <td>{item.age_specific_rate}</td>
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
  );
};

export default SkinCancer;
