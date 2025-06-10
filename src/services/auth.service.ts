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
  };
  token: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      if (expirationTime < currentTime) {
        this.logout();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error validating token:', error);
      this.logout();
      return null;
    }
  },

  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  setAuthData(data: AuthResponse) {
    if (!data.token || !data.user) {
      throw new Error('Invalid auth data');
    }
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      console.error('Error setting auth data:', error);
      throw error;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  validateToken(): boolean {
    const token = this.getToken();
    return !!token;
  }
}; 