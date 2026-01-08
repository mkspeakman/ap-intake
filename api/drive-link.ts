/**
 * Vercel Serverless Function: Update Quote with Google Drive Link
 * PATCH /api/drive-link?id=123
 */

import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { drive_file_id, drive_link } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Quote ID is required' });
      }

      // Ensure id is a string, not an array
      const quoteId = Array.isArray(id) ? id[0] : id;

      await sql`
        UPDATE quote_requests 
        SET drive_file_id = ${drive_file_id}, 
            drive_link = ${drive_link}, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${quoteId}
      `;

      return res.json({
        success: true,
        message: 'Google Drive link updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating Drive link:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update Drive link',
        details: error.message,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
