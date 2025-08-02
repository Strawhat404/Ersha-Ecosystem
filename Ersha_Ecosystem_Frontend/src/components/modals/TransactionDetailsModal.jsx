import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Share2, 
  Copy,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Package,
  CreditCard
} from 'lucide-react';

const TransactionDetailsModal = ({ isOpen, onClose, transaction, userId }) => {
  const [copied, setCopied] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEscrowStatusColor = (status) => {
    switch (status) {
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'holding':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount, currency = 'ETB') => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !transaction) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                {transaction.type === 'sale' ? (
                  <TrendingDown className="w-5 h-5 text-teal-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                <p className="text-sm text-gray-600">{transaction.transaction_id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Transaction Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {transaction.status === 'completed' && 'Transaction completed successfully'}
                      {transaction.status === 'pending' && 'Transaction is being processed'}
                      {transaction.status === 'failed' && 'Transaction failed'}
                      {transaction.status === 'processing' && 'Transaction is being processed'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>

            {/* Transaction Amount */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Transaction Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  {transaction.type === 'sale' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {transaction.type === 'sale' ? 'Received' : 'Sent'} on {formatDate(transaction.created_at)}
                </p>
              </div>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Transaction Information</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-gray-900">{transaction.transaction_id}</span>
                      <button
                        onClick={() => copyToClipboard(transaction.transaction_id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'sale' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {transaction.type}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Currency</span>
                    <span className="text-sm font-medium text-gray-900">{transaction.currency}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Provider</span>
                    <span className="text-sm font-medium text-gray-900">{transaction.payment_provider}</span>
                  </div>
                </div>
              </div>

              {/* Parties Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Parties Involved</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Sender</span>
                    <p className="text-sm font-medium text-gray-900">{transaction.sender_name}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Receiver</span>
                    <p className="text-sm font-medium text-gray-900">{transaction.receiver_name}</p>
                  </div>
                  
                  {transaction.product_name && (
                    <div>
                      <span className="text-sm text-gray-600">Product</span>
                      <p className="text-sm font-medium text-gray-900">{transaction.product_name}</p>
                    </div>
                  )}
                  
                  {transaction.quantity && (
                    <div>
                      <span className="text-sm text-gray-600">Quantity</span>
                      <p className="text-sm font-medium text-gray-900">{transaction.quantity}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Escrow Information */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Escrow Status</h3>
                    <p className="text-sm text-gray-600">
                      {transaction.escrow_status === 'holding' && 'Funds are held in escrow'}
                      {transaction.escrow_status === 'released' && 'Funds have been released'}
                      {transaction.escrow_status === 'disputed' && 'Transaction is disputed'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEscrowStatusColor(transaction.escrow_status)}`}>
                  {transaction.escrow_status}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Timeline</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(transaction.created_at)}</span>
                </div>
                
                {transaction.completed_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(transaction.completed_at)}</span>
                  </div>
                )}
                
                {transaction.updated_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(transaction.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => copyToClipboard(transaction.transaction_id)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </button>
              
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
              
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionDetailsModal; 