import axios from 'axios';
import { API_URL } from '../config';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
    profile: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
    };
  };
  token: string;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuthData(data: AuthResponse) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },
}; 