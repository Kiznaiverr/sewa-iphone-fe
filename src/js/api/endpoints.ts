import apiClient from './client.js';
import { RegisterRequest, LoginRequest, VerifyCodeRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../../types';

export const authAPI = {
  register: (data: RegisterRequest) => apiClient.post('/api/auth/register', data),
  login: (credentials: LoginRequest) => apiClient.post('/api/auth/login', credentials),
  logout: () => apiClient.post('/api/auth/logout'),
  sendVerificationCode: () => apiClient.post('/api/auth/send-verification-code'),
  verifyCode: (code: VerifyCodeRequest) => apiClient.post('/api/auth/verify-code', code),
  forgotPassword: (data: ForgotPasswordRequest) => apiClient.post('/api/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordRequest) => apiClient.post('/api/auth/reset-password', data),
};

export const userAPI = {
  getProfile: () => apiClient.get('/api/user/profile'),
  updateProfile: (data: any) => apiClient.put('/api/user/profile', data),
  uploadProfilePhoto: (file: File) => {
    const formData = new FormData();
    formData.append('profile_photo', file);
    return apiClient.post('/api/user/upload-profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getOrders: () => apiClient.get('/api/order/user'),
  trackOrder: (code: string) => apiClient.get(`/api/order/track/${code}`),
  createOrder: (data: any) => apiClient.post('/api/order', data),
  getRentals: () => apiClient.get('/api/rental/user'),
};

export const iphoneAPI = {
  getAll: () => apiClient.get('/api/iphone'),
  getById: (id: number) => apiClient.get(`/api/iphone/${id}`),
};

export const testimonialAPI = {
  getAll: () => apiClient.get('/api/testimonial'),
  create: (data: any) => apiClient.post('/api/testimonial', data),
};

export const adminAPI = {
  users: {
    getAll: (status?: string) => apiClient.get('/api/admin/user', { params: { status } }),
    update: (id: number, data: any) => apiClient.put(`/api/admin/user/${id}`, data),
    delete: (id: number) => apiClient.delete(`/api/admin/user/${id}`),
    softDelete: (id: number) => apiClient.put(`/api/admin/user/${id}/soft-delete`),
  },
  iphones: {
    getAll: (status: string = 'active') => apiClient.get('/api/admin/iphone/all', { params: { status } }),
    getAllWithFilter: (status?: string) => apiClient.get('/api/admin/iphone/all', { params: { status } }),
    create: (data: any) => apiClient.post('/api/admin/iphone', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: number, data: any) => apiClient.put(`/api/admin/iphone/${id}`, data),
    delete: (id: number) => apiClient.delete(`/api/admin/iphone/${id}`),
    addStock: (id: number, stock: number) => apiClient.put(`/api/admin/iphone/${id}/stock`, { stock }),
  },
  orders: {
    getAll: (sort?: string, status?: string) => apiClient.get('/api/admin/order', { params: { sort, status } }),
    updateStatus: (id: number, status: string) => apiClient.put(`/api/admin/order/${id}/status`, { status }),
  },
  rentals: {
    getAll: () => apiClient.get('/api/admin/rental'),
    getOverdue: () => apiClient.get('/api/admin/rental/overdue'),
    getById: (id: number) => apiClient.get(`/api/admin/rental/${id}`),
    return: (id: number, returnDate: string) => apiClient.put(`/api/admin/rental/${id}/return`, { return_date: returnDate }),
  },
  testimonials: {
    delete: (id: number) => apiClient.delete(`/api/admin/testimonial/${id}`),
  },
};

export const githubAPI = {
  getLatestRelease: async () => {
    try {
      const response = await fetch('https://api.github.com/repos/Kiznaiverr/iRent/releases/latest');
      if (!response.ok) throw new Error('Failed to fetch latest release');
      return response.json();
    } catch (error) {
      console.error('Error fetching GitHub release:', error);
      throw error;
    }
  },
};
