import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { weatherAPI } from '../../lib/api';
import { Search } from 'lucide-react';

const ethiopianLocations = [
  "Addis Ababa", "Gondar", "Bahir Dar", "Mekelle", "Hawassa", "Adama", "Dire Dawa", "Jimma", "Harar", "Dessie", "Shashamane", "Arba Minch", "Debre Birhan", "Wolaita Sodo", "Hosaena", "Dilla", "Nekemte", "Asella", "Debre Markos", "Ambo", "Woldia", "Aksum", "Gambela", "Jijiga", "Assosa", "Semera", "Bishoftu", "Bale Robe", "Bonga", "Goba", "Mizan Teferi"
];

const EnhancedWeather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [farmingRecommendations, setFarmingRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getWeatherData("Addis Ababa");
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = ethiopianLocations.filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    setShowSuggestions(false);
    setSearchQuery(query);
    getWeatherData(query);
  };

  const getWeatherData = async (location) => {
    setLoading(true);
    setError("");
    try {
      console.log('Fetching weather data for:', location);
      
      // Get current conditions, alerts, and recommendations from API
      const [currentResponse, alertsResponse, recommendationsResponse] = await Promise.all([
        weatherAPI.getCurrentConditions(),
        weatherAPI.getAlerts(),
        weatherAPI.getRecommendations()
      ]);
      
      console.log('Current conditions response:', currentResponse);
      console.log('Alerts response:', alertsResponse);
      console.log('Recommendations response:', recommendationsResponse);
      
      if (currentResponse.current_conditions && currentResponse.current_conditions.length > 0) {
        // Find the weather data for the specific location
        const locationData = currentResponse.current_conditions.find(
          weather => weather.region.toLowerCase().includes(location.toLowerCase()) ||
                    (weather.woreda && weather.woreda.toLowerCase().includes(location.toLowerCase()))
        );
        
        if (locationData) {
          setCurrentWeather(locationData);
          setWeatherAlerts(alertsResponse.alerts || []);
          setFarmingRecommendations(recommendationsResponse.recommendations || []);
          setForecastData(generateForecastData(locationData));
        } else {
          // If location not found, use the first available data
          const firstWeather = currentResponse.current_conditions[0];
          setCurrentWeather(firstWeather);
          setWeatherAlerts(alertsResponse.alerts || []);
          setFarmingRecommendations(recommendationsResponse.recommendations || []);
          setForecastData(generateForecastData(firstWeather));
        }
      } else {
        setError('No weather data found for this location');
      }
    } catch (error) {
      console.error('Weather API error:', error);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for forecast, alerts, recommendations
  const generateForecastData = (weatherData) => {
    // Generate 4-day forecast based on current weather (mock)
    if (!weatherData) return [];
    const baseTemp = parseFloat(weatherData.temperature) || 22;
    return Array.from({ length: 4 }).map((_, i) => ({
      day: ["Tomorrow", "Day 2", "Day 3", "Day 4"][i],
      temperature: baseTemp + (Math.random() * 4 - 2),
      weather_condition: weatherData.weather_condition,
      icon: weatherData.icon || "01d"
    }));
  };

  const generateLocationAlerts = (weatherData) => {
    const alerts = [];
    if (!weatherData) return alerts;
    const temp = parseFloat(weatherData.temperature);
    const rainfall = parseFloat(weatherData.rainfall) || 0;
    const windSpeed = parseFloat(weatherData.wind_speed);
    
    if (temp > 35) alerts.push("Heat wave alert: Take precautions!");
    if (rainfall > 10) alerts.push("Heavy rainfall expected: Prepare drainage.");
    if (windSpeed > 10) alerts.push("Strong winds: Secure loose items.");
    return alerts.length ? alerts : ["No severe weather alerts."];
  };

  const generateLocationRecommendations = (weatherData) => {
    const recs = [];
    if (!weatherData) return recs;
    const temp = parseFloat(weatherData.temperature);
    const rainfall = parseFloat(weatherData.rainfall) || 0;
    const humidity = parseFloat(weatherData.humidity);
    
    if (rainfall > 5) recs.push("Consider planting teff or maize.");
    if (temp > 30) recs.push("Irrigate crops early morning or late evening.");
    if (humidity < 40) recs.push("Monitor for pest outbreaks.");
    return recs.length ? recs : ["No special recommendations today."];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-200 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search for Ethiopian cities, regions, or woredas (e.g., Addis Ababa, Gondar, Bahir Dar)"
                className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-white border border-green-200 rounded-xl shadow-lg z-20">
                  {searchSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 cursor-pointer hover:bg-green-50"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              💡 Try searching for Ethiopian cities like "Addis Ababa", "Gondar", "Bahir Dar", "Mekelle", "Hawassa", etc.
            </p>
          </div>
        </motion.div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          {["current", "forecast", "alerts", "recommendations"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-xl mx-2 font-semibold transition-all duration-200 ${activeTab === tab ? "bg-green-500 text-white" : "bg-white text-green-700 border border-green-200"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {!loading && (
          <AnimatePresence mode="wait">
            {activeTab === "current" && currentWeather && (
              <motion.div
                key="current"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/90 rounded-2xl shadow-lg p-8 border border-green-100 max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-2">{currentWeather.region}{currentWeather.woreda ? `, ${currentWeather.woreda}` : ""}</h2>
                <p className="text-gray-600 mb-4">{currentWeather.weather_condition}</p>
                <div className="flex items-center space-x-8">
                  <div>
                    <span className="text-5xl font-bold text-green-600">
                      {Math.round(parseFloat(currentWeather.temperature) || 0)}°C
                    </span>
                    <div className="text-gray-500">Temperature</div>
                  </div>
                  <div>
                    <span className="text-xl font-semibold">
                      {parseFloat(currentWeather.humidity) || 0}%
                    </span>
                    <div className="text-gray-500">Humidity</div>
                  </div>
                  <div>
                    <span className="text-xl font-semibold">
                      {parseFloat(currentWeather.wind_speed) || 0} m/s
                    </span>
                    <div className="text-gray-500">Wind</div>
                  </div>
                  <div>
                    <span className="text-xl font-semibold">
                      {parseFloat(currentWeather.rainfall) || 0} mm
                    </span>
                    <div className="text-gray-500">Rainfall</div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === "forecast" && forecastData.length > 0 && (
              <motion.div
                key="forecast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/90 rounded-2xl shadow-lg p-8 border border-green-100 max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-4">4-Day Forecast</h2>
                <div className="grid grid-cols-2 gap-4">
                  {forecastData.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-green-50 rounded-xl p-4">
                      <span className="text-lg font-semibold">{day.day}</span>
                      <span className="text-3xl font-bold text-green-600">{Math.round(day.temperature)}°C</span>
                      <span className="text-gray-500">{day.weather_condition}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/90 rounded-2xl shadow-lg p-8 border border-green-100 max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-4">Weather Alerts</h2>
                {console.log('Weather alerts data:', weatherAlerts)}
                {weatherAlerts.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {weatherAlerts.map((alert, idx) => (
                      <li key={idx} className="mb-2 text-red-600">
                        {typeof alert === 'string' ? alert : alert.message || 'Weather alert'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No weather alerts at this time.</p>
                )}
              </motion.div>
            )}
            
            {activeTab === "recommendations" && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/90 rounded-2xl shadow-lg p-8 border border-green-100 max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-4">Farming Recommendations</h2>
                {farmingRecommendations.length > 0 ? (
                  <div className="space-y-4">
                    {farmingRecommendations.map((rec, idx) => (
                      <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-green-800">{rec.activity}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{rec.description}</p>
                        <p className="text-sm text-gray-500">Timeframe: {rec.timeFrame}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No farming recommendations at this time.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {error && (
          <div className="text-red-600 text-center mt-4">{error}</div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWeather; 