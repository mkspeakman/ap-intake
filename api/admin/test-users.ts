// API endpoint for test user management
// api/admin/test-users.ts - Bulk operations on test users (superadmin only)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { requireRole, logAudit, type AuthenticatedRequest } from '../middleware/rbac.js';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  // Only superadmins can manage test users
  const hasAccess = await requireRole(req, res, ['superadmin']);
  if (!hasAccess) return;

  try {
    if (req.method === 'GET') {
      // List all test users
      const result = await sql`
        SELECT id, email, name, company_name, phone, role, created_at
        FROM users
        WHERE is_test_user = TRUE
        ORDER BY created_at DESC
      `;

      await logAudit(req.user!.id, 'list_test_users', 'user', undefined, undefined, req);

      res.status(200).json({ users: result.rows, count: result.rows.length });
    }
    else if (req.method === 'POST') {
      // Mark users as test users
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ error: 'Missing or invalid userIds array' });
        return;
      }

      const result = await sql.query(
        `UPDATE users SET is_test_user = TRUE WHERE id = ANY($1) RETURNING id, email`,
        [userIds]
      );

      await logAudit(
        req.user!.id,
        'mark_test_users',
        'user',
        undefined,
        { userIds, count: result.rows.length },
        req
      );

      res.status(200).json({ 
        message: `Marked ${result.rows.length} users as test users`,
        users: result.rows 
      });
    }
    else if (req.method === 'DELETE') {
      // Bulk delete test users
      const { confirm } = req.body;

      if (confirm !== 'DELETE_ALL_TEST_USERS') {
        res.status(400).json({ 
          error: 'Confirmation required. Send { "confirm": "DELETE_ALL_TEST_USERS" }' 
        });
        return;
      }

      // Get list of users to be deleted for audit log
      const usersToDelete = await sql`
        SELECT id, email FROM users WHERE is_test_user = TRUE
      `;

      if (usersToDelete.rows.length === 0) {
        res.status(200).json({ message: 'No test users to delete', count: 0 });
        return;
      }

      // Delete test users
      const result = await sql`
        DELETE FROM users WHERE is_test_user = TRUE
        RETURNING id, email
      `;

      await logAudit(
        req.user!.id,
        'delete_test_users',
        'user',
        undefined,
        { count: result.rows.length, users: result.rows },
        req
      );

      res.status(200).json({ 
        message: `Deleted ${result.rows.length} test users`,
        count: result.rows.length,
        users: result.rows
      });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Test user management error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
