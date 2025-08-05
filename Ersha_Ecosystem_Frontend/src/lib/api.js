// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API call utility function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };


  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };


  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorText = await response.text();

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Network error' };
      }
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData) => 
    apiCall('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  refreshToken: (refresh) => 
    apiCall('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  getProfile: () => apiCall('/auth/profile/'),
  
  updateProfile: (updates) => 
    apiCall('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  getVerificationStatus: () => apiCall('/auth/verification-status/'),
  
  getFaydaAuthUrl: () => apiCall('/auth/fayda/enhanced/auth-url/'),
};

// Products/Marketplace API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products/?${queryString}`);
  },
  
  getById: (id) => apiCall(`/products/${id}/`),
  
  getByCategory: (category) => apiCall(`/products/?category=${category}`),
  
  create: (product) => 
    apiCall('/products/', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  
  update: (id, updates) => 
    apiCall(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id) => 
    apiCall(`/products/${id}/`, {
      method: 'DELETE',
    }),
};

// Cart API
export const cartAPI = {
  getCart: () => apiCall('/cart/summary/'),
  
  addToCart: (productId, quantity = 1) => 
    apiCall('/cart/add_item/', {
      method: 'POST',
      body: JSON.stringify({ product: productId, quantity }),
    }),
  
  updateCartItem: (itemId, quantity) => 
    apiCall(`/cart/${itemId}/update_quantity/`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    }),
  
  removeFromCart: (itemId) => 
    apiCall(`/cart/${itemId}/`, {
      method: 'DELETE',
    }),
  
  clearCart: () => 
    apiCall('/cart/clear/', {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiCall('/orders/orders/'),
  getById: (id) => apiCall(`/orders/orders/${id}/`),
  create: (data) => apiCall('/orders/orders/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/orders/orders/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/orders/orders/${id}/`, {
    method: 'DELETE',
  }),
  getFarmerOrders: () => apiCall('/orders/orders/farmer-orders/'),
  getRecentActivities: () => apiCall('/orders/debug/recent-activities/'),
  createFromCart: (data) => apiCall('/orders/orders/create-from-cart/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id, data) => apiCall(`/orders/orders/${id}/update-status/`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createWithPayment: (data) => apiCall('/orders/orders/create-with-payment/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  myOrders: () => apiCall('/orders/orders/my-orders/'),
};

// Advisory API
export const advisoryAPI = {
  getAll: () => apiCall('/advisory/'),
  
  getByCategory: (category) => apiCall(`/advisory/?category=${category}`),
  
  getById: (id) => apiCall(`/advisory/${id}/`),
  
  create: (advisoryData) => 
    apiCall('/advisory/', {
      method: 'POST',
      body: JSON.stringify(advisoryData),
    }),
  
  update: (id, updates) => 
    apiCall(`/advisory/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id) => 
    apiCall(`/advisory/${id}/`, {
      method: 'DELETE',
    }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => apiCall('/orders/notifications/'),
  getById: (id) => apiCall(`/orders/notifications/${id}/`),
  markAsRead: (id) => apiCall(`/orders/notifications/${id}/mark_read/`, {
    method: 'PATCH',
  }),
  markAllAsRead: () => apiCall('/orders/notifications/mark_all_read/', {
    method: 'POST',
  }),
  getUnreadCount: () => apiCall('/orders/notifications/unread_count/'),
};

// Weather API
export const weatherAPI = {
  getAll: () => apiCall('/weather/'),
  
  getByLocation: (location) => 
    apiCall(`/weather/?region=${encodeURIComponent(location)}`),
  
  getById: (id) => apiCall(`/weather/${id}/`),
  
  getCurrentConditions: () => apiCall('/weather/current_conditions/'),
  
  getAlerts: () => apiCall('/weather/alerts/'),
  
  getRecommendations: () => apiCall('/weather/recommendations/'),
  
  create: (weatherData) => 
    apiCall('/weather/', {
      method: 'POST',
      body: JSON.stringify(weatherData),
    }),
  
  update: (id, updates) => 
    apiCall(`/weather/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id) => 
    apiCall(`/weather/${id}/`, {
      method: 'DELETE',
    }),
  
  getRegions: () => apiCall('/weather/regions/'),
  
  getWoredas: () => apiCall('/weather/woredas/'),
  
  searchLocation: (location) => 
    apiCall(`/weather/current_conditions/?region=${encodeURIComponent(location)}`),
  
  getForecast: (location) => 
    apiCall(`/weather/?region=${encodeURIComponent(location)}`),
};

// Analytics API
export const analyticsAPI = {
  // Sales Analytics
  getDashboard: () => apiCall('/analytics/sales/dashboard/'),
  
  getSalesOverview: () => apiCall('/analytics/sales/sales_overview/'),
  
  // Credit Score
  getCreditOverview: () => apiCall('/analytics/credit-scores/overview/'),
  
  calculateCreditScore: () => 
    apiCall('/analytics/credit-scores/calculate_score/', {
      method: 'POST',
    }),
  
  // Loan Offers
  getLoanOffers: () => apiCall('/analytics/loan-offers/'),
  
  getFarmerLoanOffers: () => apiCall('/analytics/loan-offers/for_farmer/'),
  
  // Monthly Reports
  getReportsOverview: () => apiCall('/analytics/monthly-reports/overview/'),
  
  generateReport: (reportData) => 
    apiCall('/analytics/monthly-reports/generate_report/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),
  
  downloadReport: (reportId, format = 'pdf') => {
    // For PDF, don't specify format parameter as backend defaults to PDF
    const url = format === 'pdf' 
      ? `/analytics/monthly-reports/${reportId}/download/`
      : `/analytics/monthly-reports/${reportId}/download/?format=${format}`;
    
    return apiCall(url, {
      method: 'GET',
      responseType: 'blob',
    });
  },
  
  // Product Performance
  getProductPerformance: () => apiCall('/analytics/product-performance/'),
  
  // Quick Actions - Sales Targets
  getSalesTargets: () => apiCall('/analytics/sales-targets/'),
  
  createSalesTarget: (targetData) => 
    apiCall('/analytics/sales-targets/', {
      method: 'POST',
      body: JSON.stringify(targetData),
    }),
  
  updateTargetProgress: (targetId) => 
    apiCall(`/analytics/sales-targets/${targetId}/update_progress/`, {
      method: 'POST',
    }),
  
  // Quick Actions - Payment Analysis
  getPaymentAnalyses: () => apiCall('/analytics/payment-analysis/'),
  
  generatePaymentAnalysis: (analysisData) => 
    apiCall('/analytics/payment-analysis/generate_analysis/', {
      method: 'POST',
      body: JSON.stringify(analysisData),
    }),
  
  // Quick Actions - Export Requests
  getExportRequests: () => apiCall('/analytics/export-requests/'),
  
  createExportRequest: (exportData) => 
    apiCall('/analytics/export-requests/', {
      method: 'POST',
      body: JSON.stringify(exportData),
    }),
  
  processExport: (exportId) => 
    apiCall(`/analytics/export-requests/${exportId}/process_export/`, {
      method: 'POST',
    }),
};

// File upload helper
export const uploadFile = async (file, endpoint = '/upload/') => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
  
  return await response.json();
};

// Logistics API
export const logisticsAPI = {
  // Service Providers
  getProviders: () => apiCall('/logistics/providers/'),
  getProviderById: (id) => apiCall(`/logistics/providers/${id}/`),
  getVerifiedProviders: () => apiCall('/logistics/verified-providers/'),
  
  // Logistics Requests
  getRequests: () => apiCall('/logistics/requests/'),
  getRequestById: (id) => apiCall(`/logistics/requests/${id}/`),
  createRequest: (data) => apiCall('/logistics/requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRequest: (id, data) => apiCall(`/logistics/requests/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteRequest: (id) => apiCall(`/logistics/requests/${id}/`, {
    method: 'DELETE',
  }),
  
  // Request Actions
  acceptRequest: (id) => apiCall(`/logistics/requests/${id}/accept_request/`, {
    method: 'POST',
  }),
  rejectRequest: (id, reason) => apiCall(`/logistics/requests/${id}/reject_request/`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  completeRequest: (id) => apiCall(`/logistics/requests/${id}/complete_request/`, {
    method: 'POST',
  }),
  
  // User-specific requests
  getFarmerRequests: () => apiCall('/logistics/requests/farmer-requests/'),
  getProviderRequests: () => apiCall('/logistics/requests/provider-requests/'),
  
  // Logistics Orders
  getOrders: () => apiCall('/logistics/orders/'),
  getOrderById: (id) => apiCall(`/logistics/orders/${id}/`),
  createOrder: (data) => apiCall('/logistics/orders/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateOrder: (id, data) => apiCall(`/logistics/orders/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateOrderStatus: (id, statusData) => apiCall(`/logistics/orders/${id}/update_status/`, {
    method: 'POST',
    body: JSON.stringify(statusData),
  }),
  deleteOrder: (id) => apiCall(`/logistics/orders/${id}/`, {
    method: 'DELETE',
  }),
  
  // Order-specific endpoints
  getStatusCounts: () => apiCall('/logistics/orders/status_counts/'),
  getRecentOrders: () => apiCall('/logistics/orders/recent_orders/'),
  getPendingOrders: () => apiCall('/logistics/orders/pending_orders/'),
  getActiveOrders: () => apiCall('/logistics/orders/active_orders/'),
  
  // Cost Estimates
  getCostEstimate: (data) => apiCall('/logistics/estimates/calculate/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Deliveries
  getDeliveries: () => apiCall('/logistics/deliveries/'),
  getDeliveryById: (id) => apiCall(`/logistics/deliveries/${id}/`),
  updateDeliveryStatus: (id, data) => apiCall(`/logistics/deliveries/${id}/update_status/`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Analytics
  getDashboard: () => apiCall('/logistics/analytics/dashboard/'),
  getPerformanceMetrics: () => apiCall('/logistics/analytics/performance_metrics/'),
  
  // Notifications
  getNotifications: () => apiCall('/logistics/notifications/'),
  getNotificationById: (id) => apiCall(`/logistics/notifications/${id}/`),
  markNotificationAsRead: (id) => apiCall(`/logistics/notifications/${id}/mark_as_read/`, {
    method: 'POST',
  }),
  markAllNotificationsAsRead: () => apiCall('/logistics/notifications/mark_all_as_read/', {
    method: 'POST',
  }),
  getUnreadCount: () => apiCall('/logistics/notifications/unread_count/'),
}; 