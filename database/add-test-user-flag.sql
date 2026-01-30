-- Add test user flag to users table
-- This allows marking test/fake users for filtering or bulk deletion
-- without displaying this information in the frontend

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_test_user BOOLEAN DEFAULT FALSE;

-- Add index for efficient filtering of test users
CREATE INDEX IF NOT EXISTS idx_users_is_test_user ON users(is_test_user);

-- Example: Mark existing test users (update emails as needed)
-- UPDATE users SET is_test_user = TRUE WHERE email LIKE '%@example.com';
-- UPDATE users SET is_test_user = TRUE WHERE email IN ('admin@example.com', 'user@example.com');

COMMENT ON COLUMN users.is_test_user IS 'Flag to identify test/demo users for filtering or bulk operations';
