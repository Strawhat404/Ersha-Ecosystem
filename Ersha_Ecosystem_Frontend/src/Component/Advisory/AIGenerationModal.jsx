import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Cloud, 
  Sprout, 
  TrendingUp, 
  Truck, 
  Newspaper, 
  Download, 
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AIGenerationModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedResource, setGeneratedResource] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    weather: {
      location: "",
      temperature: "",
      humidity: "",
      rainfall: "",
      wind_speed: "",
      forecast: ""
    },
    crop: {
      type: "",
      variety: "",
      planting_date: "",
      growth_stage: "",
      area_hectares: "",
      expected_yield: ""
    },
    market: {
      current_prices: {},
      demand_trends: "",
      supply_analysis: "",
      competitor_prices: {},
      market_forecast: ""
    },
    sales: {
      recent_sales: [],
      total_revenue: "",
      average_price: "",
      sales_trends: "",
      customer_feedback: []
    },
    logistics: {
      storage_facilities: "",
      transportation_options: [],
      delivery_costs: {},
      supply_chain_partners: [],
      challenges: ""
    },
    news: []
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value.split(',').map(item => item.trim()).filter(item => item)
      }
    }));
  };

  const handleObjectInputChange = (section, field, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [key]: value
        }
      }
    }));
  };

  const generateContent = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/resources/generate_ai_content/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedResource(data);
      setSuccess(true);
      setStep(4);
      
      if (onSuccess) {
        onSuccess(data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      weather: {
        location: "",
        temperature: "",
        humidity: "",
        rainfall: "",
        wind_speed: "",
        forecast: ""
      },
      crop: {
        type: "",
        variety: "",
        planting_date: "",
        growth_stage: "",
        area_hectares: "",
        expected_yield: ""
      },
      market: {
        current_prices: {},
        demand_trends: "",
        supply_analysis: "",
        competitor_prices: {},
        market_forecast: ""
      },
      sales: {
        recent_sales: [],
        total_revenue: "",
        average_price: "",
        sales_trends: "",
        customer_feedback: []
      },
      logistics: {
        storage_facilities: "",
        transportation_options: [],
        delivery_costs: {},
        supply_chain_partners: [],
        challenges: ""
      },
      news: []
    });
    setStep(1);
    setError("");
    setSuccess(false);
    setGeneratedResource(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Weather Information</h3>
        <p className="text-gray-600">Provide current weather conditions for your farm location</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location</label>
          <input
            type="text"
            value={formData.weather.location}
            onChange={(e) => handleInputChange('weather', 'location', e.target.value)}
            placeholder="e.g., Addis Ababa, Gondar"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
          <input
            type="number"
            value={formData.weather.temperature}
            onChange={(e) => handleInputChange('weather', 'temperature', e.target.value)}
            placeholder="25"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
          <input
            type="number"
            value={formData.weather.humidity}
            onChange={(e) => handleInputChange('weather', 'humidity', e.target.value)}
            placeholder="65"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
          <input
            type="number"
            value={formData.weather.rainfall}
            onChange={(e) => handleInputChange('weather', 'rainfall', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed (km/h)</label>
          <input
            type="number"
            value={formData.weather.wind_speed}
            onChange={(e) => handleInputChange('weather', 'wind_speed', e.target.value)}
            placeholder="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weather Forecast</label>
          <input
            type="text"
            value={formData.weather.forecast}
            onChange={(e) => handleInputChange('weather', 'forecast', e.target.value)}
            placeholder="e.g., Sunny, Rain expected tomorrow"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Information</h3>
        <p className="text-gray-600">Details about your current crop and farming activities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
          <input
            type="text"
            value={formData.crop.type}
            onChange={(e) => handleInputChange('crop', 'type', e.target.value)}
            placeholder="e.g., Maize, Wheat, Coffee"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Variety</label>
          <input
            type="text"
            value={formData.crop.variety}
            onChange={(e) => handleInputChange('crop', 'variety', e.target.value)}
            placeholder="e.g., Hybrid, Local variety"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Planting Date</label>
          <input
            type="date"
            value={formData.crop.planting_date}
            onChange={(e) => handleInputChange('crop', 'planting_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage</label>
          <select
            value={formData.crop.growth_stage}
            onChange={(e) => handleInputChange('crop', 'growth_stage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select growth stage</option>
            <option value="seedling">Seedling</option>
            <option value="vegetative">Vegetative</option>
            <option value="flowering">Flowering</option>
            <option value="fruiting">Fruiting</option>
            <option value="mature">Mature</option>
            <option value="harvest_ready">Harvest Ready</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area (Hectares)</label>
          <input
            type="number"
            step="0.1"
            value={formData.crop.area_hectares}
            onChange={(e) => handleInputChange('crop', 'area_hectares', e.target.value)}
            placeholder="2.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Yield (tons)</label>
          <input
            type="number"
            step="0.1"
            value={formData.crop.expected_yield}
            onChange={(e) => handleInputChange('crop', 'expected_yield', e.target.value)}
            placeholder="5.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Market & Sales Data</h3>
        <p className="text-gray-600">Market conditions and your recent sales performance</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Market Prices (ETB/kg)</label>
          <input
            type="text"
            value={Object.entries(formData.market.current_prices).map(([k,v]) => `${k}:${v}`).join(', ')}
            onChange={(e) => {
              const prices = {};
              e.target.value.split(',').forEach(item => {
                const [key, value] = item.split(':').map(s => s.trim());
                if (key && value) prices[key] = value;
              });
              setFormData(prev => ({
                ...prev,
                market: { ...prev.market, current_prices: prices }
              }));
            }}
            placeholder="e.g., Maize: 25, Wheat: 30, Coffee: 150"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Demand Trends</label>
          <textarea
            value={formData.market.demand_trends}
            onChange={(e) => handleInputChange('market', 'demand_trends', e.target.value)}
            placeholder="Describe current market demand trends..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supply Analysis</label>
          <textarea
            value={formData.market.supply_analysis}
            onChange={(e) => handleInputChange('market', 'supply_analysis', e.target.value)}
            placeholder="Describe current supply situation..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Revenue (ETB)</label>
            <input
              type="number"
              value={formData.sales.total_revenue}
              onChange={(e) => handleInputChange('sales', 'total_revenue', e.target.value)}
              placeholder="50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Average Price (ETB/kg)</label>
            <input
              type="number"
              value={formData.sales.average_price}
              onChange={(e) => handleInputChange('sales', 'average_price', e.target.value)}
              placeholder="28"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sales Trends</label>
          <textarea
            value={formData.sales.sales_trends}
            onChange={(e) => handleInputChange('sales', 'sales_trends', e.target.value)}
            placeholder="Describe your recent sales performance and trends..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Report Generated Successfully!</h3>
        <p className="text-gray-600 mb-4">Your personalized agricultural advisory report is ready for download.</p>
      </div>
      
      {generatedResource && (
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-gray-900 mb-2">{generatedResource.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{generatedResource.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>File size: {generatedResource.file_size}</span>
            <span>Downloads: {generatedResource.downloads}</span>
          </div>
        </div>
      )}
      
      <div className="flex space-x-3">
        <button
          onClick={() => window.open(generatedResource?.file_url, '_blank')}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Content Generator</h2>
                    <p className="text-sm text-gray-600">Create personalized agricultural reports</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Steps */}
              {step < 4 && (
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {/* Content */}
              <div className="mb-6">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderSuccess()}
              </div>

              {/* Navigation */}
              {step < 4 && (
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={generateContent}
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Report</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIGenerationModal; 