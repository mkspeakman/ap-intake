/**
 * Vercel Serverless Function: User Authentication
 * POST /api/auth/login
 */

import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    // Check if running locally without database connection
    if (!process.env.POSTGRES_URL) {
      // Return mock user for local development
      if (email === 'test@example.com' && password === 'password') {
        return res.json({
          success: true,
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            role: 'admin',
            can_view_history: true,
            permissions: {
              canViewHistory: true
            }
          }
        });
      }
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Query user from database
    const result = await sql`
      SELECT id, email, name, company_name, phone, password_hash, can_view_history, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // TODO: In production, use bcrypt to compare hashed passwords
    // For now, doing simple comparison (INSECURE - only for initial setup)
    if (user.password_hash !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Return user data (without password)
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company_name: user.company_name,
        phone: user.phone,
        role: user.role || 'guest',
        can_view_history: user.can_view_history || false,
        permissions: {
          canViewHistory: user.can_view_history || false
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
