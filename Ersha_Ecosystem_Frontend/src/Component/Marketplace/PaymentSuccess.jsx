import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag,
  Clock
} from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from URL params or localStorage
    const orderId = searchParams.get('order_id') || localStorage.getItem('lastOrderId');
    const transactionId = searchParams.get('transaction_id');
    
    if (orderId) {
      // You could fetch order details here if needed
      setOrderDetails({
        orderId,
        transactionId,
        status: 'completed'
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate('/marketplace');
  };

  const handleViewOrders = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Your order has been placed successfully and payment has been processed.
            You will receive a confirmation email shortly.
          </motion.p>

          {/* Order Details */}
          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">#{orderDetails.orderId}</span>
                </div>
                {orderDetails.transactionId && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-gray-900">{orderDetails.transactionId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {orderDetails.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center justify-center space-x-2">
              <Package className="w-5 h-5" />
              <span>What's Next?</span>
            </h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Order Confirmation</p>
                  <p className="text-sm text-blue-700">You'll receive an email confirmation with order details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Farmer Notification</p>
                  <p className="text-sm text-blue-700">The farmer will be notified and start preparing your order</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Delivery Updates</p>
                  <p className="text-sm text-blue-700">Track your order status in your dashboard</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleContinueShopping}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
            <button
              onClick={handleViewOrders}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Clock className="w-5 h-5" />
              <span>View Orders</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 