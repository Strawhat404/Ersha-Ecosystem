import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  StarOff, 
  Heart, 
  Eye, 
  ShoppingCart, 
  MapPin, 
  User, 
  Shield, 
  CheckCircle, 
  Package, 
  Leaf, 
  Truck, 
  Clock 
} from "lucide-react";

const ProductCard = ({ name, farmer, price, icon, role, rating = 4.5, stock = 95, verified = true, featured = false, discount = null, freshness = "Fresh", location = "Addis Ababa" }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickView = () => {
    // TODO: Implement quick view modal
    console.log("Quick view for:", name);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Added to cart:", name);
  };

  // Map product names to real images
  const getProductImage = (productName) => {
    const imageMap = {
      "Premium Fresh Carrots": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop&crop=center",
      "Organic Basmati Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&crop=center",
      "Sweet Red Apples": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop&crop=center",
      "Golden Potatoes": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop&crop=center",
      "Ethiopian Coffee Beans": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop&crop=center",
      "Yellow Onions": "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb7?w=200&h=200&fit=crop&crop=center",
      "Green Bananas": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop&crop=center",
      "Fresh Tomatoes": "https://images.unsplash.com/photo-1546470427-e105fc6f3da6?w=200&h=200&fit=crop&crop=center"
    };
    return imageMap[productName] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Featured
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
            -{discount}%
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLiked(!isLiked)}
        className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          discount ? 'top-12' : ''
        } ${
          isLiked 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
        }`}
      >
        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      </motion.button>

      {/* Product Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          className="relative z-10 w-full h-full"
        >
          <img 
            src={getProductImage(name)} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Quick Actions Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          className="absolute inset-0 bg-black/30 flex items-center justify-center space-x-3"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickView}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-50 transition-colors"
          >
            <Eye className="w-6 h-6 text-gray-700" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-50 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </motion.button>
        </motion.div>

        {/* Stock Indicator */}
        <div className="absolute bottom-3 left-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            stock > 80 
              ? 'bg-teal-100 text-teal-800' 
              : stock > 50 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <Package className="w-3 h-3 inline mr-1" />
            {stock}% in stock
          </div>
        </div>

        {/* Freshness Indicator */}
        <div className="absolute bottom-3 right-3">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Leaf className="w-3 h-3 inline mr-1" />
            {freshness}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="flex items-center">
              {verified ? (
                <CheckCircle className="w-4 h-4 mr-1 text-teal-600" />
              ) : (
                <User className="w-4 h-4 mr-1 opacity-50" />
              )}
              by {farmer}
            </span>
            {verified && (
              <span className="text-teal-600 font-medium">Verified</span>
            )}
          </div>
        </div>

        {/* Rating & Location */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="flex text-orange-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-600">({rating})</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-teal-600">
              {price}
            </div>
            {discount && (
              <div className="text-sm text-gray-500 line-through">
                ETB {(parseFloat(price.replace('ETB ', '')) * (1 + discount/100)).toFixed(2)}/kg
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-500">Minimum order</div>
            <div className="text-sm font-medium">5kg</div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className={`w-full btn-primary mb-4 ${
            stock < 20 ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={stock < 20}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {stock < 20 ? 'Low Stock' : 'Add to Cart'}
        </motion.button>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Truck className="w-3 h-3 mr-1" />
              Free delivery over 50kg
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Last updated 2h ago
            </span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 via-orange-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    </motion.div>
  );
};

export default ProductCard;