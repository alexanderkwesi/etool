// services/paymentService.js
import axios from "axios";

import { API_BASE } from "./apiConfig";


// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // Increased timeout for payment processing
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers["X-Request-ID"] = `payment_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response received:", response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "Server error occurred";

      switch (status) {
        case 400:
          throw new Error(`Bad Request: ${message}`);
        case 401:
          throw new Error("Authentication failed. Please login again.");
        case 403:
          throw new Error(
            "Access denied. You do not have permission for this action."
          );
        case 404:
          throw new Error("The requested resource was not found.");
        case 409:
          throw new Error(
            "Payment conflict: This transaction may have already been processed."
          );
        case 422:
          throw new Error(`Validation error: ${message}`);
        case 429:
          throw new Error("Too many requests. Please try again later.");
        case 500:
          throw new Error("Server error. Please try again later.");
        case 502:
          throw new Error("Network error. Please check your connection.");
        case 503:
          throw new Error(
            "Service temporarily unavailable. Please try again later."
          );
        default:
          throw new Error(`HTTP Error ${status}: ${message}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

// Payment service methods
export const paymentService = {
  /**
   * Verify payment with backend
   * @param {Object} paymentData - Payment verification data
   * @param {string} paymentData.orderID - PayPal order ID
   * @param {string} paymentData.payerID - PayPal payer ID
   * @param {string} paymentData.amount - Payment amount
   * @param {string} paymentData.custom_id - Custom order ID
   * @returns {Promise<Object>} Verification result
   */
  verifyPayment: async (paymentData) => {
    try {
      console.log("Verifying payment:", {
        orderID: paymentData.orderID,
        amount: paymentData.amount,
      });

      const response = await apiClient.post(`${API_BASE}/payments/verify`, paymentData);

      console.log("Payment verification successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Payment verification failed:", error);
      throw error;
    }
  },

  /**
   * Get payment status by order ID
   * @param {string} orderID - PayPal order ID
   * @returns {Promise<Object>} Payment status data
   */
  getPaymentStatus: async (orderID) => {
    try {
      if (!orderID) {
        throw new Error("Order ID is required");
      }

      console.log("Getting payment status for order:", orderID);

      const response = await apiClient.get(
        `${API_BASE}/payments/status/${orderID}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get payment status:", error);
      throw error;
    }
  },

  /**
   * Get payment history with pagination
   * @param {number} limit - Number of records per page
   * @param {number} page - Page number
   * @returns {Promise<Object>} Payment history data
   */
  getPaymentHistory: async (limit = 10, page = 1) => {
    try {
      console.log("Fetching payment history:", { limit, page });

      const response = await apiClient.get(`${API_BASE}/payments/list`, {
        params: {
          limit: parseInt(limit),
          page: parseInt(page),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get payment history:", error);
      throw error;
    }
  },

  /**
   * Create a payment intent (if using PayPal advanced features)
   * @param {Object} paymentIntentData - Payment intent data
   * @returns {Promise<Object>} Payment intent result
   */
  createPaymentIntent: async (paymentIntentData) => {
    try {
      console.log("Creating payment intent:", paymentIntentData);

      const response = await apiClient.post(
        `${API_BASE}/payments/create-intent`,
        paymentIntentData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      throw error;
    }
  },

  /**
   * Refund a payment
   * @param {string} orderID - PayPal order ID to refund
   * @param {string} amount - Amount to refund (optional, full amount if not specified)
   * @param {string} reason - Reason for refund
   * @returns {Promise<Object>} Refund result
   */
  refundPayment: async (orderID, amount = null, reason = "") => {
    try {
      if (!orderID) {
        throw new Error("Order ID is required for refund");
      }

      console.log("Processing refund for order:", orderID);

      const refundData = { orderID, reason };
      if (amount) {
        refundData.amount = amount;
      }

      const response = await apiClient.post(`${API_BASE}/payments/refund`, refundData);
      return response.data;
    } catch (error) {
      console.error("Refund failed:", error);
      throw error;
    }
  },

  /**
   * Check API health status
   * @returns {Promise<Object>} API health status
   */
  checkHealth: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/health`);
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },
};

// Utility functions for payment processing
export const paymentUtils = {
  /**
   * Format amount for display
   * @param {string} amount - Amount as string
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount
   */
  formatAmount: (amount, currency = "GBP") => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return amount;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  },

  /**
   * Validate payment amount
   * @param {string} amount - Amount to validate
   * @returns {boolean} True if valid
   */
  validateAmount: (amount) => {
    const numericAmount = parseFloat(amount);
    return (
      !isNaN(numericAmount) && numericAmount > 0 && numericAmount <= 1000000
    ); // Max $1,000,000
  },

  /**
   * Generate a unique order ID for tracking
   * @param {string} prefix - Prefix for the order ID
   * @returns {string} Unique order ID
   */
  generateOrderId: (prefix = "order") => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  },

  /**
   * Extract error message from various error formats
   * @param {*} error - Error object, string, or response
   * @returns {string} User-friendly error message
   */
  getErrorMessage: (error) => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.response?.data?.message) return error.response.data.message;
    return "An unexpected error occurred. Please try again.";
  },
};

// Default export
export default paymentService;
