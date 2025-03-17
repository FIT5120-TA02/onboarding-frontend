import React from 'react';
import { FaSun, FaGlasses, FaUmbrella, FaTshirt, FaHatCowboy } from 'react-icons/fa';
import './ProtectionRecommendations.css';

/**
 * ProtectionRecommendations component displays sun protection recommendations based on UV index
 * @param {Object} props - Component props
 * @param {number} props.uvIndex - The UV index value
 * @returns {JSX.Element} ProtectionRecommendations component
 */
const ProtectionRecommendations = ({ uvIndex }) => {
  // Determine which protections to recommend based on UV index
  const needsSunglasses = uvIndex >= 3;
  const needsSunscreen = uvIndex >= 3;
  const needsShade = uvIndex >= 6;
  const needsClothing = uvIndex >= 6;
  const needsHat = uvIndex >= 3;
  
  // Determine recommendation strength based on UV index
  const getRecommendationStrength = (threshold) => {
    if (uvIndex === null || uvIndex === undefined) return 'unknown';
    if (uvIndex >= threshold + 5) return 'essential';
    if (uvIndex >= threshold) return 'recommended';
    return 'optional';
  };
  
  return (
    <div className="protection-recommendations">
      <h2 className="protection-title">Protection Recommendations</h2>
      
      <div className="protection-cards">
        <div className={`protection-card ${getRecommendationStrength(3)}`}>
          <FaGlasses className="protection-icon" />
          <span className="protection-label">Sunglasses</span>
          <span className="protection-status">
            {needsSunglasses ? 'Recommended' : 'Optional'}
          </span>
        </div>
        
        <div className={`protection-card ${getRecommendationStrength(3)}`}>
          <FaSun className="protection-icon" />
          <span className="protection-label">Sunscreen</span>
          <span className="protection-status">
            {needsSunscreen ? 'Recommended' : 'Optional'}
          </span>
        </div>
        
        <div className={`protection-card ${getRecommendationStrength(6)}`}>
          <FaUmbrella className="protection-icon" />
          <span className="protection-label">Seek Shade</span>
          <span className="protection-status">
            {needsShade ? 'Recommended' : 'Optional'}
          </span>
        </div>
        
        <div className={`protection-card ${getRecommendationStrength(6)}`}>
          <FaTshirt className="protection-icon" />
          <span className="protection-label">Protective Clothing</span>
          <span className="protection-status">
            {needsClothing ? 'Recommended' : 'Optional'}
          </span>
        </div>
        
        <div className={`protection-card ${getRecommendationStrength(3)}`}>
          <FaHatCowboy className="protection-icon" />
          <span className="protection-label">Hat</span>
          <span className="protection-status">
            {needsHat ? 'Recommended' : 'Optional'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProtectionRecommendations;