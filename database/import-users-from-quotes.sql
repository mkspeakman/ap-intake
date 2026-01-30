-- Import unique users from quote_requests into users table
-- Extracts contact information from quote submissions and creates user accounts
-- All imported users are marked as test users (is_test_user = TRUE)

-- Step 1: Preview what will be imported
SELECT DISTINCT
  email,
  contact_name as name,
  company_name,
  phone,
  'estimator' as role,  -- Default role for imported users
  'temp-password-123' as password_hash,  -- Temporary password (change after import)
  TRUE as is_test_user
FROM quote_requests
WHERE email IS NOT NULL 
  AND email NOT IN (SELECT email FROM users)
ORDER BY email;

-- Step 2: Import users (uncomment to execute)
-- This will create user accounts for all unique email addresses in quote_requests
/*
INSERT INTO users (email, name, company_name, phone, role, password_hash, is_test_user)
SELECT DISTINCT ON (email)
  email,
  COALESCE(contact_name, 'Unknown User') as name,
  company_name,
  phone,
  'estimator' as role,
  'temp-password-123' as password_hash,
  TRUE as is_test_user
FROM quote_requests
WHERE email IS NOT NULL 
  AND email != ''
  AND email NOT IN (SELECT email FROM users)
ORDER BY email, created_at DESC;
*/

-- Step 3: Verify imported users
/*
SELECT 
  id, 
  email, 
  name, 
  company_name, 
  phone, 
  role, 
  is_test_user,
  created_at
FROM users
WHERE is_test_user = TRUE
ORDER BY created_at DESC;
*/

-- Step 4: Send password reset instructions
-- After importing, you'll need to:
-- 1. Change passwords from 'temp-password-123' to something secure
-- 2. Send invitation emails to new users
-- 3. Or use the "Send Invitation" feature in the User Management UI

-- Optional: Link quotes to user accounts after import
/*
UPDATE quote_requests qr
SET submitted_by = u.email
FROM users u
WHERE qr.email = u.email
  AND qr.submitted_by IS NULL;
*/
