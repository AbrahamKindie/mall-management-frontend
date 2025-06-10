import api from './api';
import { AdminUser } from '../types/adminUser';

export const adminUserService = {
  getAll: async (): Promise<AdminUser[]> => {
    const res = await api.get('/admin-user');
    return res.data;
  },
  create: async (data: Partial<AdminUser>): Promise<AdminUser> => {
    const res = await api.post('/admin-user', data);
    return res.data;
  },
  update: async (id: number, data: Partial<AdminUser>): Promise<AdminUser> => {
    const res = await api.put(`/admin-user/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin-user/${id}`);
  },
  getById: async (id: number): Promise<AdminUser> => {
    const res = await api.get(`/admin-user/${id}`);
    return res.data;
  },
}; 