import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Star, 
  Shield, 
  DollarSign, 
  Package, 
  Calendar,
  Leaf,
  Truck,
  X,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";

const Filters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rating, setRating] = useState(0);
  const [verified, setVerified] = useState(false);
  const [freshness, setFreshness] = useState('all');
  const [deliveryTime, setDeliveryTime] = useState('all');
  const [organic, setOrganic] = useState(false);
  
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    price: true,
    quality: true,
    delivery: false
  });

  const handleFilterChange = () => {
    onFilterChange({ 
      categories, 
      locations, 
      priceRange, 
      rating, 
      verified, 
      freshness, 
      deliveryTime,
      organic 
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setCategories([]);
    setLocations([]);
    setPriceRange([0, 1000]);
    setRating(0);
    setVerified(false);
    setFreshness('all');
    setDeliveryTime('all');
    setOrganic(false);
    handleFilterChange();
  };

  const categoriesData = [
    { id: "vegetables", name: "Vegetables", icon: "🥬", count: 89 },
    { id: "fruits", name: "Fruits", icon: "🍎", count: 67 },
    { id: "grains", name: "Grains & Cereals", icon: "🌾", count: 45 },
    { id: "dairy", name: "Dairy Products", icon: "🥛", count: 23 },
    { id: "coffee", name: "Coffee & Spices", icon: "☕", count: 24 },
    { id: "legumes", name: "Legumes", icon: "🫘", count: 18 }
  ];

  const locationsData = [
    { id: "addis", name: "Addis Ababa", region: "Central", count: 156 },
    { id: "oromia", name: "Oromia Region", region: "Central", count: 89 },
    { id: "amhara", name: "Amhara Region", region: "North", count: 67 },
    { id: "tigray", name: "Tigray Region", region: "North", count: 34 },
    { id: "snnpr", name: "SNNPR", region: "South", count: 78 },
    { id: "hawassa", name: "Hawassa", region: "South", count: 45 }
  ];

  const freshnessOptions = [
    { value: "all", label: "All Products" },
    { value: "fresh", label: "Fresh (< 24hrs)" },
    { value: "premium", label: "Premium Quality" },
    { value: "organic", label: "Organic Certified" }
  ];

  const deliveryOptions = [
    { value: "all", label: "Any Time" },
    { value: "same_day", label: "Same Day" },
    { value: "next_day", label: "Next Day" },
    { value: "2_3_days", label: "2-3 Days" }
  ];

  const FilterSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-3"
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 w-80"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <FilterSection 
        title="Categories" 
        icon={Package} 
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-2">
          {categoriesData.map((cat) => (
            <motion.label 
              key={cat.id} 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={categories.includes(cat.id)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...categories, cat.id]
                      : categories.filter((c) => c !== cat.id);
                    setCategories(newCategories);
                    handleFilterChange();
                  }}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm text-gray-700">{cat.name}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {cat.count}
              </span>
            </motion.label>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection 
        title="Location" 
        icon={MapPin} 
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
      >
        <div className="space-y-2">
          {locationsData.map((loc) => (
            <motion.label 
              key={loc.id} 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={locations.includes(loc.id)}
                  onChange={(e) => {
                    const newLocations = e.target.checked
                      ? [...locations, loc.id]
                      : locations.filter((l) => l !== loc.id);
                    setLocations(newLocations);
                    handleFilterChange();
                  }}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="text-sm text-gray-700">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.region}</div>
                </div>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {loc.count}
              </span>
            </motion.label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection 
        title="Price Range" 
        icon={DollarSign} 
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="px-2">
            <input
              type="range"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => {
                const newRange = [priceRange[0], parseInt(e.target.value)];
                setPriceRange(newRange);
                handleFilterChange();
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>ETB 0</span>
              <span className="font-medium text-green-600">ETB {priceRange[1]}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Min Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                value={priceRange[0]}
                onChange={(e) => {
                  const newRange = [parseInt(e.target.value) || 0, priceRange[1]];
                  setPriceRange(newRange);
                  handleFilterChange();
                }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newRange = [priceRange[0], parseInt(e.target.value) || 1000];
                  setPriceRange(newRange);
                  handleFilterChange();
                }}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Quality & Trust */}
      <FilterSection 
        title="Quality & Trust" 
        icon={Shield} 
        isExpanded={expandedSections.quality}
        onToggle={() => toggleSection('quality')}
      >
        <div className="space-y-4">
          {/* Rating Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  onClick={() => {
                    setRating(star === rating ? 0 : star);
                    handleFilterChange();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} />
                </motion.button>
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {rating > 0 ? `${rating}+ stars` : 'Any rating'}
              </span>
            </div>
          </div>

          {/* Verified Sellers */}
          <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => {
                setVerified(e.target.checked);
                handleFilterChange();
              }}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Verified Sellers Only</span>
          </label>

          {/* Organic Products */}
          <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={organic}
              onChange={(e) => {
                setOrganic(e.target.checked);
                handleFilterChange();
              }}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Organic Certified</span>
          </label>

          {/* Freshness */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Freshness</label>
            <select
              value={freshness}
              onChange={(e) => {
                setFreshness(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {freshnessOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Delivery Options */}
      <FilterSection 
        title="Delivery" 
        icon={Truck} 
        isExpanded={expandedSections.delivery}
        onToggle={() => toggleSection('delivery')}
      >
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Delivery Time</label>
          <select
            value={deliveryTime}
            onChange={(e) => {
              setDeliveryTime(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {deliveryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Apply Filters Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleFilterChange}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Apply Filters
      </motion.button>
    </motion.div>
  );
};

export default Filters;