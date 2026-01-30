# RBAC Implementation Guide

## Overview

This project now includes Role-Based Access Control (RBAC) with five user roles:

- **superadmin**: Full system access, user management, configuration
- **admin**: Manage all quotes, view history, access reports  
- **estimator**: Create/edit quotes, view history
- **sales**: View quotes, limited editing (notes/status only)
- **guest**: View-only access to specific shared quotes

## Current Test Users

1. **Superadmin**: `admin@example.com` / `password123`
2. **Estimator**: `user@example.com` / `password123`

## Database Migration

Run the RBAC migration to add roles to your database:

\`\`\`bash
psql $POSTGRES_URL -f database/add-user-roles.sql
\`\`\`

This will:
- Create `user_role` enum type
- Add `role` column to users table
- Add `last_login` tracking
- Create `audit_logs` table for activity tracking
- Migrate existing users based on their `can_view_history` flag

## Backend Usage

### Protecting API Routes

\`\`\`typescript
import { requireRole, requireAuth, logAudit } from './middleware/rbac';

// Require authentication
export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const hasAccess = await requireAuth(req, res);
  if (!hasAccess) return;
  
  // Your logic here
}

// Require specific role(s)
export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const hasAccess = await requireRole(req, res, ['admin', 'superadmin']);
  if (!hasAccess) return;
  
  // Your logic here
}

// Log user actions
await logAudit(
  req.user!.id,
  'create_quote',
  'quote',
  quoteId,
  { company: 'Acme Corp' },
  req
);
\`\`\`

### Examples

See these files for complete examples:
- [api/admin/users.ts](api/admin/users.ts) - User management (superadmin only)
- [api/examples/quote-requests-with-rbac.ts](api/examples/quote-requests-with-rbac.ts) - Quote CRUD with role filtering

## Frontend Usage

### Using the AuthContext

\`\`\`tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, hasPermission, userRole } = useAuth();
  
  // Check permission
  if (hasPermission('canDeleteQuotes')) {
    return <DeleteButton />;
  }
  
  // Check role
  if (userRole === 'admin' || userRole === 'superadmin') {
    return <AdminPanel />;
  }
}
\`\`\`

### Using RoleGate Component

\`\`\`tsx
import { RoleGate } from './components/RoleGate';

function App() {
  return (
    <div>
      {/* Show only to admins */}
      <RoleGate roles={['admin', 'superadmin']}>
        <AdminDashboard />
      </RoleGate>
      
      {/* Show to estimator and above */}
      <RoleGate minimumRole="estimator">
        <SubmissionHistory />
      </RoleGate>
      
      {/* Show based on permission */}
      <RoleGate permission="canDeleteQuotes">
        <button>Delete Quote</button>
      </RoleGate>
      
      {/* With fallback */}
      <RoleGate 
        roles={['sales', 'estimator', 'admin', 'superadmin']}
        fallback={<p>Login required</p>}
      >
        <QuoteList />
      </RoleGate>
    </div>
  );
}
\`\`\`

### Using the Hook

\`\`\`tsx
import { useRoleCheck } from './components/RoleGate';

function MyComponent() {
  const { hasRole, meetsMinimumRole, hasPermission } = useRoleCheck();
  
  return (
    <div>
      {hasRole(['admin', 'superadmin']) && <AdminLink />}
      {meetsMinimumRole('estimator') && <HistoryLink />}
      {hasPermission('canViewAuditLogs') && <AuditLogLink />}
    </div>
  );
}
\`\`\`

## Permission Matrix

| Permission | superadmin | admin | estimator | sales | guest |
|------------|-----------|-------|-----------|-------|-------|
| Manage Users | ✓ | ✗ | ✗ | ✗ | ✗ |
| View All Quotes | ✓ | ✓ | ✓ | ✓ | ✗ |
| Edit All Quotes | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete Quotes | ✓ | ✓ | ✗ | ✗ | ✗ |
| View History | ✓ | ✓ | ✓ | ✓ | ✗ |
| Configure System | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Audit Logs | ✓ | ✓ | ✗ | ✗ | ✗ |

See [src/types/user.types.ts](src/types/user.types.ts) for the complete permission configuration.

## Audit Logging

All user actions are automatically logged to the `audit_logs` table:

\`\`\`sql
SELECT 
  u.name,
  al.action,
  al.resource_type,
  al.resource_id,
  al.created_at
FROM audit_logs al
JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 100;
\`\`\`

## Next Steps

1. **Run the migration**: Apply [database/add-user-roles.sql](database/add-user-roles.sql)
2. **Update auth API**: Modify [api/auth/login.ts](api/auth/login.ts) to return user role
3. **Protect routes**: Add RBAC middleware to sensitive API endpoints
4. **Update UI**: Use RoleGate to show/hide features
5. **Security**: Implement proper JWT tokens (currently using basic auth)
6. **Password hashing**: Use bcrypt instead of plain text passwords

## Security Notes

⚠️ **Current implementation uses simplified authentication for development:**
- Passwords are stored in plain text (use bcrypt in production)
- Tokens are base64-encoded emails (use JWT in production)
- No token expiration (add refresh tokens in production)

For production deployment:
1. Install bcrypt: `npm install bcrypt @types/bcrypt`
2. Install JWT: `npm install jsonwebtoken @types/jsonwebtoken`
3. Hash all passwords before storage
4. Generate JWT tokens with expiration
5. Implement refresh token flow
6. Add rate limiting to auth endpoints
