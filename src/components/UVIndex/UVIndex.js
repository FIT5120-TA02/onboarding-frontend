import React from 'react';
import './UVIndex.css';

/**
 * UVIndex component displays the current UV index with appropriate styling
 * @param {Object} props - Component props
 * @param {number} props.uvIndex - The UV index value
 * @returns {JSX.Element} UVIndex component
 */
const UVIndex = ({ uvIndex }) => {
  // Handle null or undefined UV index
  if (uvIndex === null || uvIndex === undefined) {
    return (
      <div className="uv-index-container">
        <div className="uv-index-circle uv-unknown">
          <span>?</span>
        </div>
        <div className="uv-index-risk-label uv-unknown">Unknown UVI Risk</div>
      </div>
    );
  }
  
  // Determine UV index category and styling
  let category, className;
  
  if (uvIndex >= 11) {
    category = "Extreme";
    className = "uv-extreme";
  } else if (uvIndex >= 8) {
    category = "Very High";
    className = "uv-very-high";
  } else if (uvIndex >= 6) {
    category = "High";
    className = "uv-high";
  } else if (uvIndex >= 3) {
    category = "Moderate";
    className = "uv-moderate";
  } else {
    category = "Low";
    className = "uv-low";
  }
  
  return (
    <div className="uv-index-container">
      <div className={`uv-index-circle ${className}`}>
        <span>{Math.round(uvIndex)}</span>
      </div>
      <div className={`uv-index-risk-label ${className}`}>{category} UVI Risk</div>
    </div>
  );
};

export default UVIndex;