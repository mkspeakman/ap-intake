// RBAC utility functions for frontend

import type { UserRole } from '../types/user.types';
import { hasPermission, isRoleAtLeast } from '../types/user.types';

// Get user role from localStorage or context
export function getCurrentUserRole(): UserRole | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.role || 'guest';
  } catch {
    return null;
  }
}

// Check if current user has a specific permission
export function canUser(permission: string): boolean {
  const role = getCurrentUserRole();
  if (!role) return false;
  
  return hasPermission(role, permission as any);
}

// Check if current user's role meets minimum requirement
export function requiresRole(requiredRole: UserRole): boolean {
  const role = getCurrentUserRole();
  if (!role) return false;
  
  return isRoleAtLeast(role, requiredRole);
}

// Role-based route protection helper
export function canAccessRoute(route: string): boolean {
  const role = getCurrentUserRole();
  if (!role) return false;

  // Define route access rules
  const routeAccess: Record<string, UserRole[]> = {
    '/admin': ['admin', 'superadmin'],
    '/users': ['superadmin'],
    '/history': ['estimator', 'admin', 'superadmin', 'sales'],
    '/': ['guest', 'sales', 'estimator', 'admin', 'superadmin'], // Form accessible to all
  };

  const allowedRoles = routeAccess[route] || ['guest', 'sales', 'estimator', 'admin', 'superadmin'];
  return allowedRoles.includes(role);
}
