import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Filter,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../lib/api';

// EMI Calculation Utility
const calculateEMI = (principal, rate, time) => {
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = time;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Math.round(emi);
};

const AnalyticsDashboard = ({ userType = "farmer" }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [salesData, setSalesData] = useState({});
  const [creditScore, setCreditScore] = useState(0);
  const [loanOffers, setLoanOffers] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEMICalculator, setShowEMICalculator] = useState({});
  const [emiInputs, setEmiInputs] = useState({});
  const [quickActionStatus, setQuickActionStatus] = useState({});

  // Quick Actions Handlers
  const handleGenerateReport = async () => {
    try {
      setQuickActionStatus(prev => ({ ...prev, report: 'loading' }));
      const reportData = {
        report_type: 'Monthly Sales Report',
        period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      
      const response = await analyticsAPI.generateReport(reportData);
      setQuickActionStatus(prev => ({ ...prev, report: 'success' }));
      
      // Refresh dashboard data
      fetchAnalyticsData();
      
      setTimeout(() => {
        setQuickActionStatus(prev => ({ ...prev, report: null }));
      }, 3000);
      
    } catch (error) {
      console.error('Error generating report:', error);
      setQuickActionStatus(prev => ({ ...prev, report: 'error' }));
    }
  };

  const handleExportData = async () => {
    try {
      setQuickActionStatus(prev => ({ ...prev, export: 'loading' }));
      const exportData = {
        export_type: 'sales_data',
        date_range: 'last_month',
        export_format: 'csv'
      };
      
      const response = await analyticsAPI.createExportRequest(exportData);
      const processedExport = await analyticsAPI.processExport(response.id);
      
      setQuickActionStatus(prev => ({ ...prev, export: 'success' }));
      
      setTimeout(() => {
        setQuickActionStatus(prev => ({ ...prev, export: null }));
      }, 3000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setQuickActionStatus(prev => ({ ...prev, export: 'error' }));
    }
  };

  const handlePaymentAnalysis = async () => {
    try {
      setQuickActionStatus(prev => ({ ...prev, payment: 'loading' }));
      const analysisData = {
        analysis_period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      
      const response = await analyticsAPI.generatePaymentAnalysis(analysisData);
      setQuickActionStatus(prev => ({ ...prev, payment: 'success' }));
      
      setTimeout(() => {
        setQuickActionStatus(prev => ({ ...prev, payment: null }));
      }, 3000);
      
    } catch (error) {
      console.error('Error generating payment analysis:', error);
      setQuickActionStatus(prev => ({ ...prev, payment: 'error' }));
    }
  };

  const handleSetTargets = async () => {
    try {
      setQuickActionStatus(prev => ({ ...prev, target: 'loading' }));
      const targetData = {
        target_type: 'revenue',
        target_value: 50000,
        target_period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      };
      
      const response = await analyticsAPI.createSalesTarget(targetData);
      setQuickActionStatus(prev => ({ ...prev, target: 'success' }));
      
      setTimeout(() => {
        setQuickActionStatus(prev => ({ ...prev, target: null }));
      }, 3000);
      
    } catch (error) {
      console.error('Error setting sales target:', error);
      setQuickActionStatus(prev => ({ ...prev, target: 'error' }));
    }
  };

  const handleDownloadReport = async (reportId, format = 'pdf') => {
    try {
      console.log(`Downloading report ${reportId} in ${format} format...`);
      const blob = await analyticsAPI.downloadReport(reportId, format);
      
      console.log('Blob received:', blob);
      console.log('Blob type:', blob.type);
      console.log('Blob size:', blob.size);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monthly_report_${format}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
      
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  useEffect(() => {
    // Only show analytics for farmers
    if (user?.user_type !== 'farmer') {
      setError('Analytics dashboard is only available for farmers');
      setLoading(false);
      return;
    }

    fetchAnalyticsData();
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      console.log('Authentication token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      // Fetch dashboard data from backend
      console.log('Fetching analytics data...');
      const data = await analyticsAPI.getDashboard();
      console.log('Analytics data received:', data);
      
      // Transform backend data to match frontend expectations
      const transformedData = {
        totalRevenue: data.total_revenue || 0,
        totalSales: data.total_sales || 0,
        avgOrderValue: data.avg_order_value || 0,
        revenueGrowth: data.revenue_growth || 0,
        salesGrowth: data.sales_growth || 0,
        topProducts: data.top_products?.map(product => ({
          name: product.product__name,
          revenue: product.revenue,
          sales: product.sales,
          percentage: Math.round((product.revenue / data.total_revenue) * 100) || 0
        })) || [],
        monthlyTrends: data.monthly_trends?.map(trend => ({
          month: trend.month,
          revenue: trend.revenue,
          sales: trend.sales
        })) || [],
        newOrders: data.total_sales || 0,
        orderGrowth: data.sales_growth || 0,
        activeUsers: 1, // Simplified for farmer dashboard
        userGrowth: 0
      };

      setSalesData(transformedData);
      setCreditScore(data.credit_score || 0);
      setLoanOffers(data.loan_offers || []);
      setMonthlyReports(data.monthly_reports || []);
      
      console.log('Credit Score from API:', data.credit_score);
      console.log('Loan Offers from API:', data.loan_offers);
      console.log('Monthly Reports from API:', data.monthly_reports);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again later.');
      
      // Fallback to mock data if API fails
      const mockSalesData = {
        totalRevenue: 125450.75,
        totalSales: 45,
        avgOrderValue: 2787.79,
        topProducts: [
          { name: "Premium Fresh Carrots", revenue: 45230.50, sales: 18, percentage: 36 },
          { name: "Sweet Red Apples", revenue: 32180.25, sales: 12, percentage: 26 },
          { name: "Ethiopian Coffee Beans", revenue: 28040.00, sales: 8, percentage: 22 },
          { name: "Golden Potatoes", revenue: 19999.00, sales: 7, percentage: 16 }
        ],
        monthlyTrends: [
          { month: "Jan", revenue: 18500, sales: 8 },
          { month: "Feb", revenue: 22300, sales: 9 },
          { month: "Mar", revenue: 28750, sales: 12 },
          { month: "Apr", revenue: 31200, sales: 13 },
          { month: "May", revenue: 24700, sales: 3 }
        ],
        revenueGrowth: 23.4,
        salesGrowth: 18.7,
        newOrders: 45,
        orderGrowth: 18.7,
        activeUsers: 1,
        userGrowth: 0
      };

      setSalesData(mockSalesData);
      setCreditScore(742);
      setLoanOffers([
        {
          id: 1,
          bank: "Development Bank of Ethiopia",
          logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=50&h=50&fit=crop&crop=center",
          amount: 250000,
          interestRate: 8.5,
          term: "24 months",
          type: "Agricultural Equipment Loan",
          requirements: ["6 months sales history", "Collateral: Equipment"],
          approved: true,
          disbursementTime: "5-7 days"
        }
      ]);
      setMonthlyReports([
        {
          id: 1,
          period: "March 2024",
          revenue: 28750,
          sales: 12,
          profit: 8625,
          profitMargin: 30,
          topCategory: "Vegetables",
          growthRate: 15.2,
          generatedAt: "2024-04-01"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-orange-600";
    return "text-red-600";
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    return "Fair";
  };

  const tabs = [
    { 
      id: "overview", 
      label: "Overview",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
        </motion.svg>
      )
    },
    { 
      id: "sales", 
      label: "Sales Analysis",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
        </motion.svg>
      )
    },
    { 
      id: "credit", 
      label: "Credit & Loans",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "reports", 
      label: "Reports",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ x: [0, 3, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
        </motion.svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-32 skeleton"></div>
          ))}
        </div>
        <div className="card h-96 skeleton"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="card text-center py-12">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button 
            onClick={fetchAnalyticsData}
            className="btn-primary"
          >
            Retry
          </button>
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
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your sales performance, build credit, and access loan opportunities
        </p>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-white">ETB {salesData.totalRevenue?.toLocaleString()}</p>
              <p className="text-white/90 text-sm">↗️ +{salesData.revenueGrowth}%</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-white">{salesData.totalSales}</p>
              <p className="text-white/90 text-sm">↗️ +{salesData.salesGrowth}%</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <DollarSign className="w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">New Orders</p>
              <p className="text-2xl font-bold text-white">{salesData.newOrders}</p>
              <p className="text-white/90 text-sm">🔥 +{salesData.orderGrowth}%</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ShoppingCart className="w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Credit Score</p>
              <p className="text-2xl font-bold text-white">{creditScore}</p>
              <p className="text-white/90 text-sm">{getCreditScoreLabel(creditScore)}</p>
            </div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Users className="w-6 h-6" />
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
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-purple-600"}>
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
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Monthly Trends Chart */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Trends</h3>
              <div className="grid grid-cols-5 gap-4 h-64">
                {salesData.monthlyTrends?.map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.revenue / 35000) * 100}%` }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    className="flex flex-col items-center justify-end"
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg flex items-end justify-center text-white text-xs font-medium pb-2"
                      style={{ height: `${(month.revenue / 35000) * 100}%` }}
                    >
                      {month.revenue > 25000 && `ETB ${(month.revenue/1000).toFixed(0)}k`}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-medium">{month.month}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Products</h3>
              <div className="space-y-4">
                {salesData.topProducts?.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">ETB {product.revenue.toLocaleString()}</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${product.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "sales" && (
          <motion.div
            key="sales"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Sales Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Sales Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue Growth</span>
                    <span className="font-bold text-green-600">+{salesData.revenueGrowth}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sales Growth</span>
                    <span className="font-bold text-blue-600">+{salesData.salesGrowth}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Month</span>
                    <span className="font-bold text-purple-600">April 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Top Category</span>
                    <span className="font-bold text-orange-600">Vegetables</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleGenerateReport()}
                    disabled={quickActionStatus.report === 'loading'}
                    className={`w-full text-left transition-all duration-200 ${
                      quickActionStatus.report === 'loading' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : quickActionStatus.report === 'success'
                        ? 'bg-green-600 text-white'
                        : quickActionStatus.report === 'error'
                        ? 'bg-red-600 text-white'
                        : 'btn-primary hover:bg-purple-700'
                    }`}
                  >
                    {quickActionStatus.report === 'loading' ? '⏳ Processing...' : 
                     quickActionStatus.report === 'success' ? '✅ Report Generated!' :
                     quickActionStatus.report === 'error' ? '❌ Failed' :
                     '📊 Generate Monthly Report'}
                  </button>
                  
                  <button 
                    onClick={() => handleExportData()}
                    disabled={quickActionStatus.export === 'loading'}
                    className={`w-full text-left transition-all duration-200 ${
                      quickActionStatus.export === 'loading' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : quickActionStatus.export === 'success'
                        ? 'bg-green-600 text-white'
                        : quickActionStatus.export === 'error'
                        ? 'bg-red-600 text-white'
                        : 'btn-secondary hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {quickActionStatus.export === 'loading' ? '⏳ Exporting...' : 
                     quickActionStatus.export === 'success' ? '✅ Data Exported!' :
                     quickActionStatus.export === 'error' ? '❌ Failed' :
                     '📈 Export Sales Data'}
                  </button>
                  
                  <button 
                    onClick={() => handlePaymentAnalysis()}
                    disabled={quickActionStatus.payment === 'loading'}
                    className={`w-full text-left transition-all duration-200 ${
                      quickActionStatus.payment === 'loading' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : quickActionStatus.payment === 'success'
                        ? 'bg-green-600 text-white'
                        : quickActionStatus.payment === 'error'
                        ? 'bg-red-600 text-white'
                        : 'btn-secondary hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {quickActionStatus.payment === 'loading' ? '⏳ Analyzing...' : 
                     quickActionStatus.payment === 'success' ? '✅ Analysis Complete!' :
                     quickActionStatus.payment === 'error' ? '❌ Failed' :
                     '💰 Request Payment Analysis'}
                  </button>
                  
                  <button 
                    onClick={() => handleSetTargets()}
                    disabled={quickActionStatus.target === 'loading'}
                    className={`w-full text-left transition-all duration-200 ${
                      quickActionStatus.target === 'loading' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : quickActionStatus.target === 'success'
                        ? 'bg-green-600 text-white'
                        : quickActionStatus.target === 'error'
                        ? 'bg-red-600 text-white'
                        : 'btn-secondary hover:bg-orange-600 hover:text-white'
                    }`}
                  >
                    {quickActionStatus.target === 'loading' ? '⏳ Setting Target...' : 
                     quickActionStatus.target === 'success' ? '✅ Target Set!' :
                     quickActionStatus.target === 'error' ? '❌ Failed' :
                     '🎯 Set Sales Targets'}
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sales Analytics</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Units Sold</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.topProducts?.map((product, index) => (
                      <tr key={product.name} className="border-b border-gray-100">
                        <td className="py-4 px-4 font-medium">{product.name}</td>
                        <td className="py-4 px-4">{product.sales}</td>
                        <td className="py-4 px-4">ETB {product.revenue.toLocaleString()}</td>
                        <td className="py-4 px-4">ETB {Math.round(product.revenue / product.sales)}</td>
                        <td className="py-4 px-4">
                          <span className="text-green-600 font-medium">+{Math.round(Math.random() * 20 + 5)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "credit" && (
          <motion.div
            key="credit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Credit Score Section */}
            <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Credit Score</h3>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-32 h-32 mx-auto mb-4"
                >
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={creditScore >= 750 ? "text-green-500" : creditScore >= 650 ? "text-orange-500" : "text-red-500"}
                      initial={{ strokeDasharray: "0 352" }}
                      animate={{ strokeDasharray: `${(creditScore / 850) * 352} 352` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getCreditScoreColor(creditScore)}`}>
                        {creditScore}
                      </div>
                      <div className="text-sm text-gray-600">{getCreditScoreLabel(creditScore)}</div>
                    </div>
                  </div>
                </motion.div>
                <p className="text-gray-600">
                  Your credit score is based on your sales history, payment reliability, and business performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-lg font-bold text-gray-900">85%</div>
                  <div className="text-sm text-gray-600">Payment Reliability</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-lg font-bold text-gray-900">12 months</div>
                  <div className="text-sm text-gray-600">Sales History</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-lg font-bold text-gray-900">ETB 125k</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>

            {/* Loan Offers */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Available Loan Offers</h3>
              <div className="space-y-4">
                {loanOffers.map((loan, index) => {
                  const loanId = loan.id;
                  const isCalculatorOpen = showEMICalculator[loanId];
                  const emiInput = emiInputs[loanId] || {
                    amount: loan.max_amount || loan.amount || 10000,
                    months: loan.term_months || 12
                  };
                  
                  const calculatedEMI = calculateEMI(
                    emiInput.amount, 
                    loan.interest_rate, 
                    emiInput.months
                  );

                  return (
                    <motion.div
                      key={loanId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 border-2 rounded-lg transition-all duration-300 ${
                        loan.approved 
                          ? "border-green-300 bg-green-50" 
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {loan.bank_name?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{loan.bank_name || loan.bank}</h4>
                            <p className="text-sm text-gray-600">Agricultural Loan</p>
                          </div>
                        </div>
                        {loan.approved && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Pre-Approved
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-lg font-bold text-gray-900">ETB {loan.max_amount?.toLocaleString() || loan.amount?.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Loan Amount</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{loan.interest_rate}%</div>
                          <div className="text-sm text-gray-600">Interest Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{loan.term_months} months</div>
                          <div className="text-sm text-gray-600">Loan Term</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">5-7 days</div>
                          <div className="text-sm text-gray-600">Disbursement</div>
                        </div>
                      </div>

                      {/* EMI Calculator */}
                      {isCalculatorOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <Calculator className="w-5 h-5 text-blue-600" />
                            <h5 className="font-medium text-gray-900">EMI Calculator</h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (ETB)</label>
                              <input
                                type="number"
                                value={emiInput.amount}
                                onChange={(e) => setEmiInputs({
                                  ...emiInputs,
                                  [loanId]: { ...emiInput, amount: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min={loan.min_amount || 1000}
                                max={loan.max_amount || loan.amount || 100000}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                              <input
                                type="number"
                                value={loan.interest_rate}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Term (Months)</label>
                              <input
                                type="number"
                                value={emiInput.months}
                                onChange={(e) => setEmiInputs({
                                  ...emiInputs,
                                  [loanId]: { ...emiInput, months: parseInt(e.target.value) || 12 }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="6"
                                max="60"
                              />
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-200">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">ETB {calculatedEMI.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Monthly EMI</div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Min Credit Score: {loan.min_credit_score || 300}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Min Revenue: ETB {loan.min_revenue?.toLocaleString() || 0}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Sales History: {loan.min_sales_history || 0} months
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className={`flex-1 ${loan.approved ? 'btn-primary' : 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200'}`}>
                          {loan.approved ? 'Apply Now' : 'Learn More'}
                        </button>
                        <button 
                          onClick={() => setShowEMICalculator({
                            ...showEMICalculator,
                            [loanId]: !isCalculatorOpen
                          })}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          <Calculator className="w-4 h-4" />
                          <span>{isCalculatorOpen ? 'Hide EMI' : 'Calculate EMI'}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Report Generation */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Generate New Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select className="form-input">
                    <option>Monthly Sales Report</option>
                    <option>Quarterly Performance</option>
                    <option>Annual Summary</option>
                    <option>Product Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <select className="form-input">
                    <option>March 2024</option>
                    <option>February 2024</option>
                    <option>January 2024</option>
                    <option>Q1 2024</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="btn-primary w-full">
                    📊 Generate Report
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Reports */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Reports</h3>
              <div className="space-y-4">
                {monthlyReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{report.period} Report</h4>
                        <p className="text-sm text-gray-600">Generated on {report.generated_at}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-secondary text-sm">View</button>
                        <div className="relative group">
                          <button className="btn-primary text-sm flex items-center space-x-1">
                            <span>Download</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="py-1">
                              <button 
                                onClick={() => handleDownloadReport(report.id, 'pdf')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                📄 Download PDF
                              </button>
                              <button 
                                onClick={() => handleDownloadReport(report.id, 'excel')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                📊 Download Excel
                              </button>
                              <button 
                                onClick={() => handleDownloadReport(report.id, 'csv')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                📋 Download CSV
                              </button>
                              <button 
                                onClick={() => handleDownloadReport(report.id, 'json')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                📄 Download JSON
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-lg font-bold text-gray-900">ETB {report.revenue?.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{report.sales}</div>
                        <div className="text-sm text-gray-600">Sales</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">ETB {report.profit?.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Profit</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{report.profit_margin}%</div>
                        <div className="text-sm text-gray-600">Margin</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">+{report.growth_rate}%</div>
                        <div className="text-sm text-gray-600">Growth</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsDashboard; 