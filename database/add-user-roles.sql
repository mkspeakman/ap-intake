-- Add RBAC (Role-Based Access Control) to users table
-- This migration adds roles to support granular permissions

-- Step 1: Create role enum type
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'estimator', 'sales', 'guest');

-- Step 2: Add role column to users table (defaults to 'guest')
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'guest';

-- Step 3: Add last_login tracking for audit purposes
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Step 4: Migrate existing users based on can_view_history
-- Admin users get 'admin' role, others get 'estimator' role
UPDATE users 
SET role = CASE 
  WHEN can_view_history = true THEN 'admin'::user_role
  ELSE 'estimator'::user_role
END;

-- Step 5: Update test users with appropriate roles
UPDATE users SET role = 'superadmin'::user_role WHERE email = 'admin@example.com';
UPDATE users SET role = 'estimator'::user_role WHERE email = 'user@example.com';

-- Step 6: Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Optional: Create audit log table for tracking user actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'login', 'view_quote', 'create_quote', 'update_quote', 'delete_quote'
  resource_type VARCHAR(50), -- 'quote', 'user', 'file'
  resource_id INTEGER,
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB, -- Additional context (e.g., changed fields, old values)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Role Permission Matrix (for documentation):
-- 
-- superadmin: Full access - manage users, view all quotes, configure system
-- admin:      Manage quotes, view history, access reports
-- estimator:  Create/view/update quotes, limited history access
-- sales:      View quotes, limited editing (maybe just notes/follow-ups)
-- guest:      View-only access to specific quotes (if shared)
