import React, { useEffect } from "react";

const UVWarning = ({ uvIndex }) => {
  useEffect(() => {
    if (uvIndex >= 8 && Notification.permission === "granted") {
      new Notification("⚠️ High UV Index Warning", {
        body: `UV index has reached ${uvIndex}. Please take protective measures!`,
      });
    }
  }, [uvIndex]);

  if (uvIndex < 6) return null;

  let warningText = "";
  let bgColor = "";

  if (uvIndex >= 11) {
    warningText = "⚠️ Extreme UV danger! Avoid outdoor exposure and ensure full protection!";
    bgColor = "#ff0000";
  } else if (uvIndex >= 8) {
    warningText = "⚠️ Very high UV index! Limit outdoor activities, wear a hat and long sleeves.";
    bgColor = "#ff4500";
  } else if (uvIndex >= 6) {
    warningText = "⚠️ High UV index! Wear sunglasses and avoid prolonged exposure.";
    bgColor = "#ffae42";
  }

  return (
    <div className="uv-warning" style={{ backgroundColor: bgColor, color: "white", padding: "10px", fontWeight: "bold", textAlign: "center", borderRadius: "4px", marginBottom: "10px" }}>
      {warningText}
    </div>
  );
};

export default UVWarning;