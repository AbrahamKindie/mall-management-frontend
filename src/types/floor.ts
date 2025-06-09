// import type { Mall } from './mall';

export interface Floor {
  id: number;
  number: number;
  mallId: number;
  mall?: {
    id: number;
    name: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 