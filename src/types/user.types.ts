// User and Role types for RBAC

export type UserRole = 'superadmin' | 'admin' | 'estimator' | 'sales' | 'guest';

export interface User {
  id: number;
  email: string;
  name: string;
  company_name?: string;
  phone?: string;
  role: UserRole;
  can_view_history: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  token?: string;
}

// Role Permissions Configuration
export const ROLE_PERMISSIONS = {
  superadmin: { canManageUsers: true, canViewHistory: true },
  admin: { canManageUsers: true, canViewHistory: true },
  estimator: { canManageUsers: false, canViewHistory: true },
  sales: { canManageUsers: false, canViewHistory: false },
  guest: { canManageUsers: false, canViewHistory: false },
} as const;

// Helper function to check permissions
export function hasPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS.superadmin): boolean {
  return ROLE_PERMISSIONS[role][permission] ?? false;
}

// Helper function to check if role is at least a certain level
export function isRoleAtLeast(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: UserRole[] = ['guest', 'sales', 'estimator', 'admin', 'superadmin'];
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}
