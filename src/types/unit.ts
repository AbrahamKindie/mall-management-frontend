import type { Tenant } from './tenant';

export enum UnitStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export interface Unit {
  id: number;
  number: string;
  floorId: number;
  size: number;
  status: UnitStatus;
  tenantId?: number;
  tenant?: Tenant;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUnitData {
  number: string;
  floorId: number;
  size: number;
  status: UnitStatus;
}

export interface UpdateUnitData {
  number?: string;
  floorId?: number;
  size?: number;
  status?: UnitStatus;
}

export interface AssignTenantData {
  tenantId: number;
} 