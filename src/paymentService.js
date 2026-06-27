// services/paymentService.js
import axios from "axios";

import { API_BASE } from "./apiConfig";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "Server error occurred";

      switch (status) {
        case 400: throw new Error(`Bad Request: ${message}`);
        case 401: throw new Error("Authentication failed. Please login again.");
        case 403: throw new Error("Access denied. You do not have permission for this action.");
        case 404: throw new Error("The requested resource was not found.");
        case 409: throw new Error("Payment conflict: This transaction may have already been processed.");
        case 422: throw new Error(`Validation error: ${message}`);
        case 429: throw new Error("Too many requests. Please try again later.");
        case 500: throw new Error("Server error. Please try again later.");
        case 502: throw new Error("Network error. Please check your connection.");
        case 503: throw new Error("Service temporarily unavailable. Please try again later.");
        default:  throw new Error(`HTTP Error ${status}: ${message}`);
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your internet connection and try again.");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

// Payment service methods — const only, exported via default below
const paymentService = {
  verifyPayment: async (paymentData) => {
    try {
      console.log("Verifying payment:", { orderID: paymentData.orderID, amount: paymentData.amount });
      const response = await apiClient.post(`${API_BASE}/payments/verify`, paymentData);
      console.log("Payment verification successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Payment verification failed:", error);
      throw error;
    }
  },

  getPaymentStatus: async (orderID) => {
    try {
      if (!orderID) throw new Error("Order ID is required");
      console.log("Getting payment status for order:", orderID);
      const response = await apiClient.get(`${API_BASE}/payments/status/${orderID}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get payment status:", error);
      throw error;
    }
  },

  getPaymentHistory: async (limit = 10, page = 1) => {
    try {
      console.log("Fetching payment history:", { limit, page });
      const response = await apiClient.get(`${API_BASE}/payments/list`, {
        params: { limit: parseInt(limit), page: parseInt(page) },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get payment history:", error);
      throw error;
    }
  },

  createPaymentIntent: async (paymentIntentData) => {
    try {
      console.log("Creating payment intent:", paymentIntentData);
      const response = await apiClient.post(`${API_BASE}/payments/create-intent`, paymentIntentData);
      return response.data;
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      throw error;
    }
  },

  refundPayment: async (orderID, amount = null, reason = "") => {
    try {
      if (!orderID) throw new Error("Order ID is required for refund");
      console.log("Processing refund for order:", orderID);
      const refundData = { orderID, reason };
      if (amount) refundData.amount = amount;
      const response = await apiClient.post(`${API_BASE}/payments/refund`, refundData);
      return response.data;
    } catch (error) {
      console.error("Refund failed:", error);
      throw error;
    }
  },

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

export const paymentUtils = {
  formatAmount: (amount, currency = "GBP") => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  },

  validateAmount: (amount) => {
    const numericAmount = parseFloat(amount);
    return !isNaN(numericAmount) && numericAmount > 0 && numericAmount <= 1000000;
  },

  generateOrderId: (prefix = "order") => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  },

  getErrorMessage: (error) => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.response?.data?.message) return error.response.data.message;
    return "An unexpected error occurred. Please try again.";
  },
};

export default paymentService;
