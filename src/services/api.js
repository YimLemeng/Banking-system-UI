import axios from 'axios';

// Connect to Cloud VPS backend or fallback to local proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to inject JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trustbank_token');
    if (token && token.split('.').length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && token.startsWith('mock_')) {
      localStorage.removeItem('trustbank_token');
      localStorage.removeItem('trustbank_user');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired or invalid tokens
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session may be expired');
    }
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  login: async (identifier, password) => {
    return apiClient.post('/auth/login', { identifier, password });
  },
  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  changePassword: async (passwords) => {
    return apiClient.post('/auth/change-password', passwords);
  },
};

export const customerService = {
  getAll: async (search = '', page = 0, size = 10) => {
    const params = { page, size };
    if (search) params.search = search;
    return apiClient.get('/customers', { params });
  },
  getById: async (id) => {
    return apiClient.get(`/customers/${id}`);
  },
  create: async (customerData) => {
    return apiClient.post('/customers', customerData);
  },
  update: async (id, customerData) => {
    return apiClient.put(`/customers/${id}`, customerData);
  },
  delete: async (id) => {
    return apiClient.delete(`/customers/${id}`);
  },
};

export const accountService = {
  getAll: async (page = 0, size = 10) => {
    return apiClient.get('/accounts', { params: { page, size } });
  },
  getById: async (id) => {
    return apiClient.get(`/accounts/${id}`);
  },
  getByNumber: async (accountNumber) => {
    return apiClient.get(`/accounts/number/${accountNumber}`);
  },
  getByCustomerId: async (customerId, page = 0, size = 10) => {
    return apiClient.get(`/accounts/customer/${customerId}`, { params: { page, size } });
  },
  create: async (accountData) => {
    return apiClient.post('/accounts', accountData);
  },
  deposit: async (accountNumber, depositData) => {
    return apiClient.post(`/accounts/${accountNumber}/deposit`, depositData);
  },
  withdraw: async (accountNumber, withdrawData) => {
    return apiClient.post(`/accounts/${accountNumber}/withdraw`, withdrawData);
  },
  transfer: async (transferData) => {
    return apiClient.post('/accounts/transfer', transferData);
  },
};

export const transactionService = {
  getById: async (transactionId) => {
    return apiClient.get(`/transactions/${transactionId}`);
  },
  getByAccountId: async (accountId, page = 0, size = 10) => {
    return apiClient.get(`/transactions/account/${accountId}`, { params: { page, size } });
  },
  search: async (params) => {
    return apiClient.get('/transactions/search', { params });
  },
};

export const auditService = {
  getAll: async (page = 0, size = 10) => {
    return apiClient.get('/audit-logs', { params: { page, size } });
  },
  search: async (params) => {
    return apiClient.get('/audit-logs/search', { params });
  },
};

export const userService = {
  getAll: async () => {
    return apiClient.get('/users');
  },
  getById: async (id) => {
    return apiClient.get(`/users/${id}`);
  },
};
