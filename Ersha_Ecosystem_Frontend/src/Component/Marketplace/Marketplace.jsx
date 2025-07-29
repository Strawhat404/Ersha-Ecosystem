import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown
} from "lucide-react";
import Filters from "./Filters";
import Products from "./Products";
import ProductCard from "./productCard";

const Marketplace = () => {
  const [filters, setFilters] = useState({ 
    categories: [], 
    locations: [], 
    priceRange: [0, 1000],
    rating: 0,
    verified: false,
    freshness: 'all'
  });
  const [role, setRole] = useState("merchant");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Add mock data for farmer listings
  const [farmerListings, setFarmerListings] = useState([]);

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
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-teal-800 py-20 overflow-hidden">
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
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-green-400/10 rounded-full animate-bounce-custom"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Agricultural <span className="text-gradient-teal">Marketplace</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-3xl mx-auto mb-8"
            >
              Connect directly with farmers and merchants. Trade quality produce at competitive prices with complete transparency.
            </motion.p>

            {/* Role Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2 border border-white/30">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setRole("merchant")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      role === "merchant"
                        ? "bg-white text-green-700 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Merchant View (Buy)</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setRole("farmer")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      role === "farmer"
                        ? "bg-white text-green-700 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-5 h-5" />
                      <span>Farmer View (Sell)</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

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

      {/* Search and Filter Bar */}
      <section className="relative -mt-8 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products, farmers, or locations..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                </button>

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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
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

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Only show for merchant role */}
            <AnimatePresence>
              {showFilters && role === "merchant" && (
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="w-80 flex-shrink-0"
                >
                  <div className="sticky top-8">
                    <Filters onFilterChange={setFilters} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Section */}
            <div className="flex-1">
              {role === "merchant" ? (
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
              ) : (
                /* Farmer View: My Listings */
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Product Listings</h2>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium flex items-center space-x-2"
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
    </div>
  );
};

export default Marketplace;