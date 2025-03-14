import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Fetch place suggestions from Google Places API
  const fetchPlaces = async (searchText) => {
    try {
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.location"
        },
        body: JSON.stringify({ textQuery: searchText })
      });

      const data = await response.json();
      console.log("Places API Response:", data);

      if (!data.places || data.places.length === 0) {
        console.error("No places found.");
        setSuggestions([]);
        return;
      }

      // Update suggestions list
      setSuggestions(data.places);
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  // Handle search when the user submits a selected location
  const handleSearch = () => {
    if (!selectedPlace || !selectedPlace.location) {
      console.error("Please select a valid place.");
      return;
    }

    const { latitude, longitude } = selectedPlace.location;
    console.log("Extracted Coordinates:", { latitude, longitude });

    onSearch({ lat: latitude, lon: longitude });
    setQuery("");
    setSuggestions([]);
  };

  // Handle selection of a place from the suggestions
  const handleSelectSuggestion = (place) => {
    setQuery(place.displayName.text);
    setSelectedPlace(place);
    setSuggestions([]); 
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter location..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchPlaces(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        autoFocus
      />
      <button onClick={handleSearch}>Search</button>

      {/* Autocomplete dropdown menu */}
      {suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((place, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(place)}>
              {place.displayName.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
