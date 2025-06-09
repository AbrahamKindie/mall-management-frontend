import api from './api';
import type { Tenant, CreateTenantData, UpdateTenantData } from '../types/tenant';

const tenantService = {
  create: async (data: CreateTenantData): Promise<Tenant> => {
    const response = await api.post('/tenants', data);
    return response.data;
  },

  getAll: async (): Promise<Tenant[]> => {
    const response = await api.get('/tenants');
    return response.data;
  },

  findOne: async (id: number): Promise<Tenant> => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },

  update: async (id: number, data: UpdateTenantData): Promise<Tenant> => {
    const response = await api.patch(`/tenants/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },

  getTenantUnits: async (id: number): Promise<Tenant['units']> => {
    const response = await api.get(`/tenants/${id}/units`);
    return response.data;
  },

  getTenantByEmail: async (email: string): Promise<Tenant> => {
    const response = await api.get(`/tenants/email/${email}`);
    return response.data;
  },
};

export default tenantService; 