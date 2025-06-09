import api from './api';
import type { Unit, CreateUnitData, UpdateUnitData, AssignTenantData, UnitStatus } from '../types/unit';

export type { UnitStatus };

export const unitService = {
  create: async (data: CreateUnitData): Promise<Unit> => {
    const response = await api.post('/units', data);
    return response.data;
  },

  findAll: async (): Promise<Unit[]> => {
    const response = await api.get('/units');
    return response.data;
  },

  findOne: async (id: number): Promise<Unit> => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  update: async (id: number, data: UpdateUnitData): Promise<Unit> => {
    const response = await api.patch(`/units/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/units/${id}`);
  },

  assignTenant: async (id: number, data: AssignTenantData): Promise<Unit> => {
    const response = await api.post(`/units/${id}/assign-tenant`, data);
    return response.data;
  },

  removeTenant: async (id: number): Promise<Unit> => {
    const response = await api.post(`/units/${id}/remove-tenant`);
    return response.data;
  }
}; 