import { LoginCredentials, RegisterCredentials, User } from '../types/index';
import { request } from './api';

const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await request<{ message: string, token: string, user: any }>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Store token and user in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },
  
  register: async (credentials: RegisterCredentials) => {
    const response = await request<{ message: string }>({
      method: 'POST',
      url: '/auth/register',
      data: credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  forgotPassword: async (email: string) => {
    return request<{ message: string }>({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  resetPassword: async (token: string, password: string) => {
    return request<{ message: string }>({
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, password },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
};

export default authService;
