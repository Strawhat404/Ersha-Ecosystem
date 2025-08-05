import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI, logisticsAPI } from '../../lib/api';
import { getChapaPublicKey, getCallbackUrls, validateChapaConfig } from '../../config/payment';
import { 
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartSummary, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get cart items from cartSummary
  const cartItems = cartSummary.cartItems || [];
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    deliveryInstructions: ''
  });
  
  const [logisticsProviders, setLogisticsProviders] = useState([]);
  const [selectedLogisticsProvider, setSelectedLogisticsProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChapaForm, setShowChapaForm] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Fetch logistics providers
  useEffect(() => {
    const fetchLogisticsProviders = async () => {
      try {
        const response = await logisticsAPI.getVerifiedProviders();
        setLogisticsProviders(response.results || response);
      } catch (error) {
        console.error('Error fetching logistics providers:', error);
      }
    };
    
    fetchLogisticsProviders();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'region'];
    for (const field of required) {
      if (!formData[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    // Check if logistics provider is selected
    if (!selectedLogisticsProvider) {
      setError('Please select a logistics provider');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Basic phone validation
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const initiatePayment = async () => {
    if (!validateForm()) return;
    
    // Validate Chapa configuration
    const chapaValidation = validateChapaConfig();
    if (!chapaValidation.valid) {
      setError(chapaValidation.error);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create order data first
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        delivery_address: {
          address: formData.address,
          city: formData.city,
          region: formData.region,
          postal_code: formData.postalCode,
          delivery_instructions: formData.deliveryInstructions
        },
        customer_info: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        total_amount: cartSummary.totalPrice,
        payment_provider: 'chapa',
        logistics_provider: selectedLogisticsProvider.id
      };

      // Call backend to create order (without payment initiation)
      const result = await ordersAPI.create(orderData);
      
      if (result.success && result.order_id) {
        // Generate unique transaction reference
        const txRef = `ersha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Store order data for Chapa form
        localStorage.setItem('pending_order', JSON.stringify({
          orderId: result.order_id,
          orderData: orderData,
          txRef: txRef
        }));
        
        setShowChapaForm(true);
      } else {
        throw new Error('Failed to create order');
      }
      
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  // Chapa payment form component
  const ChapaPaymentForm = () => {
    const pendingOrder = JSON.parse(localStorage.getItem('pending_order') || '{}');
    const chapaPublicKey = getChapaPublicKey();
    const callbackUrls = getCallbackUrls();
    const chapaValidation = validateChapaConfig();
    
    // Show configuration warning if needed
    if (!chapaValidation.valid) {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Configuration Required</h2>
              <p className="text-gray-600 mb-4">Chapa payment gateway is not properly configured.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{chapaValidation.error}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  {chapaValidation.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowChapaForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href="https://chapa.co"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Go to Chapa</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
            <p className="text-gray-600">You will be redirected to Chapa's secure payment page</p>
          </div>
          
          <form 
            method="POST" 
            action="https://api.chapa.co/v1/hosted/pay"
            className="space-y-4"
          >
            {/* Chapa Required Fields */}
            <input type="hidden" name="public_key" value={chapaPublicKey} />
            <input type="hidden" name="tx_ref" value={pendingOrder.txRef || `ersha-${Date.now()}`} />
            <input type="hidden" name="amount" value={cartSummary.totalPrice} />
            <input type="hidden" name="currency" value="ETB" />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="first_name" value={formData.firstName} />
            <input type="hidden" name="last_name" value={formData.lastName} />
            <input type="hidden" name="title" value="Ersha Ecosystem - Agricultural Products" />
            <input type="hidden" name="description" value={`Order for ${cartItems.length} items from Ersha Ecosystem`} />
            <input type="hidden" name="logo" value="https://ersha-ecosystem.com/logo.png" />
            <input type="hidden" name="callback_url" value={callbackUrls.callback} />
            <input type="hidden" name="return_url" value={callbackUrls.return} />
            <input type="hidden" name="meta[order_id]" value={pendingOrder.orderId} />
            <input type="hidden" name="meta[customer_name]" value={`${formData.firstName} ${formData.lastName}`} />
            <input type="hidden" name="meta[delivery_address]" value={`${formData.address}, ${formData.city}, ${formData.region}`} />
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowChapaForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Now</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (cartItems.length === 0) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToCart}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your purchase</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Customer Information</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Delivery Address</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region *
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your region"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions
                  </label>
                  <textarea
                    value={formData.deliveryInstructions}
                    onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                {/* Logistics Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logistics Provider *
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {logisticsProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedLogisticsProvider?.id === provider.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedLogisticsProvider(provider)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Truck className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">{provider.name}</h4>
                              <p className="text-sm text-gray-600">{provider.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-medium">{provider.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">ETB {provider.price_per_km}/km</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {logisticsProviders.length === 0 && (
                    <p className="text-sm text-gray-500">Loading logistics providers...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-lg">🌿</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.product.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ETB {parseFloat(item.total_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
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
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment</span>
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Payment</h4>
                      <p className="text-sm text-blue-700">
                        Your payment will be processed securely through Chapa payment gateway
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
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

            {/* Checkout Button */}
            <button
              onClick={initiatePayment}
              disabled={loading || showChapaForm}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : showChapaForm ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Payment Form Ready</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {showChapaForm && <ChapaPaymentForm />}
    </div>
  );
};

export default Checkout; 