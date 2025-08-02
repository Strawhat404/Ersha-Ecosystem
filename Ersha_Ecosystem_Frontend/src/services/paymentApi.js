// Payment API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class PaymentApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage or context
  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Common headers for API requests
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Dashboard Overview
  async getDashboardOverview(userId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/dashboard/overview/?user_id=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  // Request Payout
  async requestPayout(payoutData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/dashboard/request_payout/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payoutData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error requesting payout:', error);
      throw error;
    }
  }

  // Generate Invoice
  async generateInvoice(invoiceData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/dashboard/generate_invoice/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(invoiceData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  // Get Reports
  async getReports(userId, reportType = 'summary', startDate = null, endDate = null) {
    try {
      let url = `${this.baseURL}/payments/dashboard/reports/?user_id=${userId}&type=${reportType}`;
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  // Payment Methods
  async getPaymentMethods(userId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/payment-methods/by_user/?user_id=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async createPaymentMethod(paymentMethodData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/payment-methods/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentMethodData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  async verifyPaymentMethod(methodId, verificationCode) {
    try {
      const response = await fetch(`${this.baseURL}/payments/payment-methods/${methodId}/verify/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ verification_code: verificationCode })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error verifying payment method:', error);
      throw error;
    }
  }

  // Transactions
  async getTransactions(userId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/transactions/by_user/?user_id=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Payout Requests
  async getPayoutRequests(userId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/payout-requests/by_user/?user_id=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      throw error;
    }
  }

  async processPayout(payoutId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/payout-requests/${payoutId}/process_payout/`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error processing payout:', error);
      throw error;
    }
  }

  // Invoices
  async getInvoices(userId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/invoices/by_user/?user_id=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/invoices/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(invoiceData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async sendInvoice(invoiceId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/invoices/${invoiceId}/send_invoice/`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics(userId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/analytics/dashboard/?user_id=${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Supported Banks
  async getSupportedBanks() {
    try {
      const response = await fetch(`${this.baseURL}/payments/payout-requests/supported_banks/`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching supported banks:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const paymentApi = new PaymentApiService();
export default paymentApi; 