import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/Home/HomePage";
import LearnMore from "./components/LearnMore/LearnMore";
import SkinCancer from "./components/SkinCancer/SkinCancer";
import "./App.css";

/**
 * Main App component
 * @returns {JSX.Element} App component
 */
const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/skin-cancer" element={<SkinCancer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;