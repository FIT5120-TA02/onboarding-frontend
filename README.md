# UV Shield - UV Index & Weather Application

UV Shield is a React-based web application that provides real-time UV index information, weather forecasts, and sun protection recommendations based on your location. The application helps users make informed decisions about sun protection and outdoor activities.

## Features

- **Real-time UV Index**: Get the current UV index for your location
- **Weather Information**: View current weather conditions and forecasts
- **Protection Recommendations**: Receive personalized recommendations for sun protection based on UV levels
- **Location-based Services**: Automatically detect your location or search for any location
- **Hourly Forecasts**: View UV index and weather forecasts throughout the day
- **Educational Resources**: Learn about UV radiation, skin cancer prevention, and sun safety

## Tech Stack

- React 19
- React Router v7
- Axios for API requests
- Recharts for data visualization
- React Icons
- React TSParticles for background effects
- CSS for styling

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── HourlyForecast/   # Hourly weather and UV forecast component
│   ├── LearnMore/        # Educational content component
│   ├── LocationInfo/     # Location display component
│   ├── Logo/             # Application logo component
│   ├── Navbar/           # Navigation bar component
│   ├── ProtectionRecommendations/ # Sun protection advice component
│   ├── SearchBar/        # Location search component
│   ├── SkinCancer/       # Skin cancer information component
│   ├── UVIndex/          # UV index display component
│   └── Weather/          # Weather information component
├── pages/                # Application pages
│   └── Home/             # Main landing page
├── styles/               # Global styles
├── App.js                # Main application component
├── App.css               # Application-level styles
└── index.js              # Application entry point
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
REACT_APP_API_BASE_URL=your_backend_api_url
```

## Installation

1. Clone the repository:

   ```bash
   https://github.com/FIT5120-TA02/onboarding-frontend.git
   cd onboarding-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects the app from Create React App

## API Integration

This application integrates with:

- OpenWeatherMap API for weather and UV data
- Google Maps API for location services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for weather and UV data
- [Google Maps Platform](https://cloud.google.com/maps-platform/) for location services
- [Create React App](https://github.com/facebook/create-react-app) for the initial project setup
