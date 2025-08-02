import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import paymentApi from '../../services/paymentApi';

const ReportsModal = ({ isOpen, onClose, userId }) => {
  const [selectedReport, setSelectedReport] = useState('summary');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedReport) {
      fetchReport();
    }
  }, [isOpen, selectedReport, dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await paymentApi.getReports(userId, selectedReport, dateRange.startDate, dateRange.endDate);
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      // Mock data for demo
      setReportData(getMockReportData());
    } finally {
      setLoading(false);
    }
  };

  const getMockReportData = () => {
    const mockData = {
      summary: {
        total_transactions: 150,
        total_volume: 125000,
        success_rate: 85.5,
        average_transaction: 833.33
      },
      transactions: [
        { date: '2024-03-15', count: 12, volume: 15000 },
        { date: '2024-03-14', count: 8, volume: 9500 },
        { date: '2024-03-13', count: 15, volume: 18000 }
      ],
      invoices: [
        { status: 'paid', count: 45, amount: 67500 },
        { status: 'pending', count: 12, amount: 18000 },
        { status: 'overdue', count: 3, amount: 4500 }
      ],
      payouts: [
        { status: 'completed', count: 25, amount: 50000 },
        { status: 'pending', count: 8, amount: 16000 },
        { status: 'failed', count: 2, amount: 4000 }
      ]
    };
    return mockData;
  };

  const reports = [
    { id: 'summary', name: 'Summary Report', icon: BarChart3 },
    { id: 'transactions', name: 'Transaction Report', icon: TrendingUp },
    { id: 'invoices', name: 'Invoice Report', icon: Calendar },
    { id: 'payouts', name: 'Payout Report', icon: Download }
  ];

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Payment Reports</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Report Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {reports.map((report) => {
              const IconComponent = report.icon;
              return (
                <motion.button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-center ${
                    selectedReport === report.id
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                    selectedReport === report.id ? 'text-orange-600' : 'text-gray-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    selectedReport === report.id ? 'text-orange-700' : 'text-gray-700'
                  }`}>
                    {report.name}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading report...</p>
              </div>
            ) : reportData ? (
              <div>
                {selectedReport === 'summary' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData.summary?.total_transactions || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Volume</p>
                      <p className="text-2xl font-bold text-gray-900">ETB {(reportData.summary?.total_volume || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{(reportData.summary?.success_rate || 0).toFixed(1)}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Avg Transaction</p>
                      <p className="text-2xl font-bold text-gray-900">ETB {(reportData.summary?.average_transaction || 0).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {selectedReport === 'transactions' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                    <div className="space-y-3">
                      {reportData.transactions?.map((txn, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{txn.date}</p>
                            <p className="text-sm text-gray-600">{txn.count} transactions</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">ETB {txn.volume.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport === 'invoices' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Invoice Status</h3>
                    <div className="space-y-3">
                      {reportData.invoices?.map((invoice, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium capitalize">{invoice.status}</p>
                            <p className="text-sm text-gray-600">{invoice.count} invoices</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">ETB {invoice.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport === 'payouts' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payout Status</h3>
                    <div className="space-y-3">
                      {reportData.payouts?.map((payout, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium capitalize">{payout.status}</p>
                            <p className="text-sm text-gray-600">{payout.count} payouts</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">ETB {payout.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No report data available
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Export functionality would go here
                console.log('Exporting report...');
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportsModal; 