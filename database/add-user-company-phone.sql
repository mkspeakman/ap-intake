-- Add company and phone fields to users table
-- Run this migration to support full client information for users

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Create index for company name lookups
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_name);
