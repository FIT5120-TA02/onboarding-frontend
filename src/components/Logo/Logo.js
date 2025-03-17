import React from 'react';
import { FaSun } from 'react-icons/fa';
import './Logo.css';

/**
 * Logo component for the application
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the logo ('small', 'medium', 'large')
 * @returns {JSX.Element} Logo component
 */
const Logo = ({ size = 'medium' }) => {
  const sizeClass = `logo-${size}`;
  
  return (
    <div className={`logo-container ${sizeClass}`}>
      <FaSun className="logo-icon" />
      <span className="logo-text">SunSafe</span>
    </div>
  );
};

export default Logo;