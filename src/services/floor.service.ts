import api from './api';
import type { Unit } from '../types/unit';

export interface Floor {
  id: number;
  number: number;
  mallId: number;
  mall: {
    id: number;
    name: string;
    address: string;
  };
  units: Unit[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFloorData {
  number: number;
  mallId: number;
}

export interface UpdateFloorData {
  number?: number;
  mallId?: number;
}

const floorService = {
  create: async (data: CreateFloorData): Promise<Floor> => {
    const response = await api.post('/floors', data);
    return response.data;
  },

  findAll: async (mallId?: number): Promise<Floor[]> => {
    const url = mallId ? `/floors?mallId=${mallId}` : '/floors';
    const response = await api.get(url);
    return response.data;
  },

  findOne: async (id: number): Promise<Floor> => {
    const response = await api.get(`/floors/${id}`);
    return response.data;
  },

  update: async (id: number, data: UpdateFloorData): Promise<Floor> => {
    const response = await api.patch(`/floors/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/floors/${id}`);
  },

  getAll: async () => {
    const response = await api.get('/floors');
    return response.data;
  }
};

export default floorService; 