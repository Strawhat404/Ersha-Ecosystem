// API service for Ersha Ecosystem Admin Dashboard

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth API
export const authAPI = {
  // Admin login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Login API Error:', error);
      console.error('Non-field errors:', error.non_field_errors);
      console.error('Response status:', response.status);
      console.error('Response statusText:', response.statusText);
      const errorMessage = error.non_field_errors?.[0] || error.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    localStorage.setItem('admin_token', data.access);
    localStorage.setItem('admin_refresh_token', data.refresh);
    return data;
  },

  // Logout
  logout: async () => {
    const refresh = localStorage.getItem('admin_refresh_token');
    if (refresh) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get comprehensive dashboard stats
  getComprehensiveStats: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/comprehensive-dashboard/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return await response.json();
  },

  // Get user stats
  getUserStats: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/users/user_stats/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    
    return await response.json();
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/auth/admin/users/?${queryString}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return await response.json();
  },

  // Verify user
  verifyUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/verify_user/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify user');
    }
    
    return await response.json();
  },

  // Flag user
  flagUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/flag_user/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to flag user');
    }
    
    return await response.json();
  },

  // Ban user
  banUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/ban_user/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to ban user');
    }
    
    return await response.json();
  },
};

// News API
export const newsAPI = {
  // Get all news articles
  getNews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/news/news/?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    return await response.json();
  },

  // Create news article
  createNews: async (articleData) => {
    console.log('API: Starting createNews call...'); // Debug log
    console.log('API: URL:', `${API_BASE_URL}/news/news/`); // Debug log
    console.log('API: Data:', articleData); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/news/news/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });
    
    console.log('API: Response status:', response.status); // Debug log
    console.log('API: Response ok:', response.ok); // Debug log
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: Error response:', errorData); // Debug log
      throw new Error('Failed to create news article: ' + JSON.stringify(errorData));
    }
    
    const result = await response.json();
    console.log('API: Success response:', result); // Debug log
    return result;
  },

  // Update news article
  updateNews: async (articleId, articleData) => {
    const response = await fetch(`${API_BASE_URL}/news/news/${articleId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update news article');
    }
    
    return await response.json();
  },

  // Delete news article
  deleteNews: async (articleId) => {
    const response = await fetch(`${API_BASE_URL}/news/news/${articleId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete news article');
    }
  },

  // Approve news article
  approveNews: async (articleId) => {
    const response = await fetch(`${API_BASE_URL}/news/news/${articleId}/approve/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve news article');
    }
    
    return await response.json();
  },

  // Feature news article
  featureNews: async (articleId) => {
    const response = await fetch(`${API_BASE_URL}/news/news/${articleId}/feature/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to feature news article');
    }
    
    return await response.json();
  },

  // Get news stats
  getNewsStats: async () => {
    const response = await fetch(`${API_BASE_URL}/news/news/admin_stats/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news stats');
    }
    
    return await response.json();
  },
};

// Logistics API
export const logisticsAPI = {
  // Get all service providers
  getProviders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/logistics/providers/?${queryString}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch providers');
    }
    
    return await response.json();
  },

  // Verify provider
  verifyProvider: async (providerId) => {
    const response = await fetch(`${API_BASE_URL}/logistics/providers/${providerId}/verify_provider/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify provider');
    }
    
    return await response.json();
  },

  // Deactivate provider
  deactivateProvider: async (providerId) => {
    const response = await fetch(`${API_BASE_URL}/logistics/providers/${providerId}/deactivate_provider/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to deactivate provider');
    }
    
    return await response.json();
  },

  // Get logistics stats
  getLogisticsStats: async () => {
    const response = await fetch(`${API_BASE_URL}/logistics/providers/admin_stats/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch logistics stats');
    }
    
    return await response.json();
  },
};

// Experts API
export const expertsAPI = {
  // Get all experts
  getExperts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/advisory/experts/?${queryString}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch experts');
    }
    
    return await response.json();
  },

  // Verify expert
  verifyExpert: async (expertId) => {
    const response = await fetch(`${API_BASE_URL}/advisory/experts/${expertId}/verify_expert/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify expert');
    }
    
    return await response.json();
  },

  // Feature expert
  featureExpert: async (expertId) => {
    const response = await fetch(`${API_BASE_URL}/advisory/experts/${expertId}/feature_expert/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to feature expert');
    }
    
    return await response.json();
  },

  // Get expert stats
  getExpertStats: async () => {
    const response = await fetch(`${API_BASE_URL}/advisory/experts/admin_stats/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch expert stats');
    }
    
    return await response.json();
  },
};

// Merchants API (Marketplace)
export const merchantsAPI = {
  // Get all products (for merchant management)
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products/products/?${queryString}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  },

  // Approve product
  approveProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/products/${productId}/approve_product/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve product');
    }
    
    return await response.json();
  },

  // Deactivate product
  deactivateProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/products/${productId}/deactivate_product/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to deactivate product');
    }
    
    return await response.json();
  },

  // Get marketplace stats
  getMarketplaceStats: async () => {
    const response = await fetch(`${API_BASE_URL}/products/products/admin_stats/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch marketplace stats');
    }
    
    return await response.json();
  },
}; 