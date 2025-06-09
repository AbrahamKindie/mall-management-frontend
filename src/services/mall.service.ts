import api from './api';
import type { Unit } from '../types/unit';

export interface Mall {
  id: number;
  name: string;
  address: string;
  description?: string;
  floors: Floor[];
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: number;
  number: number;
  mallId: number;
  units: Unit[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMallData {
  name: string;
  address: string;
  description?: string;
}

export interface UpdateMallData {
  name?: string;
  address?: string;
  description?: string;
}

const mallService = {
  async create(data: CreateMallData): Promise<Mall> {
    const response = await api.post<Mall>('/malls', data);
    return response.data;
  },

  async findAll(): Promise<Mall[]> {
    const response = await api.get<Mall[]>('/malls');
    return response.data;
  },

  async findOne(id: number): Promise<Mall> {
    const response = await api.get<Mall>(`/malls/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateMallData): Promise<Mall> {
    const response = await api.patch<Mall>(`/malls/${id}`, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/malls/${id}`);
  },

  getAll: async () => {
    const response = await api.get('/malls');
    return response.data;
  },
};

export default mallService; 