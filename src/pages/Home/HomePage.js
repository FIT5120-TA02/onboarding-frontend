import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import UVIndex from "../../components/UVIndex/UVIndex";
import ProtectionRecommendations from "../../components/ProtectionRecommendations/ProtectionRecommendations";
import LocationInfo from "../../components/LocationInfo/LocationInfo";
import Weather from "../../components/Weather/Weather";
import "./HomePage.css";

/**
 * HomePage component - Main landing page of the application
 * @returns {JSX.Element} HomePage component
 */
const HomePage = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Try to get user's location on initial load
  useEffect(() => {
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError(
          "Please share your location or search for a location to get UV information."
        );
        setIsLoading(false);
      }
    );
  }, []);

  // Handle search from SearchBar
  const handleSearch = (newLocation) => {
    setLocation(newLocation);
    setError(null);
  };

  // Determine background class based on weather and UV index
  const getBgClass = () => {
    if (!weatherData) return "default-bg";

    // Use the background class from weather data if available
    if (weatherData.bgClass) return weatherData.bgClass;

    // Fallback to UV index based background
    const { uvIndex } = weatherData;
    if (uvIndex >= 11) return "bg-extreme";
    if (uvIndex >= 8) return "bg-very-high";
    if (uvIndex >= 6) return "bg-high";
    if (uvIndex >= 3) return "bg-moderate";
    return "bg-low";
  };

  return (
    <div className={`home-page ${getBgClass()}`}>
      {/* Weather component to fetch data */}
      {location && (
        <Weather location={location} setWeatherData={setWeatherData} />
      )}

      <div className="home-content">
        {/* Search bar at top - always visible */}
        <div className="search-bar-container-top">
          <SearchBar
            onSearch={handleSearch}
            initialLocation={weatherData ? { place: weatherData.place } : null}
          />
        </div>

        {/* Initial welcome message (shown when no location or data) */}
        {(!location || !weatherData) && !isLoading && !error && (
          <div className="initial-search">
            <h1 className="app-title">SunSafe Australia</h1>
            <p className="app-subtitle">
              Get real-time UV index and sun protection recommendations
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Getting your location...</p>
          </div>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Weather data display */}
        {location && weatherData && (
          <div className="weather-data">
            {/* Location info */}
            <LocationInfo weatherData={weatherData} />

            <div className="main-content-grid">
              <div className="uv-section">
                {/* UV Index */}
                <UVIndex uvIndex={weatherData.uvIndex} />

                {/* Protection recommendations */}
                <ProtectionRecommendations uvIndex={weatherData.uvIndex} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
