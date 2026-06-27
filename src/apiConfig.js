/**
 * apiConfig.js
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for every backend endpoint.
 * Import this file (or the hook below) in any component that
 * talks to the Flask server.
 *
 * Usage:
 *   import { API, apiFetch } from './apiConfig';
 *
 *   // Plain fetch wrapper
 *   const data = await apiFetch(API.AUTH.LOGIN, {
 *     method: 'POST',
 *     body: JSON.stringify({ email, password }),
 *   });
 *
 *   // Or use the named helpers:
 *   import { authApi, paypalApi, plansApi } from './apiConfig';
 *   const result = await authApi.login(email, password);
 */

// ─────────────────────────────────────────────────────────────
// Base URL  –  matches Flask app.run(port=5000)
// ─────────────────────────────────────────────────────────────
export const API_BASE = 'http://127.0.0.1:5000/api';

// ─────────────────────────────────────────────────────────────
// Endpoint map (keeps magic strings in one place)
// ─────────────────────────────────────────────────────────────
export const API = {
  // Auth
  AUTH: {
    LOGIN:           `${API_BASE}/login`,
    SIGNUP:          `${API_BASE}/signup`,
    LOGOUT:          `${API_BASE}/logout`,
    CHECK:           `${API_BASE}/check-auth`,
    GOOGLE_CALLBACK: `${API_BASE}/auth/google/callback`,
  },

  // User
  USER: {
    PROFILE:         `${API_BASE}/user/profile`,
    CATEGORY_SETUP:  `${API_BASE}/user/category-setup`,
    VERIFY_CATEGORY: `${API_BASE}/verify-category-setup`,
  },

  // Subscription plans
  PLANS: {
    LIST:            `${API_BASE}/plans`,
    CREATE_SUB:      `${API_BASE}/create-subscription`,
  },

  // PayPal
  PAYPAL: {
    CONFIG:          `${API_BASE}/paypal/config`,
    CREATE_ORDER:    `${API_BASE}/paypal/create-order`,
    EXECUTE:         `${API_BASE}/paypal/execute-payment`,
    VERIFY:          `${API_BASE}/paypal/verify-payment`,
  },

  // Dashboard
  DASHBOARD: {
    STATS:           `${API_BASE}/dashboard/stats`,
    ACTIVITY:        `${API_BASE}/dashboard/activity`,
  },

  // Team
  TEAM: {
    MEMBERS:         `${API_BASE}/team/members`,
  },

  // Billing
  BILLING: {
    HISTORY:         `${API_BASE}/billing/history`,
  },

  // Files
  FILES: {
    UPLOAD:          `${API_BASE}/files/upload`,
    CONVERT:         `${API_BASE}/files/convert`,
  },

  // Health
  HEALTH:            `${API_BASE}/health`,
};

// ─────────────────────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────────────────────
/**
 * apiFetch(url, options?)
 * Wraps fetch with:
 *   – credentials: 'include'   (sends session cookie)
 *   – Content-Type: application/json  (for POST/PUT)
 *   – Throws an Error for non-2xx HTTP responses (message = parsed JSON error)
 *
 * Returns the parsed JSON body on success.
 */
export async function apiFetch(url, options = {}) {
  const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(
    (options.method || 'GET').toUpperCase()
  );

  const config = {
    credentials: 'include',
    headers: {
      ...(isBodyMethod ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(url, config);

  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      (body && (body.error || body.message)) ||
      `HTTP ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.body   = body;
    throw err;
  }

  return body;
}

// ─────────────────────────────────────────────────────────────
// Named API helpers
// ─────────────────────────────────────────────────────────────

export const authApi = {
  /** POST /api/login */
  login: (email, password) =>
    apiFetch(API.AUTH.LOGIN, {
      method: 'POST',
      body:   JSON.stringify({ email, password }),
    }),

  /** POST /api/signup */
  signup: (firstName, lastName, email, password) =>
    apiFetch(API.AUTH.SIGNUP, {
      method: 'POST',
      body:   JSON.stringify({ firstName, lastName, email, password }),
    }),

  /** POST /api/logout */
  logout: () =>
    apiFetch(API.AUTH.LOGOUT, { method: 'POST' }),

  /** GET /api/check-auth */
  checkAuth: () =>
    apiFetch(API.AUTH.CHECK),

  /** POST /api/auth/google/callback */
  googleCallback: (googleUserInfo) =>
    apiFetch(API.AUTH.GOOGLE_CALLBACK, {
      method: 'POST',
      body:   JSON.stringify(googleUserInfo),
    }),
};

export const userApi = {
  /** GET /api/user/profile */
  getProfile: () =>
    apiFetch(API.USER.PROFILE),

  /** POST /api/user/category-setup */
  saveCategorySetup: (data) =>
    apiFetch(API.USER.CATEGORY_SETUP, {
      method: 'POST',
      body:   JSON.stringify(data),
    }),

  /** GET /api/verify-category-setup */
  verifyCategorySetup: () =>
    apiFetch(API.USER.VERIFY_CATEGORY),
};

export const plansApi = {
  /** GET /api/plans */
  list: () => apiFetch(API.PLANS.LIST),

  /** POST /api/create-subscription */
  subscribe: (plan_id, name, billingCycle) =>
    apiFetch(API.PLANS.CREATE_SUB, {
      method: 'POST',
      body:   JSON.stringify({ plan_id, name, billingCycle }),
    }),
};

export const paypalApi = {
  /** GET /api/paypal/config */
  getConfig: () => apiFetch(API.PAYPAL.CONFIG),

  /** POST /api/paypal/create-order */
  createOrder: ({ amount, currency, description, return_url, cancel_url }) =>
    apiFetch(API.PAYPAL.CREATE_ORDER, {
      method: 'POST',
      body:   JSON.stringify({ amount, currency, description, return_url, cancel_url }),
    }),

  /** POST /api/paypal/execute-payment */
  executePayment: (paymentID, payerID) =>
    apiFetch(API.PAYPAL.EXECUTE, {
      method: 'POST',
      body:   JSON.stringify({ paymentID, payerID }),
    }),

  /** POST /api/paypal/verify-payment */
  verifyPayment: (paymentID) =>
    apiFetch(API.PAYPAL.VERIFY, {
      method: 'POST',
      body:   JSON.stringify({ paymentID }),
    }),
};

export const dashboardApi = {
  getStats:    () => apiFetch(API.DASHBOARD.STATS),
  getActivity: () => apiFetch(API.DASHBOARD.ACTIVITY),
};

export const teamApi = {
  getMembers: () =>
    apiFetch(API.TEAM.MEMBERS),

  addMember: ({ email, firstName, lastName }) =>
    apiFetch(API.TEAM.MEMBERS, {
      method: 'POST',
      body:   JSON.stringify({ email, firstName, lastName }),
    }),
};

export const billingApi = {
  getHistory: () => apiFetch(API.BILLING.HISTORY),
};

export const filesApi = {
  upload:  (formData) =>
    apiFetch(API.FILES.UPLOAD, { method: 'POST', body: formData, headers: {} }),

  convert: (data) =>
    apiFetch(API.FILES.CONVERT, { method: 'POST', body: JSON.stringify(data) }),
};


// ─────────────────────────────────────────────────────────────
// Extended endpoint map (Use_Signup, Use_Payment, PayPalPayments)
// ─────────────────────────────────────────────────────────────
export const API_EXT = {
  // Subscription
  GET_SUB_DETAILS:      `${API_BASE}/get/subscription/details`,
  GET_SUB_SESSION:      `${API_BASE}/get/created-subscription/session`,
  GET_COMPLETED_PAYMENT:`${API_BASE}/get-completed-payment`,
  CREATE_SUB_BASIC:     `${API_BASE}/create-subscription/basic`,

  // Payment methods
  CARD_DETAILS:         `${API_BASE}/card-details`,
  ADD_CARD_PAYMENT:     `${API_BASE}/add/card-payment`,
  ADD_PAYPAL_ADDRESS:   `${API_BASE}/add/pay-pal-address`,
  ADD_BANK_ADDRESS:     `${API_BASE}/add/bank-address`,
  ADD_BANK:             `${API_BASE}/bank`,
  ADD_ADDRESS:          `${API_BASE}/add/address`,
  PAYPAL_SIMPLE:        `${API_BASE}/paypal`,
  PAYPAL_EXECUTE:       `${API_BASE}/paypal/execute-payment`,

  // Payments (paymentService / PayPalPayments)
  PAYMENTS_VERIFY:      `${API_BASE}/payments/verify`,
  PAYMENTS_STATUS:      (id) => `${API_BASE}/payments/status/${id}`,
  PAYMENTS_LIST:        `${API_BASE}/payments/list`,
  PAYMENTS_INTENT:      `${API_BASE}/payments/create-intent`,
  PAYMENTS_INTENT_V2:   `${API_BASE}/payments/create-payment-intent`,
  PAYMENTS_UPDATE:      `${API_BASE}/payments/update-payment-status`,
  PAYMENTS_REFUND:      `${API_BASE}/payments/refund`,
  PAYPAL_ORDER_V2:      `${API_BASE}/create-paypal-order`,
  CANCEL_ORDER:         `${API_BASE}/cancel-order`,
  PAYPAL_DETAILS:       `${API_BASE}/get/paypal_payment_details`,
  PAYPAL_STATUS:        (id) => `${API_BASE}/paypal/payment-status/paymentId=${id}`,

  // Category
  GET_VERIFIED_MEMBER:  `${API_BASE}/get-verified-member`,
  CATEGORY:             `${API_BASE}/category`,

  // Google auth alias
  AUTH_GOOGLE:          `${API_BASE}/auth/google`,
};

// Extended helpers
export const subscriptionApi = {
  getDetails:      () => apiFetch(API_EXT.GET_SUB_DETAILS),
  getSession:      () => apiFetch(API_EXT.GET_SUB_SESSION),
  getCompletedPmt: () => apiFetch(API_EXT.GET_COMPLETED_PAYMENT),
  subscribeBasic:  () => apiFetch(API_EXT.CREATE_SUB_BASIC, { method: 'POST' }),
};

export const paymentMethodsApi = {
  updateCard:      (data) => apiFetch(API_EXT.CARD_DETAILS,       { method: 'PUT',  body: JSON.stringify(data) }),
  addCard:         (data) => apiFetch(API_EXT.ADD_CARD_PAYMENT,   { method: 'POST', body: JSON.stringify(data) }),
  addPayPalAddr:   (data) => apiFetch(API_EXT.ADD_PAYPAL_ADDRESS, { method: 'POST', body: JSON.stringify(data) }),
  addBankAddr:     (data) => apiFetch(API_EXT.ADD_BANK_ADDRESS,   { method: 'POST', body: JSON.stringify(data) }),
  addBank:         (data) => apiFetch(API_EXT.ADD_BANK,           { method: 'POST', body: JSON.stringify(data) }),
  addAddress:      (data) => apiFetch(API_EXT.ADD_ADDRESS,        { method: 'POST', body: JSON.stringify(data) }),
  paypalSimple:    (data) => apiFetch(API_EXT.PAYPAL_SIMPLE,      { method: 'POST', body: JSON.stringify(data) }),
};

export const paymentsApi = {
  verify:        (data)  => apiFetch(API_EXT.PAYMENTS_VERIFY,  { method: 'POST', body: JSON.stringify(data) }),
  status:        (id)    => apiFetch(API_EXT.PAYMENTS_STATUS(id)),
  list:          (uid)   => apiFetch(`${API_EXT.PAYMENTS_LIST}${uid ? `?user_id=${uid}` : ''}`),
  createIntent:  (data)  => apiFetch(API_EXT.PAYMENTS_INTENT_V2, { method: 'POST', body: JSON.stringify(data) }),
  update:        (data)  => apiFetch(API_EXT.PAYMENTS_UPDATE,  { method: 'POST', body: JSON.stringify(data) }),
  refund:        (data)  => apiFetch(API_EXT.PAYMENTS_REFUND,  { method: 'POST', body: JSON.stringify(data) }),
  cancelOrder:   (data)  => apiFetch(API_EXT.CANCEL_ORDER,     { method: 'POST', body: JSON.stringify(data) }),
  createOrder:   (data)  => apiFetch(API_EXT.PAYPAL_ORDER_V2,  { method: 'POST', body: JSON.stringify(data) }),
  paypalDetails: ()      => apiFetch(API_EXT.PAYPAL_DETAILS),
  paypalStatus:  (id)    => apiFetch(API_EXT.PAYPAL_STATUS(id)),
};
