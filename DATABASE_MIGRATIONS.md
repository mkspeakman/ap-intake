# Database Migrations Guide

This document outlines all database migrations in the order they should be executed.

## Migration Order

Execute these SQL files in your Vercel Postgres (Neon) dashboard in the following order:

### 1. Core Tables (Required)

#### `schema-postgres.sql` - Quote Requests Table
Creates the main quote_requests table for storing manufacturing quote submissions.

**Fields:**
- Project information (title, description)
- Company and contact details
- Manufacturing requirements (materials, processes, quantities)
- File upload metadata (drive folder links)
- Timestamps

```sql
-- Run: database/schema-postgres.sql
```

#### `schema-users.sql` - Users Table
Creates the users table for authentication and basic user management.

**Fields:**
- email (unique)
- password_hash
- name
- can_view_history (boolean)
- created_at, updated_at

```sql
-- Run: database/schema-users.sql
```

### 2. RBAC System (Required for User Management)

#### `add-user-roles.sql` - Role-Based Access Control
Adds comprehensive RBAC system with roles, audit logging, and tracking.

**Changes:**
- Creates `user_role` ENUM (guest, sales, estimator, admin, superadmin)
- Adds `role` column to users table
- Adds `last_login` timestamp
- Creates `audit_logs` table for security tracking

```sql
-- Run: database/add-user-roles.sql
```

**Note:** This migration will set all existing users to 'guest' role. Update manually:
```sql
UPDATE users SET role = 'superadmin' WHERE email = 'admin@example.com';
```

#### `add-user-company-phone.sql` - Client Information
Adds company and phone fields to users table for client management.

**Changes:**
- Adds `company_name` column (TEXT, nullable)
- Adds `phone` column (VARCHAR(20), nullable)

```sql
-- Run: database/add-user-company-phone.sql
```

#### `add-test-user-flag.sql` - Test Data Management
Adds flag to identify test/demo users for filtering and bulk operations.

**Changes:**
- Adds `is_test_user` column (BOOLEAN, default FALSE)
- Creates index on `is_test_user`
- Allows filtering test data in production

```sql
-- Run: database/add-test-user-flag.sql
```

**Mark test users:**
```sql
UPDATE users SET is_test_user = TRUE 
WHERE email IN ('admin@example.com', 'user@example.com');
```

### 3. Equipment Matching (Optional)

#### `add-capability-fields.sql` - Capability Analysis
Adds fields to quote_requests for AI-powered equipment matching.

**Changes:**
- Adds `capabilities` JSONB column
- Adds `machine_matches` JSONB column
- Adds `analyzed_at` timestamp

```sql
-- Run: database/add-capability-fields.sql
```

#### `insert-equipment-postgres.sql` - Equipment Seed Data
Populates equipment table with manufacturing machines and capabilities.

**Data:**
- DMG MORI machines (5-axis, turning, milling)
- Haas machines (CNC mills, lathes)
- Mazak machines (multi-tasking)
- Capabilities and specifications

```sql
-- Run: database/insert-equipment-postgres.sql
```

## Creating Initial Admin User

After running core migrations, create your first admin:

```sql
INSERT INTO users (email, password_hash, name, role, is_test_user)
VALUES 
  ('admin@yourdomain.com', 'temporary-password', 'Admin Name', 'superadmin', false);
```

**⚠️ Security Warning:** 
- This uses plain text password for development only
- In production, implement bcrypt hashing
- Change password immediately after first login

## Verification Queries

### Check Users Table Structure
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

### Verify User Roles
```sql
SELECT id, email, name, role, is_test_user, created_at
FROM users
ORDER BY created_at DESC;
```

### Check Audit Logs
```sql
SELECT * FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;
```

### Verify Equipment Data
```sql
SELECT COUNT(*) as equipment_count FROM equipment;
SELECT machine_name, processes FROM equipment LIMIT 5;
```

## Rollback Instructions

### Remove Test User Flag
```sql
ALTER TABLE users DROP COLUMN IF EXISTS is_test_user;
DROP INDEX IF EXISTS idx_users_is_test_user;
```

### Remove RBAC System
```sql
ALTER TABLE users DROP COLUMN IF EXISTS role;
ALTER TABLE users DROP COLUMN IF EXISTS last_login;
DROP TABLE IF EXISTS audit_logs;
DROP TYPE IF EXISTS user_role;
```

### Remove Capability Fields
```sql
ALTER TABLE quote_requests DROP COLUMN IF EXISTS capabilities;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS machine_matches;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS analyzed_at;
```

## Migration Status Tracking

Keep track of which migrations you've run:

```sql
-- Create migration tracking table (optional)
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track migrations
INSERT INTO schema_migrations (version) VALUES
  ('001_schema_postgres'),
  ('002_schema_users'),
  ('003_add_user_roles'),
  ('004_add_user_company_phone'),
  ('005_add_test_user_flag'),
  ('006_add_capability_fields'),
  ('007_insert_equipment');
```

## Troubleshooting

### Column Already Exists Error
If you see "column already exists" errors, the migration was likely already run. Skip or use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.

### Permission Denied
Ensure your database user has sufficient privileges:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

### Missing Dependencies
Some migrations depend on others:
- `add-user-roles.sql` must run before any user management features work
- `add-capability-fields.sql` requires `schema-postgres.sql` to exist
- `insert-equipment-postgres.sql` requires the equipment table (usually auto-created)

## Best Practices

1. **Backup First:** Always backup your database before running migrations
2. **Test Locally:** Run migrations on a local/staging database first
3. **One at a Time:** Execute migrations one by one, verify each before continuing
4. **Version Control:** Keep track of which migrations have been applied
5. **Document Changes:** Update this file when adding new migrations
6. **Review Data:** Check data integrity after each migration

## Production Checklist

Before deploying to production:
- [ ] All migrations tested in staging
- [ ] Backup created
- [ ] Migration order verified
- [ ] Admin user created
- [ ] Test users marked with `is_test_user = TRUE`
- [ ] Passwords changed from defaults
- [ ] Audit logs verified working
- [ ] Permission system tested
