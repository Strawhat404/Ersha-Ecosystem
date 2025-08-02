import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import paymentApi from '../services/paymentApi';

const PaymentAnalytics = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState({
    total_volume: 0,
    total_transactions: 0,
    success_rate: 0,
    average_transaction: 0,
    monthly_growth: 0,
    payment_methods_breakdown: [],
    transaction_status_breakdown: [],
    monthly_chart_data: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [userId, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await paymentApi.getAnalytics(userId);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
      // Load mock data as fallback
      loadMockAnalytics();
    } finally {
      setLoading(false);
    }
  };

  const loadMockAnalytics = () => {
    setAnalyticsData({
      total_volume: 125000,
      total_transactions: 156,
      success_rate: 94.2,
      average_transaction: 801.28,
      monthly_growth: 12.5,
      payment_methods_breakdown: [
        { method: 'Mobile Money', count: 89, percentage: 57.1, amount: 71250 },
        { method: 'Bank Transfer', count: 45, percentage: 28.8, amount: 36000 },
        { method: 'Digital Wallet', count: 22, percentage: 14.1, amount: 17750 }
      ],
      transaction_status_breakdown: [
        { status: 'Completed', count: 147, percentage: 94.2, amount: 117750 },
        { status: 'Pending', count: 6, percentage: 3.8, amount: 4800 },
        { status: 'Failed', count: 3, percentage: 2.0, amount: 2450 }
      ],
      monthly_chart_data: [
        { month: 'Jan', volume: 85000, transactions: 98 },
        { month: 'Feb', volume: 92000, transactions: 112 },
        { month: 'Mar', volume: 125000, transactions: 156 },
        { month: 'Apr', volume: 118000, transactions: 134 },
        { month: 'May', volume: 132000, transactions: 145 },
        { month: 'Jun', volume: 145000, transactions: 167 }
      ]
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${parseFloat(amount).toLocaleString()}`;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'mobile money':
        return <Smartphone className="w-5 h-5" />;
      case 'bank transfer':
        return <Banknote className="w-5 h-5" />;
      case 'digital wallet':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-32 skeleton"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card h-80 skeleton"></div>
          <div className="card h-80 skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Analytics</h2>
          <p className="text-gray-600">Track your payment performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <span className="text-red-700">{error}</span>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Total Volume</p>
              <p className="text-2xl font-bold">{formatCurrency(analyticsData.total_volume)}</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm text-white/90">+{analyticsData.monthly_growth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold">{analyticsData.total_transactions}</p>
              <p className="text-sm text-white/90">Transactions</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Success Rate</p>
              <p className="text-2xl font-bold">{analyticsData.success_rate}%</p>
              <p className="text-sm text-white/90">Successful payments</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Average Transaction</p>
              <p className="text-2xl font-bold">{formatCurrency(analyticsData.average_transaction)}</p>
              <p className="text-sm text-white/90">Per transaction</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {analyticsData.payment_methods_breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    {getPaymentMethodIcon(item.method)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.method}</p>
                    <p className="text-sm text-gray-600">{item.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                  <p className="text-sm text-gray-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transaction Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Status</h3>
          <div className="space-y-4">
            {analyticsData.transaction_status_breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.status.toLowerCase() === 'completed' ? 'bg-green-100' :
                    item.status.toLowerCase() === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.status}</p>
                    <p className="text-sm text-gray-600">{item.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                  <p className="text-sm text-gray-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.monthly_chart_data.map((data, index) => {
            const maxVolume = Math.max(...analyticsData.monthly_chart_data.map(d => d.volume));
            const height = (data.volume / maxVolume) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full">
                  <div 
                    className="bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-300 hover:from-teal-600 hover:to-teal-500"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                      {formatCurrency(data.volume)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{data.month}</p>
                <p className="text-xs text-gray-500">{data.transactions} txns</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Growing Strong</h4>
            <p className="text-sm text-gray-600">Your payment volume is increasing steadily</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Mobile Preferred</h4>
            <p className="text-sm text-gray-600">Mobile payments are your most popular method</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">High Success Rate</h4>
            <p className="text-sm text-gray-600">Excellent payment success rate of {analyticsData.success_rate}%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentAnalytics; 