import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets, 
  Sunrise, 
  Sunset, 
  Gauge,
  Calendar,
  MapPin,
  AlertCircle,
  TrendingUp,
  Sprout,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

// Add weather icon component function
const getWeatherIconComponent = (iconCode) => {
  const iconMap = {
    '01d': <Sun className="w-6 h-6" />, // clear sky day
    '01n': <Sun className="w-6 h-6" />, // clear sky night
    '02d': <Cloud className="w-6 h-6" />, // few clouds day
    '02n': <Cloud className="w-6 h-6" />, // few clouds night
    '03d': <Cloud className="w-6 h-6" />, // scattered clouds
    '03n': <Cloud className="w-6 h-6" />, // scattered clouds
    '04d': <Cloud className="w-6 h-6" />, // broken clouds
    '04n': <Cloud className="w-6 h-6" />, // broken clouds
    '09d': <CloudRain className="w-6 h-6" />, // shower rain
    '09n': <CloudRain className="w-6 h-6" />, // shower rain
    '10d': <CloudRain className="w-6 h-6" />, // rain day
    '10n': <CloudRain className="w-6 h-6" />, // rain night
    '11d': <CloudRain className="w-6 h-6" />, // thunderstorm
    '11n': <CloudRain className="w-6 h-6" />, // thunderstorm
    '13d': <Cloud className="w-6 h-6" />, // snow
    '13n': <Cloud className="w-6 h-6" />, // snow
    '50d': <Cloud className="w-6 h-6" />, // mist
    '50n': <Cloud className="w-6 h-6" />, // mist
  };
  return iconMap[iconCode] || <Sun className="w-6 h-6" />;
};

const Weather = () => {
    const { t } = useLocale();
    const [city,setCity] = useState("Addis Ababa");
    const [currentWeather,setCurrentWeather] = useState(null);
    const [forecast,setForecast] = useState([]);
    const [tips,setTips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("current");
    
    // Additional state for enhanced features
    const [cropCalendar, setCropCalendar] = useState([]);
    const [weatherAlerts, setWeatherAlerts] = useState([]);
    const [farmingActivities, setFarmingActivities] = useState([]);
    
    const API_KEY = "447e96dcc13a7d0f74996bd4d63a1797";

    // Enhanced crop calendar data
    const generateCropCalendar = () => {
        const currentMonth = new Date().getMonth();
        const crops = [
            { name: t('weather.crops.teff'), plantingSeason: [5, 6, 7], harvestSeason: [10, 11], optimal: true },
            { name: t('weather.crops.maize'), plantingSeason: [2, 3, 4], harvestSeason: [8, 9], optimal: false },
            { name: t('weather.crops.barley'), plantingSeason: [5, 6], harvestSeason: [10, 11], optimal: true },
            { name: t('weather.crops.wheat'), plantingSeason: [5, 6, 7], harvestSeason: [11, 0], optimal: false },
            { name: t('weather.crops.sorghum'), plantingSeason: [3, 4, 5], harvestSeason: [9, 10], optimal: true },
            { name: t('weather.crops.coffee'), plantingSeason: [3, 4], harvestSeason: [10, 11, 0], optimal: true }
        ];
        
        return crops.map(crop => ({
            ...crop,
            isPlantingTime: crop.plantingSeason.includes(currentMonth),
            isHarvestTime: crop.harvestSeason.includes(currentMonth),
            status: crop.plantingSeason.includes(currentMonth) ? "planting" : 
                   crop.harvestSeason.includes(currentMonth) ? "harvest" : "maintain"
        }));
    };

    // Enhanced weather alerts
    const generateWeatherAlerts = (weatherData) => {
        const alerts = [];
        const temp = weatherData?.main?.temp || 22;
        const humidity = weatherData?.main?.humidity || 65;
        const windSpeed = weatherData?.wind?.speed || 3.5;
        
        if (temp > 35) {
            alerts.push({
                type: "warning",
                icon: <AlertCircle className="w-6 h-6" />,
                title: t('weather.alerts.heatWave.title'),
                message: t('weather.alerts.heatWave.message'),
                severity: "high"
            });
        }
        
        if (temp < 10) {
            alerts.push({
                type: "warning",
                icon: <AlertCircle className="w-6 h-6" />,
                title: t('weather.alerts.coldWave.title'),
                message: t('weather.alerts.coldWave.message'),
                severity: "medium"
            });
        }
        
        if (humidity > 80) {
            alerts.push({
                type: "info",
                icon: <Info className="w-6 h-6" />,
                title: t('weather.alerts.highHumidity.title'),
                message: t('weather.alerts.highHumidity.message'),
                severity: "low"
            });
        }
        
        if (windSpeed > 10) {
            alerts.push({
                type: "warning",
                icon: <Wind className="w-6 h-6" />,
                title: t('weather.alerts.strongWinds.title'),
                message: t('weather.alerts.strongWinds.message'),
                severity: "medium"
            });
        }
        
        return alerts;
    };

    // Enhanced farming activities based on weather
    const generateFarmingActivities = (weatherData) => {
        const activities = [];
        const temp = weatherData?.main?.temp || 22;
        const humidity = weatherData?.main?.humidity || 65;
        const weatherMain = weatherData?.weather?.[0]?.main?.toLowerCase() || 'clear';
        
        // Temperature-based activities
        if (temp > 25) {
            activities.push({
                activity: t('weather.activities.irrigation.title'),
                description: t('weather.activities.irrigation.description'),
                priority: "high",
                icon: <Droplets className="w-5 h-5" />,
                estimatedTime: "2-3 hours"
            });
        }
        
        if (temp < 15) {
            activities.push({
                activity: t('weather.activities.frostProtection.title'),
                description: t('weather.activities.frostProtection.description'),
                priority: "high",
                icon: <Thermometer className="w-5 h-5" />,
                estimatedTime: "1-2 hours"
            });
        }
        
        // Weather condition-based activities
        if (weatherMain.includes('rain')) {
            activities.push({
                activity: t('weather.activities.drainage.title'),
                description: t('weather.activities.drainage.description'),
                priority: "medium",
                icon: <CloudRain className="w-5 h-5" />,
                estimatedTime: "1 hour"
            });
        }
        
        if (weatherMain.includes('clear') && temp > 20) {
            activities.push({
                activity: t('weather.activities.fertilization.title'),
                description: t('weather.activities.fertilization.description'),
                priority: "medium",
                icon: <Sprout className="w-5 h-5" />,
                estimatedTime: "3-4 hours"
            });
        }
        
        // Humidity-based activities
        if (humidity < 50) {
            activities.push({
                activity: t('weather.activities.mulching.title'),
                description: t('weather.activities.mulching.description'),
                priority: "medium",
                icon: <Sprout className="w-5 h-5" />,
                estimatedTime: "2 hours"
            });
        }
        
        return activities;
    };

    // Load default city on component mount
    useEffect(() => {
        getWeather();
        setCropCalendar(generateCropCalendar());
    }, []);

    useEffect(() => {
        if (currentWeather) {
            setWeatherAlerts(generateWeatherAlerts(currentWeather));
            setFarmingActivities(generateFarmingActivities(currentWeather));
        }
    }, [currentWeather]);

    const getWeather = async() =>{
        const searchCity = city.trim() || "Addis Ababa";
        
        setLoading(true);
        setError("");
        
        try {
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchCity},ET&appid=${API_KEY}&units=metric`
            );
            
            if (!currentResponse.ok) {
                throw new Error("City not found. Showing default data for Addis Ababa.");
            }
            
            const currentData = await currentResponse.json();
            
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity},ET&appid=${API_KEY}&units=metric`
            );
            const forecastData = await forecastResponse.json()
            setCurrentWeather(currentData);
            setForecast(
                forecastData.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5)
            );
            generateFarmingTips(currentData);
        }
        catch (error) {
            console.error("Error fetching weather data:",error);
            setError(error.message || "Error fetching weather data. Please try again.");
            
            // Set mock data for demonstration if API fails
            setCurrentWeather({
                name: "Addis Ababa",
                main: { temp: 22, humidity: 65, feels_like: 24, pressure: 1013 },
                weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
                wind: { speed: 3.5 }
            });
            
            setForecast([
                { dt: Date.now()/1000, main: { temp: 23, temp_max: 25, temp_min: 20 }, weather: [{ description: "sunny", icon: "01d" }] },
                { dt: Date.now()/1000 + 86400, main: { temp: 21, temp_max: 24, temp_min: 18 }, weather: [{ description: "partly cloudy", icon: "02d" }] },
                { dt: Date.now()/1000 + 172800, main: { temp: 19, temp_max: 22, temp_min: 16 }, weather: [{ description: "light rain", icon: "10d" }] },
                { dt: Date.now()/1000 + 259200, main: { temp: 24, temp_max: 26, temp_min: 21 }, weather: [{ description: "clear", icon: "01d" }] },
                { dt: Date.now()/1000 + 345600, main: { temp: 20, temp_max: 23, temp_min: 17 }, weather: [{ description: "cloudy", icon: "03d" }] }
            ]);
            
            generateFarmingTips({
                main: { temp: 22, humidity: 65, pressure: 1013 },
                weather: [{ main: "Clear" }],
                wind: { speed: 3.5 }
            });
        }
        finally {
            setLoading(false);
        }
    };
    const generateFarmingTips = (weatherData) => {
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind?.speed || 0;
        const weatherCondition = weatherData.weather[0].main.toLowerCase();
        const pressure = weatherData.main.pressure;
        
        let newTips = [];

        // Temperature-based tips
        if (temp > 35) {
            newTips.push({
                type: "warning",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-red-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.extremeHeat.title'),
                message: t('weather.tips.extremeHeat.message')
            });
        } else if (temp > 30) {
            newTips.push({
                type: "caution",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-orange-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path d="M10 2L13.09 8.26L20 9L15 14L16.18 21L10 17.77L3.82 21L5 14L0 9L6.91 8.26L10 2Z"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.highTemperature.title'),
                message: t('weather.tips.highTemperature.message')
            });
        } else if (temp < 5) {
            newTips.push({
                type: "warning",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-blue-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M4.606 12.97a.75.75 0 01-.134 1.051 2.494 2.494 0 00-.93 2.437 2.494 2.494 0 002.437-.93.75.75 0 111.186.918 3.994 3.994 0 01-4.79 1.006 3.994 3.994 0 01-1.006-4.79.75.75 0 011.051-.134zm9.788 0a.75.75 0 011.051.134 3.994 3.994 0 01-1.006 4.79 3.994 3.994 0 01-4.79-1.006.75.75 0 111.186-.918 2.494 2.494 0 002.437.93 2.494 2.494 0 00-.93-2.437.75.75 0 01.134-1.051z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.frostRisk.title'),
                message: t('weather.tips.frostRisk.message')
            });
        } else if (temp < 15) {
            newTips.push({
                type: "info",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-blue-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.coolWeather.title'),
                message: t('weather.tips.coolWeather.message')
            });
        } else {
            newTips.push({
                type: "success",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-green-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.perfectTemperature.title'),
                message: t('weather.tips.perfectTemperature.message')
            });
        }

        // Humidity-based tips
        if (humidity > 85) {
            newTips.push({
                type: "warning",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-red-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.highHumidityAlert.title'),
                message: t('weather.tips.highHumidityAlert.message')
            });
        } else if (humidity < 30) {
            newTips.push({
                type: "caution",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-orange-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.lowHumidity.title'),
                message: t('weather.tips.lowHumidity.message')
            });
        } else {
            newTips.push({
                type: "success",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-green-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zM6 4h8v12H6V4z"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.goodHumidity.title'),
                message: t('weather.tips.goodHumidity.message')
            });
        }

        // Weather condition-based tips
        if (weatherCondition.includes("rain")) {
            newTips.push({
                type: "success",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-blue-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.rainfallDetected.title'),
                message: t('weather.tips.rainfallDetected.message')
            });
        } else if (weatherCondition.includes("clear")) {
            newTips.push({
                type: "success",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-yellow-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.clearSkies.title'),
                message: t('weather.tips.clearSkies.message')
            });
        }

        // Wind-based tips
        if (windSpeed > 10) {
            newTips.push({
                type: "caution",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-gray-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ x: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path d="M.2 10a11 11 0 0119.6 0A11 11 0 01.2 10zm9.8 4a4 4 0 100-8 4 4 0 000 8z"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.highWindAlert.title'),
                message: t('weather.tips.highWindAlert.message')
            });
        }

        // Pressure-based tips
        if (pressure < 1010) {
            newTips.push({
                type: "info",
                icon: (
                    <motion.svg 
                        className="w-8 h-8 text-purple-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </motion.svg>
                ),
                title: t('weather.tips.lowPressureSystem.title'),
                message: t('weather.tips.lowPressureSystem.message')
            });
        }

        setTips(newTips);
    };

    const tabs = [
        { 
            id: "current", 
            label: t('weather.tabs.current'), 
            icon: <Thermometer className="w-5 h-5" />
        },
        { 
            id: "forecast", 
            label: t('weather.tabs.forecast'), 
            icon: <Calendar className="w-5 h-5" />
        },
        { 
            id: "alerts", 
            label: t('weather.tabs.alerts'), 
            icon: <AlertCircle className="w-5 h-5" />
        },
        { 
            id: "calendar", 
            label: t('weather.tabs.cropCalendar'), 
            icon: <Sprout className="w-5 h-5" />
        },
        { 
            id: "activities", 
            label: t('weather.tabs.activities'), 
            icon: <Target className="w-5 h-5" />
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Agricultural Weather Background */}
            <div className="absolute inset-0">
                {/* Primary Agricultural Field Background */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50"
                />
                
                {/* Farm Field Layers */}
                <div className="absolute bottom-0 w-full">
                    {/* Back Fields */}
                    <div 
                        className="absolute bottom-0 w-full h-40 opacity-20"
                        style={{
                            background: 'linear-gradient(to right, #2e7d32 0%, #388e3c 50%, #43a047 100%)',
                            clipPath: 'polygon(0 100%, 0 20%, 30% 10%, 60% 25%, 100% 15%, 100% 100%)'
                        }}
                    />
                    <div 
                        className="absolute bottom-0 w-full h-32 opacity-30"
                        style={{
                            background: 'linear-gradient(to right, #388e3c 0%, #43a047 50%, #4caf50 100%)',
                            clipPath: 'polygon(0 100%, 0 40%, 25% 30%, 50% 45%, 75% 25%, 100% 35%, 100% 100%)'
                        }}
                    />
                    <div 
                        className="absolute bottom-0 w-full h-24 opacity-40"
                        style={{
                            background: 'linear-gradient(to right, #43a047 0%, #4caf50 50%, #66bb6a 100%)',
                            clipPath: 'polygon(0 100%, 0 60%, 35% 50%, 70% 65%, 100% 55%, 100% 100%)'
                        }}
                    />
                </div>

                {/* Weather Pattern Background */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234caf50' fill-opacity='0.3'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />

                {/* Floating Weather Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating Clouds */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                            key={`cloud-${i}`}
                            className="absolute opacity-5"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 50}%`,
                            }}
                            animate={{
                                x: [0, 100, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: Math.random() * 20 + 15,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                        >
                            <Cloud className="w-16 h-16 text-blue-300" />
                        </motion.div>
                    ))}

                    {/* Floating Particles */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute w-2 h-2 bg-green-300/20 rounded-full"
                            animate={{
                                y: [-20, -100],
                                x: [0, Math.random() * 100 - 50],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 4,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Smart Weather <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Dashboard</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Advanced weather insights and agricultural recommendations for Ethiopian farmers
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto mb-8"
                >
                    <div className="relative">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder={t('weather.searchBar.placeholder')}
                            className="w-full px-4 py-3 pl-12 bg-white/80 backdrop-blur-xl border border-green-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-lg"
                            onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                        />
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <motion.button
                            onClick={getWeather}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 shadow-lg"
                        >
                            {loading ? "..." : t('weather.searchBar.button')}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-green-200 shadow-lg">
                        <div className="flex space-x-2">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                            : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="hidden md:block">{tab.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Content based on active tab */}
                <AnimatePresence mode="wait">
                    {activeTab === "current" && (
                        <motion.div
                            key="current"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Current Weather Card - existing content */}
                            {/* ... existing current weather display ... */}
                        </motion.div>
                    )}

                    {activeTab === "alerts" && (
                        <motion.div
                            key="alerts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6">
                                {weatherAlerts.map((alert, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 ${
                                            alert.severity === 'high' ? 'border-red-400/50' :
                                            alert.severity === 'medium' ? 'border-yellow-400/50' : 'border-blue-400/50'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-xl ${
                                                alert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                                                alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                                                {alert.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2">{alert.title}</h3>
                                                <p className="text-white/80 mb-4">{alert.message}</p>
                                                <div className="space-y-2">
                                                    <h4 className="text-white font-medium">{t('weather.alerts.recommendedActions')}:</h4>
                                                    <ul className="space-y-1">
                                                        {alert.actions.map((action, actionIndex) => (
                                                            <li key={actionIndex} className="flex items-center space-x-2 text-white/70">
                                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                                <span>{action}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {weatherAlerts.length === 0 && (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">{t('weather.alerts.noActiveAlerts.title')}</h3>
                                        <p className="text-white/70">{t('weather.alerts.noActiveAlerts.message')}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "calendar" && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cropCalendar.map((crop, index) => (
                                    <motion.div
                                        key={crop.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-white">{crop.name}</h3>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                crop.status === 'planting' ? 'bg-green-500/20 text-green-300' :
                                                crop.status === 'harvest' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                                                {crop.status === 'planting' ? t('weather.cropCalendar.plantingSeason') :
                                                 crop.status === 'harvest' ? t('weather.cropCalendar.harvestSeason') : t('weather.cropCalendar.maintenance')}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Sprout className="w-5 h-5 text-green-400" />
                                                <span className="text-white/80">
                                                    {t('weather.cropCalendar.planting')}: {crop.plantingSeason.map(m => new Date(2024, m).toLocaleString('default', { month: 'short' })).join(', ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Target className="w-5 h-5 text-orange-400" />
                                                <span className="text-white/80">
                                                    {t('weather.cropCalendar.harvest')}: {crop.harvestSeason.map(m => new Date(2024, m).toLocaleString('default', { month: 'short' })).join(', ')}
                                                </span>
                                            </div>
                                            {crop.optimal && (
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                    <span className="text-green-300 text-sm">{t('weather.cropCalendar.optimal')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "activities" && (
                        <motion.div
                            key="activities"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid gap-4">
                                {farmingActivities.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-xl ${
                                                activity.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                                activity.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-white">{activity.activity}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        activity.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                                        activity.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                        {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)} {t('weather.activities.priority')}
                                                    </span>
                                                </div>
                                                <p className="text-white/80 mb-2">{activity.description}</p>
                                                <div className="flex items-center space-x-2 text-white/60">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{activity.estimatedTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/20 border border-red-400/50 rounded-2xl p-4 mb-6"
                    >
                        <div className="flex items-center space-x-3">
                            <XCircle className="w-6 h-6 text-red-400" />
                            <p className="text-red-200">{error}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Weather;
