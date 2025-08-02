import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  Star,
  TrendingUp,
  ShoppingCart,
  Heart,
  Eye,
  ArrowUpDown,
  Users,
  Leaf,
  Shield,
  Truck,
  X,
  ChevronDown,
  Upload,
  Camera,
  DollarSign,
  Package
} from "lucide-react";
import Filters from "./Filters";
import Products from "./Products";
import ProductCard from "./productCard";

const Marketplace = () => {
  // Use AuthContext for user authentication
  const { user, profile, loading: authLoading } = useAuth();
  
  const [filters, setFilters] = useState({ 
    categories: [], 
    locations: [], 
    priceRange: [0, 1000],
    rating: 0,
    verified: false,
    freshness: 'all'
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Add mock data for farmer listings
  const [farmerListings, setFarmerListings] = useState([]);
  
  // Add New Listing Popup State
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [newListingForm, setNewListingForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: null,
    imagePreview: null
  });

  // Get user role from AuthContext and map to marketplace roles
  const userType = profile?.user_type || user?.user_type || null;
  const role = userType === 'buyer' || userType === 'agricultural_business' ? 'merchant' : userType;

  // Form handling functions
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewListingForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleFormChange = (field, value) => {
    setNewListingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitListing = (e) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log('New listing:', newListingForm);
    setShowAddListingModal(false);
    // Reset form
    setNewListingForm({
      title: '',
      description: '',
      price: '',
      location: '',
      image: null,
      imagePreview: null
    });
  };

  const closeModal = () => {
    setShowAddListingModal(false);
    setNewListingForm({
      title: '',
      description: '',
      price: '',
      location: '',
      image: null,
      imagePreview: null
    });
  };

  // Mock featured products data
  useEffect(() => {
    setFeaturedProducts([
      {
        name: "Premium Fresh Carrots",
        farmer: "Oromia Organic Farm",
        price: "ETB 45/kg",
        icon: "🥕",
        role: "merchant",
        rating: 4.8,
        stock: 95,
        verified: true,
        featured: true,
        discount: 15,
        freshness: "Fresh",
        location: "Addis Ababa"
      },
      {
        name: "Ethiopian Coffee Beans",
        farmer: "Highland Coffee Growers",
        price: "ETB 180/kg",
        icon: "☕",
        role: "merchant",
        rating: 4.9,
        stock: 87,
        verified: true,
        featured: true,
        freshness: "Premium",
        location: "Jimma"
      },
      {
        name: "Sweet Red Apples",
        farmer: "Mountain View Orchards",
        price: "ETB 65/kg",
        icon: "🍎",
        role: "merchant",
        rating: 4.7,
        stock: 92,
        verified: true,
        featured: true,
        discount: 10,
        freshness: "Fresh",
        location: "Hawassa"
      }
    ]);

    // New: Mock listings for farmer view
    setFarmerListings([
      {
        name: "My Teff Harvest",
        price: "ETB 120/kg",
        icon: "🌾",
        rating: 4.5,
        stock: 500,
        verified: true,
        freshness: "Fresh",
        location: "Oromia",
        status: "active",
        views: 120,
        orders: 15
      },
      {
        name: "Organic Maize",
        price: "ETB 80/kg",
        icon: "🌽",
        rating: 4.2,
        stock: 300,
        verified: false,
        freshness: "Stored",
        location: "Amhara",
        status: "pending",
        views: 85,
        orders: 8
      },
      {
        name: "Fresh Vegetables Mix",
        price: "ETB 50/kg",
        icon: "🥬",
        rating: 4.8,
        stock: 200,
        verified: true,
        freshness: "Fresh",
        location: "SNNPR",
        status: "sold_out",
        views: 200,
        orders: 45
      }
    ]);
  }, []);

  const categories = [
    { id: "all", name: "All Products", icon: "🌾", count: 248 },
    { id: "vegetables", name: "Vegetables", icon: "🥬", count: 89 },
    { id: "fruits", name: "Fruits", icon: "🍎", count: 67 },
    { id: "grains", name: "Grains", icon: "🌾", count: 45 },
    { id: "dairy", name: "Dairy", icon: "🥛", count: 23 },
    { id: "coffee", name: "Coffee", icon: "☕", count: 24 }
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Most Popular" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Cinematic Background - Agricultural Landscape */}
        <div className="absolute inset-0">
          {/* Primary Background - Agricultural Field */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(
                135deg,
                rgba(34, 197, 94, 0.9) 0%,
                rgba(16, 185, 129, 0.8) 25%,
                rgba(5, 150, 105, 0.7) 50%,
                rgba(6, 78, 59, 0.9) 100%
              ), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23064e3b' points='957,450 539,900 1396,900'/%3E%3Cpolygon fill='%23065f46' points='957,450 872.9,900 1396,900'/%3E%3Cpolygon fill='%23047857' points='-60,900 398,662 816,900'/%3E%3Cpolygon fill='%23059669' points='337,900 398,662 816,900'/%3E%3Cpolygon fill='%231203,546 1552,900 876,900'/%3E%3Cpolygon fill='%2314b8a6' points='1203,546 1552,900 1162,900'/%3E%3Cpolygon fill='%232dd4bf' points='641,695 886,900 367,900'/%3E%3Cpolygon fill='%235eead4' points='587,900 641,695 886,900'/%3E%3C/svg%3E")`
            }}
          />
          
          {/* Layered Mountain Silhouettes */}
          <div className="absolute bottom-0 w-full">
            {/* Back Mountains */}
            <div 
              className="absolute bottom-0 w-full h-64 opacity-30"
              style={{
                background: 'linear-gradient(to right, #064e3b 0%, #065f46 50%, #047857 100%)',
                clipPath: 'polygon(0 100%, 0 60%, 25% 45%, 50% 55%, 75% 40%, 100% 50%, 100% 100%)'
              }}
            />
            
            {/* Middle Mountains */}
            <div 
              className="absolute bottom-0 w-full h-48 opacity-50"
              style={{
                background: 'linear-gradient(to right, #047857 0%, #059669 50%, #0d9488 100%)',
                clipPath: 'polygon(0 100%, 0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 55%, 100% 100%)'
              }}
            />
            
            {/* Front Hills */}
            <div 
              className="absolute bottom-0 w-full h-32 opacity-70"
              style={{
                background: 'linear-gradient(to right, #059669 0%, #0d9488 50%, #14b8a6 100%)',
                clipPath: 'polygon(0 100%, 0 80%, 30% 65%, 50% 75%, 70% 60%, 100% 70%, 100% 100%)'
              }}
            />
          </div>
        </div>

        {/* Floating Agricultural Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Leaves */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: -50,
                rotate: 0,
                opacity: 0.6
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                rotate: 360,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
              }}
              transition={{
                duration: Math.random() * 8 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              <Leaf 
                className="text-green-200/40" 
                size={Math.random() * 20 + 15}
              />
            </motion.div>
          ))}
          
          {/* Floating Seeds/Particles */}
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-green-200/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Agricultural <span className="text-green-200">Marketplace</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Connect directly with farmers and merchants. Trade quality produce at competitive prices with complete transparency.
            </motion.p>



            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { icon: Users, label: "Active Farmers", value: "2,450+" },
                { icon: ShoppingCart, label: "Products Listed", value: "12,300+" },
                { icon: MapPin, label: "Regions Covered", value: "9" },
                { icon: Shield, label: "Verified Sellers", value: "98%" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar - Merchants Only */}
      {role === "merchant" && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for products, farmers, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                </motion.button>

                {/* Sort Options */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-100 hover:bg-gray-200 px-6 py-4 rounded-xl pr-10 focus:ring-2 focus:ring-green-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>

                {/* View Mode Toggles */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Navigation - Merchants Only */}
      {role === "merchant" && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-green-100 text-green-700 shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar - Only show for merchants */}
            {role === "merchant" && (
              <div className="lg:w-1/4">
                <Filters 
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="w-full">
              {/* Role-specific header */}
              {role === "merchant" && (
                <div className="mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-center">
                      <div className="px-8 py-3 rounded-xl font-medium bg-blue-500 text-white shadow-lg">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="w-5 h-5" />
                          <span>Marketplace - Buy Products</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {role === "farmer" && (
                <div className="mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-center">
                      <div className="px-8 py-3 rounded-xl font-medium bg-green-500 text-white shadow-lg">
                        <div className="flex items-center space-x-2">
                          <Leaf className="w-5 h-5" />
                          <span>My Product Listings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show content based on user role */}
              {!role && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Access Restricted</h3>
                    <p className="text-gray-600">Please log in to access the marketplace.</p>
                  </div>
                </div>
              )}

              {/* Merchant View - Buy Products */}
              {role === "merchant" && (
                <>
                  {/* Featured Products - Merchant View */}
                  {activeCategory === "all" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                        <div className="flex items-center space-x-2 text-orange-600">
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-medium">Trending Now</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product, index) => (
                          <motion.div
                            key={product.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ProductCard {...product} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* All Products - Merchant View */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activeCategory === "all" ? "All Products" : categories.find(c => c.id === activeCategory)?.name}
                      </h2>
                      <div className="text-gray-600">
                        Showing 1-24 of 248 products
                      </div>
                    </div>
                  </div>

                  <Products 
                    filters={{...filters, category: activeCategory, search: searchQuery, sortBy}} 
                    role={role} 
                    viewMode={viewMode}
                  />
                </>
              )}

              {/* Farmer View - Sell Products */}
              {role === "farmer" && (
                /* Farmer View: My Listings */
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Product Listings</h2>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddListingModal(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium flex items-center space-x-2 hover:bg-green-700 transition-colors"
                    >
                      <Leaf className="w-5 h-5" />
                      <span>Add New Listing</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farmerListings.map((listing, index) => (
                      <motion.div
                        key={listing.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <span className="text-6xl">{listing.icon || "🌿"}</span>
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              listing.status === "active" ? "bg-green-100 text-green-700" :
                              listing.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.name}</h3>
                          <div className="flex items-center space-x-6 mb-4">
                            <div className="text-gray-600">
                              <p className="font-medium">Price: {listing.price}</p>
                              <p>Stock: {listing.stock}kg</p>
                            </div>
                            <div className="text-gray-600">
                              <p>Views: {listing.views}</p>
                              <p>Orders: {listing.orders}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="font-medium">{listing.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <span>{listing.location}</span>
                            </div>
                            {listing.verified && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Shield className="w-5 h-5" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-3">
                            <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors">
                              Edit Listing
                            </button>
                            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Add New Listing Modal */}
      <AnimatePresence>
        {showAddListingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Product Listing</h2>
                    <p className="text-gray-600">Share your quality produce with buyers</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmitListing} className="p-6 space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors cursor-pointer group"
                    >
                      {newListingForm.imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={newListingForm.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <div className="text-white text-center">
                              <Camera className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Change Image</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-green-600 transition-colors">
                          <Upload className="w-12 h-12 mb-3" />
                          <p className="text-lg font-medium">Upload Product Image</p>
                          <p className="text-sm">Click to browse or drag and drop</p>
                          <p className="text-xs mt-1">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Product Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={newListingForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="e.g., Fresh Organic Tomatoes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    value={newListingForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Describe your product quality, farming methods, harvest date, etc."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                {/* Price and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price per kg *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newListingForm.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={newListingForm.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        placeholder="e.g., Addis Ababa, Ethiopia"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Package className="w-5 h-5" />
                    <span>Create Listing</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;