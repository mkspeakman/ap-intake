// Role-based UI component wrapper
// Use this to conditionally show/hide features based on user role

import { type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/user.types';
import { isRoleAtLeast } from '../types/user.types';

interface RoleGateProps {
  children: ReactNode;
  /** Required role(s) to view this content */
  roles?: UserRole[];
  /** Minimum role required (uses hierarchy) */
  minimumRole?: UserRole;
  /** Required permission */
  permission?: string;
  /** Fallback content to show if user doesn't have access */
  fallback?: ReactNode;
}

/**
 * RoleGate component - conditionally renders content based on user role/permissions
 * 
 * Usage:
 * ```tsx
 * // Show only to admins
 * <RoleGate roles={['admin', 'superadmin']}>
 *   <AdminPanel />
 * </RoleGate>
 * 
 * // Show to estimator and above
 * <RoleGate minimumRole="estimator">
 *   <QuoteHistory />
 * </RoleGate>
 * 
 * // Show based on specific permission
 * <RoleGate permission="canDeleteQuotes">
 *   <DeleteButton />
 * </RoleGate>
 * ```
 */
export function RoleGate({ 
  children, 
  roles, 
  minimumRole, 
  permission,
  fallback = null 
}: RoleGateProps) {
  const { user, hasPermission: checkPermission, userRole } = useAuth();

  // No user = no access
  if (!user || !userRole) {
    return <>{fallback}</>;
  }

  // Check specific roles
  if (roles && !roles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // Check minimum role hierarchy
  if (minimumRole && !isRoleAtLeast(userRole, minimumRole)) {
    return <>{fallback}</>;
  }

  // Check specific permission
  if (permission && !checkPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook version for conditional logic
export function useRoleCheck() {
  const { userRole, hasPermission: checkPermission } = useAuth();

  return {
    hasRole: (roles: UserRole[]) => userRole ? roles.includes(userRole) : false,
    meetsMinimumRole: (minimumRole: UserRole) => userRole ? isRoleAtLeast(userRole, minimumRole) : false,
    hasPermission: (permission: string) => checkPermission(permission),
    userRole,
  };
}
