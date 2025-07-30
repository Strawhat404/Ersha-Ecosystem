import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Wallet
} from 'lucide-react';

const PaymentSystem = ({ userType = "farmer" }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [balance, setBalance] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching payment data
    const fetchPaymentData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock transaction data
      const mockTransactions = [
        {
          id: "TXN001",
          type: "sale",
          amount: 2450.00,
          currency: "ETB",
          status: "completed",
          date: "2024-03-15",
          buyer: "Addis Market Hub",
          product: "Premium Fresh Carrots",
          quantity: "500kg",
          method: "M-Pesa",
          escrowStatus: "released"
        },
        {
          id: "TXN002",
          type: "purchase",
          amount: 1890.50,
          currency: "ETB", 
          status: "pending",
          date: "2024-03-14",
          seller: "Highland Coffee Growers",
          product: "Ethiopian Coffee Beans",
          quantity: "100kg",
          method: "CBE Birr",
          escrowStatus: "holding"
        },
        {
          id: "TXN003",
          type: "sale",
          amount: 3200.00,
          currency: "ETB",
          status: "completed",
          date: "2024-03-13",
          buyer: "Fresh Foods Ltd",
          product: "Sweet Red Apples",
          quantity: "800kg",
          method: "Bank Transfer",
          escrowStatus: "released"
        }
      ];

      const mockPaymentMethods = [
        {
          id: 1,
          type: "mobile",
          provider: "M-Pesa",
          number: "+251-9**-***-789",
          isDefault: true,
          verified: true
        },
        {
          id: 2,
          type: "bank",
          provider: "Commercial Bank of Ethiopia",
          account: "****-****-1234",
          isDefault: false,
          verified: true
        },
        {
          id: 3,
          type: "digital",
          provider: "HelloCash",
          number: "+251-9**-***-456",
          isDefault: false,
          verified: false
        }
      ];

      setTransactions(mockTransactions);
      setPaymentMethods(mockPaymentMethods);
      setBalance(8540.50);
      setPendingPayouts(1890.50);
      setLoading(false);
    };

    fetchPaymentData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-teal-100 text-teal-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEscrowStatusColor = (status) => {
    switch (status) {
      case "released": return "bg-green-100 text-green-800";
      case "holding": return "bg-yellow-100 text-yellow-800";
      case "disputed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </motion.svg>
      )
    },
    { 
      id: "transactions", 
      label: "Transactions",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ x: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "methods", 
      label: "Payment Methods",
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
        </motion.svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-32 skeleton"></div>
          ))}
        </div>
        <div className="card h-96 skeleton"></div>
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
          Payment Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your finances, track transactions, and handle payments securely
        </p>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Total Balance</p>
              <p className="text-3xl font-bold">ETB {balance.toLocaleString()}</p>
              <p className="text-white/90 text-sm">Available Funds</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Wallet className="w-8 h-8" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Monthly Income</p>
              <p className="text-3xl font-bold">ETB {(balance + pendingPayouts).toLocaleString()}</p>
              <p className="text-white/90 text-sm">This Month</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
            >
              <TrendingUp className="w-8 h-8" />
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
              <p className="text-white/80 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold">ETB {pendingPayouts.toLocaleString()}</p>
              <p className="text-white/90 text-sm">Awaiting Processing</p>
            </div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Clock className="w-8 h-8" />
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
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-teal-600"}>
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
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: "Request Payout", icon: "💰", color: "teal" },
                  { title: "Add Payment Method", icon: "💳", color: "blue" },
                  { title: "Generate Invoice", icon: "📄", color: "purple" },
                  { title: "View Reports", icon: "📊", color: "orange" }
                ].map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 border-${action.color}-200 hover:border-${action.color}-400 transition-all duration-300 text-center group`}
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className={`text-sm font-medium text-${action.color}-700 group-hover:text-${action.color}-800`}>
                      {action.title}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "sale" ? "bg-teal-100" : "bg-orange-100"
                      }`}>
                        {transaction.type === "sale" ? (
                          <ArrowDownLeft className="w-5 h-5 text-teal-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.product}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.type === "sale" ? transaction.buyer : transaction.seller}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {transaction.type === "sale" ? "+" : "-"}ETB {transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : transaction.status === 'pending' ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          transaction.status === 'completed' ? 'text-green-600' : 
                          transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "transactions" && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
              <div className="flex space-x-3">
                <button className="btn-secondary text-sm">Export CSV</button>
                <button className="btn-primary text-sm">Download Report</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Escrow</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm font-mono">{transaction.id}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "sale" ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">{transaction.product}</td>
                      <td className="py-4 px-4 font-medium">ETB {transaction.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {transaction.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : transaction.status === 'pending' ? (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            transaction.status === 'completed' ? 'text-green-600' : 
                            transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEscrowStatusColor(transaction.escrowStatus)}`}>
                          {transaction.escrowStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                      <td className="py-4 px-4">
                        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "methods" && (
          <motion.div
            key="methods"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
                <button className="btn-primary">Add New Method</button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                      method.isDefault 
                        ? "border-teal-300 bg-teal-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          method.type === "mobile" ? "bg-blue-100" :
                          method.type === "bank" ? "bg-green-100" : "bg-purple-100"
                        }`}>
                          <img 
                            src={
                              method.type === "mobile" 
                                ? "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=30&h=30&fit=crop&crop=center"
                                : method.type === "bank"
                                ? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=30&h=30&fit=crop&crop=center"
                                : "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=30&h=30&fit=crop&crop=center"
                            }
                            alt={method.type}
                            className="w-6 h-6 rounded-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.provider}</p>
                          <p className="text-sm text-gray-600">
                            {method.type === "bank" ? method.account : method.number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {method.verified && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            Verified
                          </span>
                        )}
                        {method.isDefault && (
                          <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                            Default
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Add New Payment Method Form */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Add Payment Method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { type: "M-Pesa", icon: "📱", description: "Mobile money transfer" },
                  { type: "Bank Account", icon: "🏦", description: "Direct bank transfer" },
                  { type: "Digital Wallet", icon: "💳", description: "HelloCash, Telebirr" }
                ].map((option, index) => (
                  <motion.button
                    key={option.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-300 transition-all duration-300 text-center"
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium text-gray-900">{option.type}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentSystem; 