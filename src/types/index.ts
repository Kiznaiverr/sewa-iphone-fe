// API Response Types
export interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

// Authentication Types
export interface RegisterRequest {
  name: string;
  username: string;
  email?: string;
  password: string;
  phone: string;
  nik: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends SuccessResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface VerifyCodeRequest {
  code: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ResetPasswordRequest {
  username: string;
  code: string;
  password: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  phone: string;
  nik: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  penalty: number;
  profile?: string;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  nik?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
}

// iPhone Types
export interface IPhone {
  id: number;
  name: string;
  price_per_day: number;
  specs: string;
  images: string[];
  stock: number;
  status: 'active' | 'inactive';
}

export interface CreateIPhoneRequest {
  name: string;
  price_per_day: number;
  specs: string;
  stock: number;
  images?: File;
}

export interface UpdateIPhoneRequest {
  name?: string;
  price_per_day?: number;
  specs?: string;
  stock?: number;
  status?: 'active' | 'inactive';
}

export interface AddStockRequest {
  stock: number;
}

// Order Types
export interface OrderRequest {
  iphone_id: number;
  start_date: string;
  end_date: string;
}

export interface Order {
  id: number;
  user_id: number;
  iphone_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pre_ordered' | 'approved' | 'completed' | 'rejected';
  order_code: string;
}

export interface UpdateOrderStatusRequest {
  status: 'approved' | 'completed' | 'rejected';
}

// Rental Types
export interface Rental {
  id: number;
  user_id: number;
  iphone_id: number;
  start_date: string;
  end_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
  penalty: number;
}

export interface ReturnRentalRequest {
  return_date: string;
}

// Testimonial Types
export interface CreateTestimonialRequest {
  rating: number;
  message: string;
}

export interface Testimonial {
  id: number;
  user_id: number;
  content: string;
  rating: number;
  created_at: string;
}

// Router Types
export interface RouteHandler {
  (): void;
}

export interface Route {
  path: string;
  handler: RouteHandler;
}

// Component Types
export interface ModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

// Utility Types
export type Role = 'user' | 'admin';
export type Status = 'active' | 'inactive';
export type OrderStatus = 'pre_ordered' | 'approved' | 'completed' | 'rejected';
export type RentalStatus = 'active' | 'returned' | 'overdue';