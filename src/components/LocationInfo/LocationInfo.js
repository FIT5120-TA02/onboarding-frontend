import React from 'react';
import { FaCalendarDay, FaTemperatureHigh } from 'react-icons/fa';
import moment from 'moment';
import './LocationInfo.css';

/**
 * LocationInfo component displays current date and weather information
 * @param {Object} props - Component props
 * @param {Object} props.weatherData - Weather data object
 * @returns {JSX.Element} LocationInfo component
 */
const LocationInfo = ({ weatherData }) => {
  if (!weatherData) {
    return null;
  }
  
  const { temperature } = weatherData;
  const currentDate = moment().format('MMMM D, dddd');
  
  // Determine temperature category
  const getTempCategory = (temp) => {
    if (temp >= 30) return 'temp-high';
    if (temp >= 20) return 'temp-medium';
    if (temp >= 10) return 'temp-low';
    return 'temp-very-low';
  };
  
  return (
    <div className="location-info">
      <div className="location-date">
        <FaCalendarDay className="location-icon" />
        <span>{currentDate}</span>
      </div>
      
      <div className={`location-temp ${getTempCategory(temperature)}`}>
        <FaTemperatureHigh className="location-icon" />
        <span className="temp-value">{temperature !== null ? `${temperature}°C` : 'N/A'}</span>
      </div>
    </div>
  );
};

export default LocationInfo;