import apiClient from './client.js';

export const authAPI = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  logout: () => apiClient.post('/api/auth/logout'),
  sendVerificationCode: () => apiClient.post('/api/auth/send-verification-code'),
  verifyCode: (code) => apiClient.post('/api/auth/verify-code', { code }),
};

export const userAPI = {
  getProfile: () => apiClient.get('/api/user/profile'),
  updateProfile: (data) => apiClient.put('/api/user/profile', data),
  getOrders: () => apiClient.get('/api/order/user'),
  trackOrder: (code) => apiClient.get(`/api/order/track/${code}`),
  createOrder: (data) => apiClient.post('/api/order', data),
  getRentals: () => apiClient.get('/api/rental/user'),
};

export const iphoneAPI = {
  getAll: () => apiClient.get('/api/iphone'),
  getById: (id) => apiClient.get(`/api/iphone/${id}`),
};

export const testimonialAPI = {
  getAll: () => apiClient.get('/api/testimonial'),
};

export const adminAPI = {
  users: {
    getAll: (status) => apiClient.get('/api/admin/user', { params: { status } }),
    update: (id, data) => apiClient.put(`/api/admin/user/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/user/${id}`),
    softDelete: (id) => apiClient.put(`/api/admin/user/${id}/soft-delete`),
  },
  iphones: {
    getAll: (status = 'active') => apiClient.get('/api/admin/iphone/all', { params: { status } }),
    getAllWithFilter: (status) => apiClient.get('/api/admin/iphone/all', { params: { status } }),
    create: (data) => apiClient.post('/api/admin/iphone', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, data) => apiClient.put(`/api/admin/iphone/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/iphone/${id}`),
    addStock: (id, stock) => apiClient.put(`/api/admin/iphone/${id}/stock`, { stock }),
  },
  orders: {
    getAll: (sort, status) => apiClient.get('/api/admin/order', { params: { sort, status } }),
    updateStatus: (id, status) => apiClient.put(`/api/admin/order/${id}/status`, { status }),
  },
  rentals: {
    getAll: () => apiClient.get('/api/admin/rental'),
    getOverdue: () => apiClient.get('/api/admin/rental/overdue'),
    getById: (id) => apiClient.get(`/api/admin/rental/${id}`),
    return: (id, returnDate) => apiClient.put(`/api/admin/rental/${id}/return`, { return_date: returnDate }),
  },
  testimonials: {
    delete: (id) => apiClient.delete(`/api/admin/testimonial/${id}`),
  },
};
