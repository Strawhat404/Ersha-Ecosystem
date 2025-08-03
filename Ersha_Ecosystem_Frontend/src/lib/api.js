// Django Backend API Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('API Call:', `${API_BASE_URL}${endpoint}`);
  console.log('Token exists:', !!token);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle blob responses differently
    if (options.responseType === 'blob') {
      const blob = await response.blob();
      return blob;
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
  getCart: () => apiCall('/cart/'),
  
  addToCart: (productId, quantity = 1) => 
    apiCall('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    }),
  
  updateCartItem: (itemId, quantity) => 
    apiCall(`/cart/${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  
  removeFromCart: (itemId) => 
    apiCall(`/cart/${itemId}/`, {
      method: 'DELETE',
    }),
  
  clearCart: () => 
    apiCall('/cart/clear/', {
      method: 'POST',
    }),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiCall('/orders/'),
  
  getById: (id) => apiCall(`/orders/${id}/`),
  
  create: (orderData) => 
    apiCall('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  updateStatus: (id, status) => 
    apiCall(`/orders/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  getMyOrders: () => apiCall('/orders/my-orders/'),
  
  getMySales: () => apiCall('/orders/my-sales/'),
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
  getAll: () => apiCall('/notifications/'),
  
  markAsRead: (id) => 
    apiCall(`/notifications/${id}/mark-read/`, {
      method: 'POST',
    }),
  
  markAllAsRead: () => 
    apiCall('/notifications/mark-all-read/', {
      method: 'POST',
    }),
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
  getProviders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/logistics/providers/?${queryString}`);
  },
  getVerifiedProviders: () => apiCall('/logistics/providers/verified_providers/'),
  getProvidersByRegion: (region) => apiCall(`/logistics/providers/by_region/?region=${region}`),
  getTopPerformers: () => apiCall('/logistics/providers/top_performers/'),
  
  // Deliveries
  getDeliveries: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/logistics/deliveries/?${queryString}`);
  },
  getActiveDeliveries: () => apiCall('/logistics/deliveries/active_deliveries/'),
  getOverdueDeliveries: () => apiCall('/logistics/deliveries/overdue_deliveries/'),
  getDeliveryByTracking: (trackingNumber) => apiCall(`/logistics/deliveries/by_tracking_number/?tracking_number=${trackingNumber}`),
  updateDeliveryStatus: (deliveryId, data) => apiCall(`/logistics/deliveries/${deliveryId}/update_status/`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  addTrackingEvent: (deliveryId, data) => apiCall(`/logistics/deliveries/${deliveryId}/add_tracking_event/`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Cost Estimates
  getEstimates: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/logistics/estimates/?${queryString}`);
  },
  calculateEstimate: (data) => apiCall('/logistics/estimates/calculate/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Analytics
  getAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/logistics/analytics/?${queryString}`);
  },
  getDashboard: () => apiCall('/logistics/analytics/dashboard/'),
  getPerformanceMetrics: () => apiCall('/logistics/analytics/performance_metrics/'),
  
  // Transactions
  getTransactions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/logistics/transactions/?${queryString}`);
  },
  getTransactionsByDelivery: (deliveryId) => apiCall(`/logistics/transactions/by_delivery/?delivery_id=${deliveryId}`),
}; 