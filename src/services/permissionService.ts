import api from './api';

const permissionService = {
  getAll: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/permissions', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/permissions/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  },
};

export default permissionService; 