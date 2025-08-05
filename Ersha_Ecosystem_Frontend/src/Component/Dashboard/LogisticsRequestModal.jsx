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
      console.log('LogisticsRequestModal - Activity data:', activity);
      console.log('Logistics provider ID from activity:', activity?.logistics_provider);
      console.log('Activity type:', activity?.type);
      console.log('Activity notification_type:', activity?.notification_type);
      
      fetchProviders();
      if (activity && (activity.order_id || activity.notification_id)) {
        // Pre-fill delivery location from order
        setFormData(prev => ({
          ...prev,
          delivery_location: activity.delivery_address || '',
          total_weight: activity.total_weight || 0
        }));
        
        // Pre-select the logistics provider that the buyer chose
        if (activity.logistics_provider) {
          console.log('Logistics provider data:', activity.logistics_provider);
          // If logistics_provider is an ID, we'll find the provider object after fetching
          // If it's already an object, we can use it directly
          if (typeof activity.logistics_provider === 'object') {
            setSelectedProvider(activity.logistics_provider);
          }
        } else {
          console.log('No logistics provider found in activity data');
        }
      }
    }
  }, [isOpen, activity]);

  const fetchProviders = async () => {
    try {
      // If buyer has already selected a logistics provider, we don't need to fetch all providers
      if (activity?.logistics_provider) {
        console.log('Buyer has already selected logistics provider:', activity.logistics_provider);
        
        // If logistics_provider is already an object, use it directly
        if (typeof activity.logistics_provider === 'object') {
          setSelectedProvider(activity.logistics_provider);
          setProviders([activity.logistics_provider]); // Only show this one provider
          return;
        }
        
        // If it's an ID, fetch just that specific provider
        const providerId = activity.logistics_provider; // Keep as string for UUID comparison
        console.log('Fetching specific provider with ID:', providerId);
        
        // For now, we'll fetch all providers and find the specific one
        // In a real implementation, you'd have an API endpoint to fetch a single provider by ID
        const response = await logisticsAPI.getVerifiedProviders();
        const providersList = response.results || response;
        console.log('All providers:', providersList);
        console.log('Looking for provider with ID:', providerId);
        console.log('Provider IDs available:', providersList.map(p => p.id));
        
        const selectedProviderObj = providersList.find(p => p.id === providerId);
        console.log('Found provider:', selectedProviderObj);
        
        if (selectedProviderObj) {
          setSelectedProvider(selectedProviderObj);
          setProviders([selectedProviderObj]); // Only show this one provider
        } else {
          console.error('Selected provider not found');
          // Fallback: show all providers but mark the issue
          setProviders(providersList);
        }
      } else {
        // Only fetch all providers if buyer hasn't selected one (which shouldn't happen)
        console.log('No logistics provider selected by buyer - fetching all providers');
        const response = await logisticsAPI.getVerifiedProviders();
        const providersList = response.results || response;
        setProviders(providersList);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If buyer hasn't selected a provider, farmer must select one
    if (!activity?.logistics_provider && !selectedProvider) {
      alert('Please select a logistics provider');
      return;
    }
    
    // If buyer has selected a provider, we should have a selectedProvider
    if (activity?.logistics_provider && !selectedProvider) {
      alert('Logistics provider information is missing. Please try again.');
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
              {activity?.logistics_provider ? 'Logistics Provider (Buyer\'s Choice)' : 'Select Logistics Provider *'}
            </label>
            
            {activity?.logistics_provider ? (
              // Show only the buyer's selected provider
              <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4">
                {selectedProvider && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedProvider.name}</h4>
                          <p className="text-sm text-gray-600">{selectedProvider.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{selectedProvider.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">ETB {selectedProvider.price_per_km}/km</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>{selectedProvider.contact_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>{selectedProvider.contact_email}</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded">
                      <p className="text-xs text-blue-800 font-medium">
                        🔒 Selected by buyer - cannot be changed
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // This should never happen since buyer always selects logistics provider
              <div className="text-center py-8 text-gray-500">
                <p>No logistics provider selected by buyer</p>
              </div>
            )}
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
              disabled={loading || (!selectedProvider && !activity?.logistics_provider)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending Request...' : 'Send Request to Logistics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsRequestModal; 