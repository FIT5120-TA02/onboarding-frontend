import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  return (
    <div className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/learn-more" className="nav-item">Learn More About Sunburn</Link>
        <Link to="/skin-cancer" className="nav-item">Skin Cancer</Link>
      </div>
      <SearchBar onSearch={onSearch} />
    </div>
  );
};

export default Navbar;