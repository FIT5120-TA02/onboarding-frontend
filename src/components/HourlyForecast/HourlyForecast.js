import React from 'react';
import moment from 'moment';
import './HourlyForecast.css';

/**
 * HourlyForecast component displays hourly UV index forecast
 * @param {Object} props - Component props
 * @param {Array} props.hourlyData - Array of hourly forecast data
 * @returns {JSX.Element} HourlyForecast component
 */
const HourlyForecast = ({ hourlyData }) => {
  // If no data is provided, show placeholder data
  const data = hourlyData || generatePlaceholderData();
  
  // Get UV index class based on value
  const getUVIndexClass = (uvIndex) => {
    if (uvIndex >= 11) return 'uv-extreme';
    if (uvIndex >= 8) return 'uv-very-high';
    if (uvIndex >= 6) return 'uv-high';
    if (uvIndex >= 3) return 'uv-moderate';
    return 'uv-low';
  };
  
  return (
    <div className="hourly-forecast-container">
      <h2 className="hourly-forecast-title">Today's UV Forecast</h2>
      
      <div className="hourly-forecast">
        {data.map((hour, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-time">{hour.time}</div>
            <div className={`forecast-uv ${getUVIndexClass(hour.uvIndex)}`}>
              {hour.uvIndex}
            </div>
            <div className="forecast-temp">{hour.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Generate placeholder hourly forecast data
 * @returns {Array} Array of placeholder hourly data
 */
const generatePlaceholderData = () => {
  const now = moment();
  const startHour = now.hour();
  const data = [];
  
  // Generate data for the next 12 hours
  for (let i = 0; i < 12; i++) {
    const hour = (startHour + i) % 24;
    const time = moment().hour(hour).minute(0).format('HH:00');
    
    // Generate realistic UV pattern (peak at midday)
    let uvIndex = 0;
    if (hour >= 6 && hour <= 18) {
      // Bell curve pattern peaking at noon
      const distance = Math.abs(hour - 12);
      uvIndex = Math.max(0, Math.round(11 - distance * 1.5));
    }
    
    // Generate realistic temperature pattern
    const baseTemp = 22; // Base temperature
    const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 5; // Variation throughout the day
    const temp = Math.round(baseTemp + tempVariation);
    
    data.push({
      time,
      uvIndex,
      temp
    });
  }
  
  return data;
};

export default HourlyForecast;