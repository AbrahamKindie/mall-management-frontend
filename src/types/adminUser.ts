export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  role: string;
  profileImage?: string;
  status: string;
  userRoleId?: number;
  createdAt: string;
  updatedAt: string;
  password?: string;
} 