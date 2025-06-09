import api from './api';

const roleService = {
  getAll: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/roles', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  assignPermissions: async (roleId: number, permissionIds: number[]) => {
    const response = await api.post(`/roles/${roleId}/permissions`, {
      permissionIds,
    });
    return response.data;
  },
};

export default roleService; 