import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import ProductCard from "./productCard";

const Products = ({ filters, role, viewMode = "grid" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock product data
  const mockProducts = [
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
      location: "Addis Ababa",
      category: "vegetables"
    },
    {
      name: "Organic Basmati Rice",
      farmer: "Highland Farmers Coop",
      price: "ETB 85/kg",
      icon: "🌾",
      role: "merchant",
      rating: 4.6,
      stock: 78,
      verified: true,
      freshness: "Premium",
      location: "Oromia",
      category: "grains"
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
      discount: 10,
      freshness: "Fresh",
      location: "Hawassa",
      category: "fruits"
    },
    {
      name: "Golden Potatoes",
      farmer: "Valley Fresh Produce",
      price: "ETB 35/kg",
      icon: "🥔",
      role: "merchant",
      rating: 4.5,
      stock: 88,
      verified: true,
      freshness: "Fresh",
      location: "Bahir Dar",
      category: "vegetables"
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
      freshness: "Premium",
      location: "Jimma",
      category: "coffee"
    },
    {
      name: "Yellow Onions",
      farmer: "Green Valley Farm",
      price: "ETB 28/kg",
      icon: "🧅",
      role: "merchant",
      rating: 4.4,
      stock: 94,
      verified: false,
      freshness: "Fresh",
      location: "Debre Zeit",
      category: "vegetables"
    },
    {
      name: "Green Bananas",
      farmer: "Tropical Harvest",
      price: "ETB 25/kg",
      icon: "🍌",
      role: "merchant",
      rating: 4.3,
      stock: 76,
      verified: true,
      freshness: "Fresh",
      location: "Arba Minch",
      category: "fruits"
    },
    {
      name: "Fresh Tomatoes",
      farmer: "Sunrise Vegetables",
      price: "ETB 55/kg",
      icon: "🍅",
      role: "merchant",
      rating: 4.6,
      stock: 89,
      verified: true,
      freshness: "Fresh",
      location: "Addis Ababa",
      category: "vegetables"
    },
    {
      name: "White Teff",
      farmer: "Traditional Grains Co.",
      price: "ETB 120/kg",
      icon: "🌾",
      role: "merchant",
      rating: 4.8,
      stock: 65,
      verified: true,
      freshness: "Premium",
      location: "Debre Berhan",
      category: "grains"
    },
    {
      name: "Fresh Milk",
      farmer: "Highland Dairy",
      price: "ETB 18/liter",
      icon: "🥛",
      role: "merchant", 
      rating: 4.7,
      stock: 45,
      verified: true,
      freshness: "Fresh",
      location: "Holeta",
      category: "dairy"
    },
    {
      name: "Red Kidney Beans",
      farmer: "Legume Specialists",
      price: "ETB 75/kg",
      icon: "🫘",
      role: "merchant",
      rating: 4.5,
      stock: 82,
      verified: true,
      freshness: "Premium",
      location: "Awassa",
      category: "legumes"
    },
    {
      name: "Green Peppers",
      farmer: "Fresh Garden Produce",
      price: "ETB 40/kg",
      icon: "🫑",
      role: "merchant",
      rating: 4.4,
      stock: 91,
      verified: true,
      freshness: "Fresh",
      location: "Mekelle",
      category: "vegetables"
    }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredProducts = [...mockProducts];
      
      // Apply filters
      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.categories.includes(product.category)
        );
      }
      
      if (filters.category && filters.category !== "all") {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filters.category
        );
      }
      
      if (filters.verified) {
        filteredProducts = filteredProducts.filter(product => product.verified);
      }
      
      if (filters.rating && filters.rating > 0) {
        filteredProducts = filteredProducts.filter(product => product.rating >= filters.rating);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.farmer.toLowerCase().includes(searchTerm) ||
          product.location.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_low':
            filteredProducts.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g,"")) - parseFloat(b.price.replace(/[^0-9.-]+/g,"")));
            break;
          case 'price_high':
            filteredProducts.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g,"")) - parseFloat(a.price.replace(/[^0-9.-]+/g,"")));
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'popularity':
            filteredProducts.sort((a, b) => b.stock - a.stock);
            break;
          default:
            // Keep original order for relevance
            break;
        }
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, role]);

  const LoadingSkeleton = () => (
    <div className={`grid gap-6 ${
      viewMode === "grid" 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "grid-cols-1"
    }`}>
      {[...Array(viewMode === "grid" ? 8 : 4)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${
            viewMode === "list" ? "flex" : ""
          }`}
        >
          <div className={`${viewMode === "list" ? "w-48 h-32" : "h-48"} bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`} />
          <div className="p-6 space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            {viewMode === "list" && (
              <>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your filters or search terms to find what you're looking for.
      </p>
      <button
        onClick={fetchProducts}
        className="btn-secondary flex items-center space-x-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Refresh</span>
      </button>
    </motion.div>
  );

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={fetchProducts}
        className="btn-primary flex items-center space-x-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </motion.div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Found {products.length} products
        </div>
        {filters.search && (
          <div className="text-sm text-gray-600">
            Searching for: <span className="font-medium text-gray-900">"{filters.search}"</span>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={viewMode === "list" ? "transform-none" : ""}
            >
              {viewMode === "list" ? (
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-32 bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
                      <img 
                        src={`https://images.unsplash.com/photo-1${Math.floor(Math.random() * 999999999)}?w=200&h=200&fit=crop&crop=center`} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center";
                        }}
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600">by {product.farmer}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <span>📍 {product.location}</span>
                            <span>⭐ {product.rating}</span>
                            <span>📦 {product.stock}% stock</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-600">{product.price}</div>
                          {product.discount && (
                            <div className="text-sm text-red-500">-{product.discount}% off</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {product.verified && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              ✓ Verified
                            </span>
                          )}
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {product.freshness}
                          </span>
                        </div>
                        <button className="btn-primary text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <ProductCard {...product} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {products.length >= 12 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          <button className="btn-secondary px-8 py-3">
            Load More Products
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Products;