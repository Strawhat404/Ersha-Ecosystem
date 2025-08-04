import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../../contexts/LocaleContext';
import { logisticsAPI } from '../../lib/api';
import { 
  Truck, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const LogisticsProviderDashboard = () => {
  const { t } = useLocale();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await logisticsAPI.getProviderRequests();
      setRequests(response.results || response);
      
      // Calculate stats
      const stats = {
        pending: (response.results || response).filter(r => r.status === 'pending').length,
        accepted: (response.results || response).filter(r => r.status === 'accepted').length,
        completed: (response.results || response).filter(r => r.status === 'completed').length,
        total: (response.results || response).length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await logisticsAPI.acceptRequest(requestId);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId, reason) => {
    try {
      await logisticsAPI.rejectRequest(requestId, reason);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      await logisticsAPI.completeRequest(requestId);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Truck className="w-6 h-6 text-green-600" />
          <span>Logistics Provider Dashboard</span>
        </h1>
        <p className="text-gray-600">Manage incoming logistics requests from farmers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Requests</h2>
        
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No logistics requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Farmer Information</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><User className="w-3 h-3 inline mr-1" />{request.farmer_name}</p>
                          <p><Mail className="w-3 h-3 inline mr-1" />{request.farmer_email}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Order #{request.order_id}</p>
                          <p><DollarSign className="w-3 h-3 inline mr-1" />ETB {request.estimated_cost || 'TBD'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Pickup Location</h3>
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{request.pickup_location}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Delivery Location</h3>
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{request.delivery_location}</p>
                        </div>
                      </div>
                    </div>

                    {request.special_instructions && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">Special Instructions</h3>
                        <p className="text-sm text-gray-600">{request.special_instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 space-y-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id, 'Not available')}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteRequest(request.id)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Mark Complete
                      </button>
                    )}

                    {request.status === 'completed' && (
                      <div className="text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsProviderDashboard; 