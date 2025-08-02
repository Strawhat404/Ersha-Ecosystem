import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sprout, 
  Home, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  Truck, 
  BookOpen, 
  Newspaper, 
  Cloud,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Shield,
  Truck as TruckIcon,
  Leaf,
  User,
  Calendar
} from 'lucide-react'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import News from './Component/News/News'
import Homepage from './Component/Mainpage/Homepage'
import Navbar from './Component/Mainpage/Navbar'
import Herosection from './Component/Mainpage/Herosection'
import Features from './Component/Mainpage/Features'
// import Filters from './Component/Marketplace/Filters'
// import Products from './Component/Marketplace/Products'
import Marketplace from './Component/Marketplace/Marketplace'
import Weather from './Component/Weather/EnhancedWeather'
import Advisory from './Component/Advisory/Advisory'

// New Dashboard Components
import PaymentSystem from './Component/Dashboard/PaymentSystem'
import LogisticsTracker from './Component/Dashboard/LogisticsTracker'
import AnalyticsDashboard from './Component/Dashboard/AnalyticsDashboard'
import EnhancedAdvisory from './Component/Advisory/EnhancedAdvisory'
import UserDashboard from './Component/Dashboard/UserDashboard'

// Authentication Components
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './Component/Auth/Login'
import Register from './Component/Auth/Register'
import ForgotPassword from './Component/Auth/ForgotPassword'
import UserProfile from './Component/Auth/UserProfile'
import FaydaIntegration from './Component/Auth/FaydaIntegration'
import Verification from './Component/Auth/Verification'
import Callback from './Component/Auth/Callback'

// Debug: Test Supabase Connection - REMOVED FOR PRODUCTION

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/forgot-password', '/dashboard', '/verification'].includes(location.pathname);
  const [activeView, setActiveView] = useState('home');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { user, loading } = useAuth();

  const renderDashboardView = () => {
    switch(activeView) {
      case 'home':
        return (
          <main>
            {/* Hero Section */}
            <Herosection />
            
            {/* Features Section */}
            <Features />
            
            {/* Marketplace Preview Section - Nature Inspired */}
            <section className="relative py-20 overflow-hidden">
              {/* Nature Background with Layered Mountains */}
              <div className="absolute inset-0">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
                />
                
                {/* Layered Mountain Background */}
                <div className="absolute bottom-0 w-full">
                  <div 
                    className="absolute bottom-0 w-full h-40 opacity-20"
                    style={{
                      background: 'linear-gradient(to right, #065f46 0%, #047857 50%, #059669 100%)',
                      clipPath: 'polygon(0 100%, 0 40%, 30% 30%, 60% 45%, 100% 35%, 100% 100%)'
                    }}
                  />
                  <div 
                    className="absolute bottom-0 w-full h-32 opacity-30"
                    style={{
                      background: 'linear-gradient(to right, #047857 0%, #059669 50%, #0d9488 100%)',
                      clipPath: 'polygon(0 100%, 0 60%, 25% 50%, 50% 65%, 75% 45%, 100% 55%, 100% 100%)'
                    }}
                  />
                </div>

                {/* Subtle floating particles only */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-3 h-3 bg-white/10 rounded-full"
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: Math.random() * 6 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 4
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                      Step Into Our{" "}
                      <span className="block bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                        Digital Marketplace
                      </span>
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                      Discover the beauty of sustainable agriculture through our curated marketplace. 
                      Connect directly with farmers and experience authentic, fresh produce.
                    </p>
                  </motion.div>
                  
                  <motion.button
                    onClick={() => setActiveView('marketplace')}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="group bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl hover:shadow-green-500/30 transition-all duration-300 inline-flex items-center"
                  >
                    <ShoppingBag className="w-6 h-6 mr-3" />
                    <span>Explore Our Journeys</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-3"
                    >
                      →
                    </motion.div>
                  </motion.button>
                </div>

                {/* Nature-Inspired Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-green-100"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/50 to-transparent rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🌾</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">12,300+ Products</h3>
                      <p className="text-gray-600 text-center leading-relaxed">Fresh produce from verified farmers across the beautiful landscapes of Ethiopia</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">98% Verified</h3>
                      <p className="text-gray-600 text-center leading-relaxed">Trusted sellers with quality guarantee, ensuring sustainable and authentic products</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-orange-100"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/50 to-transparent rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <TruckIcon className="w-10 h-10 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Fast Delivery</h3>
                      <p className="text-gray-600 text-center leading-relaxed">Direct farm-to-market logistics network, bringing nature's bounty to your doorstep</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Weather Preview Section */}
            <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-teal-800 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div 
                  className="w-full h-full bg-repeat" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3Ccircle cx='30' cy='30' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-bounce-custom"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-teal-400/10 rounded-full animate-pulse-custom"></div>
                <div className="absolute bottom-20 left-32 w-24 h-24 bg-purple-400/10 rounded-full animate-bounce-custom"></div>
                <div className="absolute bottom-32 right-10 w-12 h-12 bg-blue-400/10 rounded-full animate-pulse-custom"></div>
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="heading-lg text-white mb-4">
                    Smart <span className="text-gradient-teal">Weather Insights</span>
                  </h2>
                  <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                    Get real-time weather data and agricultural recommendations for your location.
                  </p>
                  <motion.button
                    onClick={() => setActiveView('weather')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-500 via-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-medium hover:from-cyan-600 hover:via-blue-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    View Full Weather Dashboard
                  </motion.button>
                </div>

                {/* Weather Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center mb-4">
                      <Cloud className="w-8 h-8 text-cyan-300 mr-3" />
                      <h3 className="text-xl font-bold text-white">Current Weather</h3>
                    </div>
                    <p className="text-white/80 mb-4">Real-time conditions for Addis Ababa</p>
                    <div className="text-3xl font-bold text-white mb-2">22°C</div>
                    <div className="text-white/70">Partly Cloudy</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center mb-4">
                      <Sprout className="w-8 h-8 text-green-300 mr-3" />
                      <h3 className="text-xl font-bold text-white">Farming Tips</h3>
                    </div>
                    <p className="text-white/80 mb-4">Weather-based recommendations</p>
                    <div className="text-white/70">Ideal conditions for planting. Consider irrigation for next week.</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center mb-4">
                      <Calendar className="w-8 h-8 text-orange-300 mr-3" />
                      <h3 className="text-xl font-bold text-white">5-Day Forecast</h3>
                    </div>
                    <p className="text-white/80 mb-4">Extended weather outlook</p>
                    <div className="text-white/70">Sunny → Cloudy → Rain → Clear → Sunny</div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Advisory Preview Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="heading-lg text-gray-900 mb-4">
                    Expert <span className="text-gradient">Agricultural Advisory</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Learn from agricultural experts, access training courses, and get personalized farming advice.
                  </p>
                  <motion.button
                    onClick={() => setActiveView('advisory')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>Explore Advisory Hub</span>
                  </motion.button>
                </div>

                {/* Advisory Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Consultations</h3>
                    <p className="text-gray-600 mb-4">Connect with agricultural specialists for personalized advice</p>
                    <div className="text-emerald-600 font-semibold">12+ Available Experts</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Training Courses</h3>
                    <p className="text-gray-600 mb-4">Comprehensive courses on modern farming techniques</p>
                    <div className="text-blue-600 font-semibold">25+ Courses Available</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
                  >
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sprout className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Resource Library</h3>
                    <p className="text-gray-600 mb-4">Extensive collection of guides and research papers</p>
                    <div className="text-purple-600 font-semibold">100+ Resources</div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* News Preview Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="heading-lg text-gray-900 mb-4">
                    Latest <span className="text-gradient">Agricultural News</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Stay informed with the latest market trends, farming techniques, and industry insights.
                  </p>
                  <motion.button
                    onClick={() => setActiveView('news')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3"
                  >
                    <Newspaper className="w-6 h-6" />
                    <span>Read All News</span>
                  </motion.button>
                </div>

                {/* Featured News Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500"></div>
                    <div className="p-6">
                      <div className="text-sm text-emerald-600 font-medium mb-2">Market Trends</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Coffee Exports Hit Record Highs</h3>
                      <p className="text-gray-600 text-sm mb-4">Ethiopian coffee exports reached unprecedented levels this quarter...</p>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    <div className="p-6">
                      <div className="text-sm text-blue-600 font-medium mb-2">Technology</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Drone Technology Transforms Farms</h3>
                      <p className="text-gray-600 text-sm mb-4">New agricultural drones are helping farmers monitor crop health...</p>
                      <div className="text-xs text-gray-500">5 hours ago</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500"></div>
                    <div className="p-6">
                      <div className="text-sm text-orange-600 font-medium mb-2">Policy</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">New Agricultural Policy Support</h3>
                      <p className="text-gray-600 text-sm mb-4">Government announces comprehensive support package...</p>
                      <div className="text-xs text-gray-500">1 day ago</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Enhanced Platform Features Preview */}
            <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
              {/* Enhanced Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated geometric shapes */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/30 rounded-full blur-xl animate-bounce-slow"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/25 to-pink-400/35 rounded-full blur-lg animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-32 w-40 h-40 bg-gradient-to-r from-green-400/15 to-emerald-400/25 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-32 right-10 w-28 h-28 bg-gradient-to-r from-orange-400/20 to-yellow-400/30 rounded-full blur-xl animate-bounce-custom"></div>
                
                {/* Floating particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full"
                    animate={{
                      y: [0, -100, 0],
                      x: [0, Math.random() * 100 - 50, 0],
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
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}
                  />
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <motion.h2 
                    className="heading-lg text-white mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Complete{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                      Agricultural Ecosystem
                    </span>
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-white/80 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Access advanced features to manage your entire agricultural business in one platform.
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Sales Analytics Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    whileHover={{ 
                      y: -15, 
                      rotateY: 5, 
                      rotateX: 5,
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    className="group cursor-pointer perspective-1000"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setActiveView('analytics')}
                  >
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 overflow-hidden">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                      
                      {/* Icon container with enhanced effects */}
                      <motion.div 
                        className="relative w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                        whileHover={{ rotateY: 180, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <BarChart3 className="w-10 h-10 text-white drop-shadow-lg" />
                        {/* Sparkle effects */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 text-center">Sales Analytics</h3>
                      <p className="text-white/70 mb-6 leading-relaxed text-center text-sm">
                        Track performance, build credit score, and access loan opportunities
                      </p>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:shadow-xl relative overflow-hidden"
                      >
                        <span className="relative z-10">View Dashboard</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Payment System Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ 
                      y: -15, 
                      rotateY: 5, 
                      rotateX: 5,
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    className="group cursor-pointer perspective-1000"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setActiveView('payments')}
                  >
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                      
                      <motion.div 
                        className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                        whileHover={{ rotateY: 180, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <CreditCard className="w-10 h-10 text-white drop-shadow-lg" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 text-center">Payment System</h3>
                      <p className="text-white/70 mb-6 leading-relaxed text-center text-sm">
                        Mobile money, bank transfers, digital wallets with escrow protection
                      </p>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:shadow-xl relative overflow-hidden group"
                      >
                        <span className="relative z-10">Manage Payments</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Logistics Hub Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ 
                      y: -15, 
                      rotateY: 5, 
                      rotateX: 5,
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    className="group cursor-pointer perspective-1000"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setActiveView('logistics')}
                  >
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                      
                      <motion.div 
                        className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-cyan-600 to-sky-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                        whileHover={{ rotateY: 180, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <Truck className="w-10 h-10 text-white drop-shadow-lg" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 text-center">Logistics Hub</h3>
                      <p className="text-white/70 mb-6 leading-relaxed text-center text-sm">
                        Live tracking, cost estimation, and delivery management
                      </p>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-blue-500 via-cyan-600 to-sky-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:shadow-xl relative overflow-hidden group"
                      >
                        <span className="relative z-10">Track Shipments</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Expert Advisory Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    whileHover={{ 
                      y: -15, 
                      rotateY: 5, 
                      rotateX: 5,
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    className="group cursor-pointer perspective-1000"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setActiveView('enhanced-advisory')}
                  >
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                      
                      <motion.div 
                        className="relative w-24 h-24 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                        whileHover={{ rotateY: 180, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <Leaf className="w-10 h-10 text-white drop-shadow-lg" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 text-center">Expert Advisory</h3>
                      <p className="text-white/70 mb-6 leading-relaxed text-center text-sm">
                        Crop-specific guides tailored by region and season
                      </p>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:shadow-xl relative overflow-hidden group"
                      >
                        <span className="relative z-10">Browse Guides</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Call-to-Action Section - Save Our Agriculture Theme */}
            <section className="relative py-20 overflow-hidden">
              {/* Split Background Design */}
              <div className="absolute inset-0">
                {/* Left Side - Forest/Agricultural Scene */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-green-800 to-green-700"
                  style={{
                    clipPath: 'polygon(0 0, 60% 0, 50% 100%, 0 100%)'
                  }}
                />
                
                {/* Right Side - Lighter Agricultural Theme */}
                <div 
                  className="absolute inset-0 bg-gradient-to-l from-green-600 via-emerald-600 to-teal-600"
                  style={{
                    clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 60% 100%)'
                  }}
                />

                {/* Nature Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zM10 50c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />

                {/* Subtle Environmental Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-2 h-2 bg-white/20 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.5, 0.5]
                      }}
                      transition={{
                        duration: Math.random() * 6 + 4,
                        repeat: Infinity,
                        delay: Math.random() * 4
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
                  
                  {/* Left Side - Impact Message */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-left"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-none">
                        <span className="block">SAVE</span>
                        <span className="block">OUR</span>
                        <span className="block bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                          AGRICULTURE
                        </span>
                      </h2>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-xl text-green-100 mb-8 leading-relaxed max-w-lg"
                    >
                      Support sustainable farming practices and empower local communities. 
                      Every purchase helps preserve our agricultural heritage for future generations.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex flex-col space-y-4"
                    >
                      <div className="flex items-center text-green-200">
                        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <span>Support 12,000+ local farmers</span>
                      </div>
                      <div className="flex items-center text-green-200">
                        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <span>Reduce carbon footprint by 60%</span>
                      </div>
                      <div className="flex items-center text-green-200">
                        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <span>Preserve traditional farming methods</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Right Side - Action & Impact */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-center lg:text-left"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8"
                    >
                      <h3 className="text-3xl font-bold text-white mb-6">Join the Movement</h3>
                      <p className="text-green-100 mb-8 text-lg leading-relaxed">
                        Ready to transform your agricultural business while protecting our environment? 
                        Join thousands of farmers and merchants making a positive impact.
                      </p>

                      {/* Impact Stats */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="text-center">
                          <div className="text-3xl font-black text-white mb-2">2.5M</div>
                          <div className="text-green-200 text-sm">Monthly Sustainable Trade</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black text-white mb-2">15K</div>
                          <div className="text-green-200 text-sm">Trees Planted</div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => setActiveView('marketplace')}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-white/25"
                      >
                        Get Started Today
                      </motion.button>
                    </motion.div>

                    {/* Environmental Badge */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 3, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="inline-flex items-center bg-green-400/20 backdrop-blur-sm border border-green-300/30 rounded-full px-6 py-3 text-green-100"
                    >
                      <span className="mr-2">🌍</span>
                      <span className="font-semibold">Eco-Friendly Certified</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </section>
          </main>
        );

      case 'marketplace':
        return <Marketplace />;
        
      case 'weather':
        return <Weather />;
        
      case 'advisory':
        return <Advisory />;
        
      case 'news':
        return <News />;
        
      case 'analytics':
        return <AnalyticsDashboard />;
        
      case 'payments':
        return <PaymentSystem />;
        
      case 'logistics':
        return <LogisticsTracker />;
        
      case 'enhanced-advisory':
        return <EnhancedAdvisory />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation */}
      {!hideNavbar && (
        <Navbar 
          setActiveView={setActiveView} 
          onUserProfileClick={() => setShowUserProfile(true)}
        />
      )}
      {/* Main Content Sections */}
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            {!hideNavbar && (<Navbar setActiveView={setActiveView} onUserProfileClick={() => setShowUserProfile(true)} />)}
            {renderDashboardView()}
            {/* Footer content moved here */}
            <footer className="bg-gray-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                        <Sprout className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Ersha-Ecosystem</h3>
                        <p className="text-gray-400">Connect. Trade. Grow.</p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Complete agricultural ecosystem with marketplace, payments, logistics, analytics, and expert advisory services for Ethiopian farmers and merchants.
                    </p>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-4">Contact Info</h4>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span>support@ershaecosystem.com</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span>+251-911-123-456</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>Addis Ababa, Ethiopia</span>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-6">
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Platform Features</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><button onClick={() => setActiveView('marketplace')} className="hover:text-white transition-colors">Marketplace</button></li>
                      <li><button onClick={() => setActiveView('weather')} className="hover:text-white transition-colors">Weather System</button></li>
                      <li><button onClick={() => setActiveView('advisory')} className="hover:text-white transition-colors">Expert Advisory</button></li>
                      <li><button onClick={() => setActiveView('payments')} className="hover:text-white transition-colors">Payment Gateway</button></li>
                      <li><button onClick={() => setActiveView('logistics')} className="hover:text-white transition-colors">Logistics Tracking</button></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Farmer Training</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p>&copy; 2025 Ersha-Ecosystem. All rights reserved. Comprehensive Agricultural Ecosystem for Ethiopia.</p>
                </div>
              </div>
            </footer>
          </div>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/news" element={
          <div className="min-h-screen bg-gray-50">
            {!hideNavbar && (<Navbar setActiveView={setActiveView} onUserProfileClick={() => setShowUserProfile(true)} />)}
            <News />
            {/* Footer content moved here */}
            <footer className="bg-gray-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                        <Sprout className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Ersha-Ecosystem</h3>
                        <p className="text-gray-400">Connect. Trade. Grow.</p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Complete agricultural ecosystem with marketplace, payments, logistics, analytics, and expert advisory services for Ethiopian farmers and merchants.
                    </p>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-4">Contact Info</h4>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span>support@ershaecosystem.com</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span>+251-911-123-456</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>Addis Ababa, Ethiopia</span>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-6">
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Platform Features</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><button onClick={() => setActiveView('marketplace')} className="hover:text-white transition-colors">Marketplace</button></li>
                      <li><button onClick={() => setActiveView('weather')} className="hover:text-white transition-colors">Weather System</button></li>
                      <li><button onClick={() => setActiveView('advisory')} className="hover:text-white transition-colors">Expert Advisory</button></li>
                      <li><button onClick={() => setActiveView('payments')} className="hover:text-white transition-colors">Payment Gateway</button></li>
                      <li><button onClick={() => setActiveView('logistics')} className="hover:text-white transition-colors">Logistics Tracking</button></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Farmer Training</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p>&copy; 2025 Ersha-Ecosystem. All rights reserved. Comprehensive Agricultural Ecosystem for Ethiopia.</p>
                </div>
              </div>
            </footer>
          </div>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/fayda-id" element={<FaydaIntegration />} />
        <Route path="/verification" element={
          <ProtectedRoute>
            <Verification />
          </ProtectedRoute>
        } />
        <Route path="/callback" element={
          <ProtectedRoute>
            <Callback />
          </ProtectedRoute>
        } />
      </Routes>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Ersha-Ecosystem</h3>
                  <p className="text-gray-400">Connect. Trade. Grow.</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Complete agricultural ecosystem with marketplace, payments, logistics, analytics, and expert advisory services for Ethiopian farmers and merchants.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 mb-4">Contact Info</h4>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>support@ershaecosystem.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>+251-911-123-456</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
              <div className="flex justify-center space-x-6">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveView('marketplace')} className="hover:text-white transition-colors">Marketplace</button></li>
                <li><button onClick={() => setActiveView('weather')} className="hover:text-white transition-colors">Weather System</button></li>
                <li><button onClick={() => setActiveView('advisory')} className="hover:text-white transition-colors">Expert Advisory</button></li>
                <li><button onClick={() => setActiveView('payments')} className="hover:text-white transition-colors">Payment Gateway</button></li>
                <li><button onClick={() => setActiveView('logistics')} className="hover:text-white transition-colors">Logistics Tracking</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Farmer Training</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ersha-Ecosystem. All rights reserved. Comprehensive Agricultural Ecosystem for Ethiopia.</p>
          </div>
        </div>
      </footer>
      {/* User Profile Modal */}
      <AnimatePresence>
        {showUserProfile && (
          <UserProfile 
            onClose={() => setShowUserProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
