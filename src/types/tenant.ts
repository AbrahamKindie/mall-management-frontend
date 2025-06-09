import type { Unit } from './unit';

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  units?: Unit[];
}

export interface CreateTenantData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateTenantData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
} 