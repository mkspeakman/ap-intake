// Example: Protected API endpoint with RBAC
// api/admin/users.ts - Manage users (superadmin only)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { requireRole, logAudit, type AuthenticatedRequest } from '../middleware/rbac.js';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  // Admins and superadmins can manage users
  const hasAccess = await requireRole(req, res, ['admin', 'superadmin']);
  if (!hasAccess) return;

  try {
    if (req.method === 'GET') {
      // List all users (optionally filter out test users)
      const { includeTestUsers } = req.query;
      
      // Check if is_test_user column exists, if not, just return all users
      let result;
      try {
        result = includeTestUsers === 'true' 
          ? await sql`
              SELECT id, email, name, company_name, phone, role, can_view_history, last_login, created_at
              FROM users
              ORDER BY created_at DESC
            `
          : await sql`
              SELECT id, email, name, company_name, phone, role, can_view_history, last_login, created_at
              FROM users
              WHERE is_test_user = FALSE OR is_test_user IS NULL
              ORDER BY created_at DESC
            `;
      } catch (colError: any) {
        // If is_test_user column doesn't exist, fallback to query without it
        if (colError.code === '42703') {
          console.warn('is_test_user column not found, returning all users. Run add-test-user-flag.sql migration.');
          result = await sql`
            SELECT id, email, name, company_name, phone, role, can_view_history, last_login, created_at
            FROM users
            ORDER BY created_at DESC
          `;
        } else {
          throw colError;
        }
      }

      await logAudit(req.user!.id, 'list_users', 'user', undefined, undefined, req);

      res.status(200).json({ users: result.rows });
    } 
    else if (req.method === 'POST') {
      // Create new user
      const { email, name, companyName, phone, role, password, isTestUser } = req.body;

      if (!email || !name || !role || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // In production, hash the password with bcrypt
      let result;
      try {
        result = await sql`
          INSERT INTO users (email, name, company_name, phone, role, password_hash, is_test_user)
          VALUES (${email}, ${name}, ${companyName || null}, ${phone || null}, ${role}, ${password}, ${isTestUser || false})
          RETURNING id, email, name, company_name, phone, role, created_at
        `;
      } catch (insertError: any) {
        // If is_test_user column doesn't exist, fallback to insert without it
        if (insertError.code === '42703') {
          console.warn('is_test_user column not found, inserting without it. Run add-test-user-flag.sql migration.');
          result = await sql`
            INSERT INTO users (email, name, company_name, phone, role, password_hash)
            VALUES (${email}, ${name}, ${companyName || null}, ${phone || null}, ${role}, ${password})
            RETURNING id, email, name, company_name, phone, role, created_at
          `;
        } else {
          throw insertError;
        }
      }

      await logAudit(
        req.user!.id, 
        'create_user', 
        'user', 
        result.rows[0].id, 
        { email, role, company: companyName },
        req
      );

      res.status(201).json({ user: result.rows[0] });
    }
    else if (req.method === 'PATCH') {
      // Update user
      const { userId, role, email, name, company_name, phone } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
      }

      // Build update fields dynamically
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (email !== undefined) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email);
      }
      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (company_name !== undefined) {
        updates.push(`company_name = $${paramIndex++}`);
        values.push(company_name);
      }
      if (phone !== undefined) {
        updates.push(`phone = $${paramIndex++}`);
        values.push(phone);
      }
      if (role !== undefined) {
        updates.push(`role = $${paramIndex++}`);
        values.push(role);
      }

      if (updates.length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      updates.push(`updated_at = NOW()`);
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, email, name, company_name, phone, role
      `;

      const result = await sql.query(query, values);

      await logAudit(
        req.user!.id,
        'update_user',
        'user',
        userId,
        { email, name, company_name, phone, role },
        req
      );

      res.status(200).json({ user: result.rows[0] });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('User management error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
