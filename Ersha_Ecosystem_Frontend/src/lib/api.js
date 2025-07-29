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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
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

// Weather API (placeholder for future integration)
export const weatherAPI = {
  getByLocation: (location) => 
    apiCall(`/weather/?location=${encodeURIComponent(location)}`),
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