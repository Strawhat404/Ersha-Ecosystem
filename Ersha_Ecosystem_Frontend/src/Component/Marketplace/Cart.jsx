import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  MapPin,
  Package,
  DollarSign,
  Truck,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, cartSummary, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 0.01) return;
    
    setUpdatingItem(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/marketplace');
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleContinueShopping}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">
                  {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-8 text-center"
              >
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">🌿</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.product.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{item.product.farmer?.region || 'Location not set'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Package className="w-4 h-4" />
                                <span>{item.product.unit}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ETB {parseFloat(item.total_price).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ETB {parseFloat(item.product.price).toFixed(2)} per {item.product.unit}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, parseFloat(item.quantity) - 0.5)}
                              disabled={updatingItem === item.id}
                              className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-medium min-w-[60px] text-center">
                              {updatingItem === item.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
                              ) : (
                                `${item.quantity} ${item.product.unit}`
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, parseFloat(item.quantity) + 0.5)}
                              disabled={updatingItem === item.id}
                              className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartSummary.totalItems})</span>
                  <span>ETB {cartSummary.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>ETB {cartSummary.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </>
                )}
              </button>

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Free Delivery</h4>
                    <p className="text-sm text-green-700">
                      All orders include free delivery to your location
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 