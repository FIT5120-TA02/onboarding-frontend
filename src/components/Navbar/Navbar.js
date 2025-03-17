import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../Logo/Logo";
import "./Navbar.css";

/**
 * Navigation bar component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if a link is active
  const isActive = (path) => location.pathname === path;
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <Link to="/" className="navbar-logo">
          <Logo size="medium" />
        </Link>
        
        {/* Navigation links on the right */}
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/learn-more" 
            className={`navbar-link ${isActive('/learn-more') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Learn More
          </Link>
          <Link 
            to="/skin-cancer" 
            className={`navbar-link ${isActive('/skin-cancer') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Skin Cancer
          </Link>
        </div>
        
        {/* Hamburger menu for mobile */}
        <div className="navbar-hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;