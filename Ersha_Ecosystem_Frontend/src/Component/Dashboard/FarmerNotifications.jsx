import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Package, 
  X,
  Check,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  AlertCircle,
  Info,
  CheckCircle2,
  Loader2,
  Map,
  MapPinOff,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FarmerNotifications = ({ notifications: propNotifications = [], unreadCount: propUnreadCount = 0, onNotificationClick }) => {
  // WebSocket connection state
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(propNotifications || []);
  const [unreadCount, setUnreadCount] = useState(propUnreadCount || 0);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationShareStatus, setLocationShareStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [locationLoading, setLocationLoading] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [error, setError] = useState(null);
  const notificationSound = useRef(null);
  const locationDataRef = useRef({
    address: '',
    phone: user?.phone || '',
    notes: '',
    availableTime: '',
    coordinates: null,
    accuracy: null
  });
  
  const [locationData, setLocationData] = useState(locationDataRef.current);

  // Use props if provided, otherwise use local state
  const displayNotifications = propNotifications || notifications;
  const displayUnreadCount = propUnreadCount !== undefined ? propUnreadCount : unreadCount;

  // Fetch notifications with retry logic and caching
  const fetchNotifications = useCallback(async () => {
    let retries = 0;
    const maxRetries = 3;
    
    const fetchWithRetry = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        const response = await fetch(`${API_BASE_URL}/orders/notifications/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(prev => {
            // Only update if the data has changed to prevent unnecessary re-renders
            if (JSON.stringify(prev) !== JSON.stringify(data.results || [])) {
              return data.results || [];
            }
            return prev;
          });
          
          const unread = data.results?.filter(n => !n.is_read).length || 0;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (retries < maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          return fetchWithRetry();
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if we don't have WebSocket connection
    if (!isConnected) {
      fetchWithRetry();
    }
  }, [isConnected]);

  // Mark notification as read with optimistic updates
  const markAsRead = async (notificationId) => {
    try {
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      
      // Update unread count if this was unread
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Send API request
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/orders/notifications/${notificationId}/mark_read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Revert on error
        console.error('Failed to mark notification as read');
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: false } : notif
          )
        );
        if (notification && !notification.is_read) {
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Get current location with better error handling and permissions
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return Promise.reject('Geolocation not supported');
    }
    
    setLocationLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0 // Force fresh location
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          setLocationData(prev => ({
            ...prev,
            coordinates: coords,
            accuracy: position.coords.accuracy
          }));
          
          // Update the ref as well
          locationDataRef.current = {
            ...locationDataRef.current,
            coordinates: coords,
            accuracy: position.coords.accuracy
          };
          
          setLocationLoading(false);
          resolve(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Error getting your location. Please enter it manually.';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission was denied. Please enable it in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get location timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred.';
          }
          
          setError(errorMessage);
          setLocationLoading(false);
          reject(error);
        },
        options
      );
    });
  }, []);

  // Share location and contact info with better error handling and loading state
  const shareLocationInfo = async () => {
    if (!selectedNotification) return;
    
    setSharingLocation(true);
    setLocationShareStatus('loading');
    setError(null);
    
    try {
      // Validate required fields
      if (!locationData.phone) {
        throw new Error('Phone number is required');
      }
      
      // If we have coordinates but no address, try to reverse geocode
      if (locationData.coordinates && !locationData.address) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.coordinates.lat}&lon=${locationData.coordinates.lng}&zoom=18&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            locationData.address = data.display_name || 'Nearby location';
          }
        } catch (e) {
          console.warn('Reverse geocoding failed:', e);
        }
      }
      
      const payload = {
        notification_id: selectedNotification.id,
        location_data: {
          ...locationData,
          shared_at: new Date().toISOString(),
          notification_type: selectedNotification.notification_type,
          order_id: selectedNotification.metadata?.order_id,
          product_id: selectedNotification.metadata?.product_id,
          product_name: selectedNotification.metadata?.product_name,
          quantity: selectedNotification.metadata?.quantity
        }
      };
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/orders/share-farmer-info/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to share location information');
      }
      
      // Update notification to indicate location was shared
      setNotifications(prev => 
        prev.map(n => 
          n.id === selectedNotification.id 
            ? { 
                ...n, 
                is_read: true, // Mark as read when shared
                metadata: { 
                  ...n.metadata, 
                  location_shared: true,
                  shared_at: new Date().toISOString(),
                  location_data: {
                    ...locationData,
                    shared: true
                  }
                } 
              } 
            : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Show success feedback
      setLocationShareStatus('success');
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowLocationModal(false);
        setLocationShareStatus('idle');
        setSelectedNotification(null);
        
        // Reset form but keep phone number for next time
        setLocationData({
          ...locationDataRef.current,
          phone: user?.phone || '',
          address: locationData.address || '' // Keep address if user entered one
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error sharing location info:', error);
      setLocationShareStatus('error');
      setError(error.message || 'Failed to share information. Please try again.');
      
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSharingLocation(false);
    }
  };

  // Handle notification click with support for different notification types
  const handleNotificationClick = useCallback(async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.is_read) {
        await markAsRead(notification.id);
      }
      
      // Handle different notification types
      switch (notification.notification_type) {
        case 'cart_added':
        case 'order_placed':
          setSelectedNotification(notification);
          setShowLocationModal(true);
          setLocationShareStatus('idle');
          setError(null);
          
          // Try to get location but don't block the UI
          getCurrentLocation().catch(() => {
            // If location fails, we'll let the user enter it manually
            console.log('Location access failed, manual entry required');
          });
          break;
          
        case 'order_shipped':
        case 'order_delivered':
        case 'order_cancelled':
          // For order status updates, we might want to navigate to order details
          // or show a modal with more information
          if (onNotificationClick) {
            onNotificationClick(notification);
          }
          break;
          
        default:
          // For other notification types, just mark as read
          if (onNotificationClick) {
            onNotificationClick(notification);
          }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      setError('Failed to process notification. Please try again.');
    }
  }, [onNotificationClick]);

  // Set up WebSocket connection and fetch initial notifications
  useEffect(() => {
    // Initialize WebSocket connection
    const initWebSocket = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Connect to WebSocket server with auth token
      socketRef.current = io(process.env.REACT_APP_WS_URL || 'ws://localhost:8000', {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Handle connection events
      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        // Join farmer's room for private notifications
        socketRef.current.emit('join_farmer_room');
      });

      // Handle new notification event
      socketRef.current.on('new_notification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Play notification sound if not in focus
        if (document.hidden) {
          playNotificationSound();
        }
      });

      // Handle connection errors
      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        setConnectionError(error);
      });

      // Handle disconnection
      socketRef.current.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // Reconnect if server disconnects us
          setTimeout(initWebSocket, 1000);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    };

    // Initialize WebSocket connection
    initWebSocket();
    
    // Fetch initial notifications
    fetchNotifications();
    
    // Set up polling as fallback every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const getNotificationIcon = (type) => {
    const iconClass = 'w-5 h-5 flex-shrink-0';
    
    switch (type) {
      case 'cart_added':
        return <ShoppingCart className={`${iconClass} text-green-500`} />;
      case 'order_placed':
        return <Package className={`${iconClass} text-blue-500`} />;
      case 'order_confirmed':
        return <CheckCircle2 className={`${iconClass} text-green-500`} />;
      case 'order_processing':
        return <Loader2 className={`${iconClass} text-yellow-500 animate-spin`} />;
      case 'order_shipped':
        return <Truck className={`${iconClass} text-purple-500`} />;
      case 'order_delivered':
        return <CheckCircle2 className={`${iconClass} text-green-500`} />;
      case 'order_cancelled':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'payment_received':
        return <Check className={`${iconClass} text-green-500`} />;
      case 'payment_failed':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'location_shared':
        return <MapPin className={`${iconClass} text-blue-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Notifications ${displayUnreadCount > 0 ? `(${displayUnreadCount} unread)` : ''}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Bell className="w-6 h-6" />
          {displayUnreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              aria-live="polite"
              aria-atomic="true"
            >
              {displayUnreadCount > 9 ? '9+' : displayUnreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Notifications panel"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Notifications {displayUnreadCount > 0 && `(${displayUnreadCount})`}
                  </h3>
                  <div className="flex space-x-2">
                    {displayNotifications.some(n => !n.is_read) && (
                      <button
                        onClick={() => {
                          displayNotifications.forEach((n) => {
                            if (!n.is_read) markAsRead(n.id);
                          });
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                        disabled={loading}
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label="Close notifications"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading && displayNotifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Loader2 className="mx-auto h-6 w-6 text-gray-400 animate-spin" />
                    <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
                  </div>
                ) : displayNotifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="mx-auto h-8 w-8 text-gray-400" />
                    <h4 className="mt-2 text-sm font-medium text-gray-900">No notifications</h4>
                    <p className="mt-1 text-sm text-gray-500">We'll notify you when there's activity.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {displayNotifications.map((notification) => {
                      const isUnread = !notification.is_read;
                      const locationShared = notification.metadata?.location_shared;
                      
                      return (
                        <li
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            isUnread ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNotificationClick(notification);
                            }
                          }}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              {getNotificationIcon(notification.notification_type)}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className={`text-sm font-medium ${
                                  isUnread ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                  {formatTime(notification.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {notification.message}
                              </p>
                              
                              {locationShared && (
                                <div className="mt-1.5 flex items-center text-xs text-green-600">
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  <span>Location shared</span>
                                </div>
                              )}
                              
                              {notification.notification_type === 'cart_added' && !locationShared && (
                                <div className="mt-1.5 flex items-center text-xs text-blue-600">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>Tap to share location</span>
                                </div>
                              )}
                            </div>
                            
                            {isUnread && (
                              <span className="ml-2 flex-shrink-0">
                                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  <button
                    onClick={fetchNotifications}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Sharing Modal */}
      <AnimatePresence>
        {showLocationModal && selectedNotification && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Overlay */}
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={() => !sharingLocation && setShowLocationModal(false)}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white rounded-lg shadow-xl transform transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900" id="location-modal-title">
                    Share Your Location
                  </h2>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    disabled={sharingLocation}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    A buyer is interested in your product! Share your location and contact details to facilitate the purchase.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Address *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={locationData.address}
                        onChange={(e) => setLocationData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your farm address"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={sharingLocation}
                        required
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                        disabled={sharingLocation}
                        title="Use my current location"
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        value={locationData.phone}
                        onChange={(e) => setLocationData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={sharingLocation}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Time
                      </label>
                      <input
                        type="text"
                        value={locationData.availableTime}
                        onChange={(e) => setLocationData(prev => ({ ...prev, availableTime: e.target.value }))}
                        placeholder="e.g., 9 AM - 5 PM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={sharingLocation}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={locationData.notes}
                      onChange={(e) => setLocationData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special instructions or notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={sharingLocation}
                    />
                  </div>

                  {locationData.coordinates && (
                    <div className="flex items-center text-sm text-green-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      GPS coordinates captured: {locationData.coordinates.lat.toFixed(4)}, {locationData.coordinates.lng.toFixed(4)}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    disabled={sharingLocation}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={shareLocationInfo}
                    disabled={!locationData.address || !locationData.phone || sharingLocation}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {sharingLocation ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Sharing...
                      </>
                    ) : locationShareStatus === 'success' ? (
                      <>
                        <Check className="-ml-1 mr-2 h-4 w-4" />
                        Shared!
                      </>
                    ) : (
                      'Share Information'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FarmerNotifications;
