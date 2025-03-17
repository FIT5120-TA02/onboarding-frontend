import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import "./SearchBar.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://0.0.0.0:8000";

/**
 * SearchBar component for location search
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback function when search is performed
 * @param {Object} props.initialLocation - Initial location data to populate the search bar
 * @returns {JSX.Element} SearchBar component
 */
const SearchBar = ({ onSearch, initialLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Set initial location if provided
  useEffect(() => {
    if (initialLocation && initialLocation.place) {
      setQuery(initialLocation.place);
    }
  }, [initialLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch place suggestions from backend API
  const fetchPlaces = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/google-maps/address-predictions`,
        {
          input: searchText,
        }
      );

      if (
        !response.data.predictions ||
        response.data.predictions.length === 0
      ) {
        setSuggestions([]);
        return;
      }

      setSuggestions(response.data.predictions);
    } catch (error) {
      console.error("API request failed:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search when the user submits a selected location
  const handleSearch = () => {
    if (!selectedPlace || !selectedPlace.place_id) {
      return;
    }

    // Get place details from backend API
    getPlaceDetails(selectedPlace.place_id);

    // Keep the query text in the search bar
    setSuggestions([]);

    // Blur input after search
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Get place details from backend API
  const getPlaceDetails = async (placeId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/google-maps/place-details`,
        {
          place_id: placeId,
        }
      );

      const placeDetails = response.data;

      if (placeDetails && placeDetails.lat && placeDetails.lng) {
        onSearch({ lat: placeDetails.lat, lon: placeDetails.lng });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selection of a place from the suggestions
  const handleSelectSuggestion = (place) => {
    setQuery(place.description);
    setSelectedPlace(place);
    setSuggestions([]);

    // Trigger search immediately after selection
    setTimeout(() => {
      if (place && place.place_id) {
        getPlaceDetails(place.place_id);
      }
    }, 100);
  };

  // Handle user location button click
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className={`search-bar ${isFocused ? "focused" : ""}`}>
        <FaMapMarkerAlt className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for a location..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchPlaces(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {query && (
          <button
            className="search-clear-btn"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setSelectedPlace(null);
            }}
          >
            ×
          </button>
        )}
        <button className="search-location-btn" onClick={handleGetUserLocation}>
          <FaSearch />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="search-loading">
          <div className="search-loading-spinner"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="search-suggestion-item"
              onClick={() => handleSelectSuggestion(place)}
            >
              <FaMapMarkerAlt className="suggestion-icon" />
              <span>{place.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
