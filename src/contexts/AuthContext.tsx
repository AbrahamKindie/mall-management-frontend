import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService, type AuthResponse, type LoginData, type RegisterData } from '../services/auth.service';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      authService.setAuthData(response);
      setUser(response.user);
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      authService.setAuthData(response);
      setUser(response.user);
      message.success('Registration successful');
      navigate('/');
    } catch (error) {
      message.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 