import React, { useState, useEffect } from 'react';
import { X, MapPin, Package, Phone, Mail, Truck } from 'lucide-react';
import { logisticsAPI } from '../../lib/api';

const LogisticsRequestModal = ({ isOpen, onClose, activity, onSuccess }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup_location: '',
    pickup_latitude: null,
    pickup_longitude: null,
    delivery_location: '',
    delivery_latitude: null,
    delivery_longitude: null,
    special_instructions: '',
    total_weight: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
      if (activity && activity.order_id) {
        // Pre-fill delivery location from order
        setFormData(prev => ({
          ...prev,
          delivery_location: activity.delivery_address || '',
          total_weight: activity.total_weight || 0
        }));
      }
    }
  }, [isOpen, activity]);

  const fetchProviders = async () => {
    try {
      const response = await logisticsAPI.getVerifiedProviders();
      setProviders(response.results || response);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProvider) {
      alert('Please select a logistics provider');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        order: activity.order_id,
        provider: selectedProvider.id,
        ...formData
      };

      await logisticsAPI.createRequest(requestData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating logistics request:', error);
      alert('Failed to create logistics request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (type, location, lat, lng) => {
    setFormData(prev => ({
      ...prev,
      [`${type}_location`]: location,
      [`${type}_latitude`]: lat,
      [`${type}_longitude`]: lng
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Request Logistics Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <span className="ml-2 font-medium">#{activity?.order_id}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="ml-2 font-medium">ETB {activity?.amount}</span>
              </div>
            </div>
          </div>

          {/* Logistics Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Logistics Provider *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedProvider?.id === provider.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProvider(provider)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-blue-600" />
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
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3" />
                      <span>{provider.contact_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3" />
                      <span>{provider.contact_email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickup_location: e.target.value }))}
                  placeholder="Enter pickup address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Delivery Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.delivery_location}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_location: e.target.value }))}
                  placeholder="Enter delivery address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Weight (kg)
              </label>
              <input
                type="number"
                value={formData.total_weight}
                onChange={(e) => setFormData(prev => ({ ...prev, total_weight: parseFloat(e.target.value) || 0 }))}
                placeholder="0.0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={formData.special_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
              placeholder="Any special handling instructions..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedProvider}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsRequestModal; 