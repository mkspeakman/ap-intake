-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  can_view_history BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Example: Insert a test user (password: 'password123')
-- Note: In production, use bcrypt to hash passwords
-- For now, storing plain text for manual setup (INSECURE)
INSERT INTO users (email, password_hash, name, can_view_history)
VALUES 
  ('admin@example.com', 'password123', 'Admin User', true),
  ('user@example.com', 'password123', 'Regular User', false)
ON CONFLICT (email) DO NOTHING;
