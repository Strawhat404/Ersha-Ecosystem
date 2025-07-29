import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Navigation, 
  Phone,
  Star,
  TrendingUp
} from 'lucide-react';

const LogisticsTracker = ({ userType = "farmer" }) => {
  const [activeTab, setActiveTab] = useState("tracking");
  const [deliveries, setDeliveries] = useState([]);
  const [providers, setProviders] = useState([]);
  const [estimationData, setEstimationData] = useState({
    origin: "",
    destination: "",
    quantity: "",
    urgency: "standard"
  });
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching logistics data
    const fetchLogisticsData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDeliveries = [
        {
          id: "DEL001",
          orderId: "ORD2024001",
          product: "Premium Fresh Carrots",
          quantity: "500kg",
          origin: "Oromia Farm",
          destination: "Addis Market Hub",
          status: "in_transit",
          estimatedDelivery: "2024-03-16",
          trackingNumber: "TR123456789ET",
          provider: "FastFreight Ethiopia",
          cost: 450.00,
          distance: "85km",
          currentLocation: "Bishoftu Checkpoint",
          progress: 65
        },
        {
          id: "DEL002", 
          orderId: "ORD2024002",
          product: "Ethiopian Coffee Beans",
          quantity: "100kg",
          origin: "Highland Coffee Growers",
          destination: "Hawassa Distribution",
          status: "delivered",
          estimatedDelivery: "2024-03-14",
          trackingNumber: "TR987654321ET",
          provider: "EthioLogistics",
          cost: 280.00,
          distance: "45km",
          currentLocation: "Hawassa Warehouse",
          progress: 100
        },
        {
          id: "DEL003",
          orderId: "ORD2024003", 
          product: "Sweet Red Apples",
          quantity: "800kg",
          origin: "AwashAgro Industry",
          destination: "Fresh Foods Ltd",
          status: "pending",
          estimatedDelivery: "2024-03-17",
          trackingNumber: "TR555666777ET",
          provider: "RapidTransport",
          cost: 720.00,
          distance: "120km",
          currentLocation: "Awaiting Pickup",
          progress: 0
        }
      ];

      const mockProviders = [
        {
          id: 1,
          name: "FastFreight Ethiopia",
          logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop&crop=center",
          rating: 4.8,
          deliveries: 2450,
          avgDeliveryTime: "2-3 days",
          coverage: ["Addis Ababa", "Oromia", "Amhara", "SNNPR"],
          specialties: ["Perishables", "Bulk Goods"],
          pricePerKm: 8.50,
          verified: true,
          description: "Reliable cold chain logistics for fresh produce"
        },
        {
          id: 2,
          name: "EthioLogistics",
          logo: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=50&h=50&fit=crop&crop=center",
          rating: 4.6,
          deliveries: 3200,
          avgDeliveryTime: "1-2 days",
          coverage: ["Addis Ababa", "Dire Dawa", "Hawassa"],
          specialties: ["Express Delivery", "Documents"],
          pricePerKm: 12.00,
          verified: true,
          description: "Fast and secure delivery services nationwide"
        },
        {
          id: 3,
          name: "RapidTransport",
          logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=50&h=50&fit=crop&crop=center",
          rating: 4.4,
          deliveries: 1890,
          avgDeliveryTime: "3-5 days",
          coverage: ["Rural Areas", "Remote Locations"],
          specialties: ["Agricultural Products", "Heavy Cargo"],
          pricePerKm: 6.75,
          verified: false,
          description: "Specialized in rural and agricultural transport"
        }
      ];

      setDeliveries(mockDeliveries);
      setProviders(mockProviders);
      setLoading(false);
    };

    fetchLogisticsData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "in_transit": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "delayed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateEstimate = () => {
    if (!estimationData.origin || !estimationData.destination || !estimationData.quantity) {
      return;
    }

    // Simulate cost calculation
    const baseDistance = Math.floor(Math.random() * 200) + 20; // 20-220 km
    const weightKg = parseFloat(estimationData.quantity) || 100;
    const urgencyMultiplier = estimationData.urgency === "express" ? 1.5 : 1;
    
    const baseCost = baseDistance * 8.5 * urgencyMultiplier;
    const weightCost = weightKg > 100 ? (weightKg - 100) * 2 : 0;
    const totalCost = baseCost + weightCost;
    
    setEstimatedCost({
      distance: baseDistance,
      cost: totalCost,
      deliveryTime: estimationData.urgency === "express" ? "1-2 days" : "2-4 days",
      providers: providers.filter(p => p.verified).slice(0, 2)
    });
  };

  const tabs = [
    { 
      id: "tracking", 
      label: "Track Deliveries",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ x: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path>
        </motion.svg>
      )
    },
    { 
      id: "estimate", 
      label: "Cost Calculator",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "providers", 
      label: "Service Providers",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </motion.svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-32 skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Logistics & Delivery
        </h1>
        <p className="text-gray-600">
          Track shipments, estimate costs, and manage delivery services
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Active Deliveries</p>
              <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'in_transit').length}</p>
            </div>
            <motion.div
              animate={{ x: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Truck className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">Delivered</p>
              <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'delivered').length}</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 mb-1">Pending</p>
              <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'pending').length}</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <AlertCircle className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1">Avg Cost</p>
              <p className="text-2xl font-bold">ETB {Math.round(deliveries.reduce((acc, d) => acc + d.cost, 0) / deliveries.length)}</p>
            </div>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-blue-600"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "tracking" && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {deliveries.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{delivery.product}</h3>
                    <p className="text-sm text-gray-600">Order #{delivery.orderId} • {delivery.quantity}</p>
                    <p className="text-sm text-gray-600">Tracking: {delivery.trackingNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(delivery.status)}`}></div>
                    <span className="text-sm font-medium">{delivery.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Route Information</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>From: {delivery.origin}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>To: {delivery.destination}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Distance: {delivery.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Provider: {delivery.provider}</div>
                      <div>Cost: ETB {delivery.cost.toLocaleString()}</div>
                      <div>Expected: {delivery.estimatedDelivery}</div>
                      <div>Current: {delivery.currentLocation}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{delivery.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${delivery.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="btn-primary text-sm">Track Live</button>
                  <button className="btn-secondary text-sm">Contact Driver</button>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "estimate" && (
          <motion.div
            key="estimate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Freight Cost Calculator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin Location
                </label>
                <input
                  type="text"
                  value={estimationData.origin}
                  onChange={(e) => setEstimationData({...estimationData, origin: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Oromia Farm, Addis Ababa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={estimationData.destination}
                  onChange={(e) => setEstimationData({...estimationData, destination: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Market Hub, Hawassa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  value={estimationData.quantity}
                  onChange={(e) => setEstimationData({...estimationData, quantity: e.target.value})}
                  className="form-input"
                  placeholder="e.g., 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Speed
                </label>
                <select
                  value={estimationData.urgency}
                  onChange={(e) => setEstimationData({...estimationData, urgency: e.target.value})}
                  className="form-input"
                >
                  <option value="standard">Standard (2-4 days)</option>
                  <option value="express">Express (1-2 days)</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={calculateEstimate}
              className="btn-primary mb-6"
            >
              Calculate Estimate
            </motion.button>

            {estimatedCost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-4">Shipping Estimate</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {estimatedCost.distance}km
                    </div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ETB {Math.round(estimatedCost.cost)}
                    </div>
                    <div className="text-sm text-gray-600">Estimated Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {estimatedCost.deliveryTime}
                    </div>
                    <div className="text-sm text-gray-600">Delivery Time</div>
                  </div>
                </div>

                <h5 className="font-medium text-gray-900 mb-3">Recommended Providers:</h5>
                <div className="space-y-3">
                  {estimatedCost.providers.map((provider, index) => (
                    <div key={provider.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={provider.logo} 
                          alt={provider.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-600">
                            ⭐ {provider.rating} • {provider.avgDeliveryTime}
                          </div>
                        </div>
                      </div>
                      <button className="btn-primary text-sm">
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "providers" && (
          <motion.div
            key="providers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {providers.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={provider.logo}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                        {provider.verified && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{provider.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <span>⭐ {provider.rating}</span>
                        <span>📦 {provider.deliveries.toLocaleString()} deliveries</span>
                        <span>⏱️ {provider.avgDeliveryTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ETB {provider.pricePerKm}/km
                    </div>
                    <button className="btn-primary text-sm mt-2">
                      Contact Provider
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coverage Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.coverage.map((area, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties.map((specialty, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogisticsTracker; 