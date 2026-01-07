/**
 * Vercel Serverless Function: Create Quote Request
 * POST /api/quote-requests
 */

import { sql } from '@vercel/postgres';
import { getOrCreateMaterial, getOrCreateFinish } from './db';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const {
        quote_number,
        company_name,
        contact_name,
        email,
        phone,
        project_name,
        description,
        quantity,
        lead_time,
        part_notes,
        materials,
        finishes,
        certifications,
        files,
      } = req.body;

      // Insert main quote request
      const quoteResult = await sql`
        INSERT INTO quote_requests (
          quote_number, company_name, contact_name, email, phone,
          project_name, description, quantity, lead_time, part_notes, status
        ) VALUES (
          ${quote_number}, ${company_name}, ${contact_name}, ${email}, ${phone || null},
          ${project_name}, ${description || null}, ${quantity}, ${lead_time || null}, 
          ${part_notes || null}, 'pending'
        )
        RETURNING id, quote_number, created_at
      `;

      const quoteId = quoteResult.rows[0].id;

      // Insert materials
      if (materials && materials.length > 0) {
        for (const materialName of materials) {
          const materialId = await getOrCreateMaterial(materialName);
          await sql`
            INSERT INTO quote_materials (quote_request_id, material_id) 
            VALUES (${quoteId}, ${materialId})
          `;
        }
      }

      // Insert finishes
      if (finishes && finishes.length > 0) {
        for (const finishName of finishes) {
          const finishId = await getOrCreateFinish(finishName);
          await sql`
            INSERT INTO quote_finishes (quote_request_id, finish_id) 
            VALUES (${quoteId}, ${finishId})
          `;
        }
      }

      // Insert certifications
      if (certifications && certifications.length > 0) {
        for (const certCode of certifications) {
          await sql`
            INSERT INTO quote_certifications (quote_request_id, certification_id)
            SELECT ${quoteId}, id FROM certifications WHERE code = ${certCode}
          `;
        }
      }

      // Insert file metadata
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          await sql`
            INSERT INTO quote_files (quote_request_id, filename, file_extension, file_size_bytes, upload_order)
            VALUES (${quoteId}, ${file.filename}, ${file.file_extension}, ${file.file_size_bytes}, ${i})
          `;
        }
      }

      return res.status(201).json({
        success: true,
        data: quoteResult.rows[0],
        message: 'Quote request created successfully',
      });
    } catch (error: any) {
      console.error('Error creating quote request:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create quote request',
        message: error.message,
      });
    }
  }

  // GET - List all quotes
  if (req.method === 'GET') {
    try {
      const { status, company_name, from_date, to_date } = req.query;

      let queryStr = 'SELECT * FROM quote_requests WHERE 1=1';
      const conditions = [];

      if (status) {
        conditions.push(sql`status = ${status}`);
      }
      if (company_name) {
        conditions.push(sql`company_name ILIKE ${'%' + company_name + '%'}`);
      }
      if (from_date) {
        conditions.push(sql`created_at >= ${from_date}`);
      }
      if (to_date) {
        conditions.push(sql`created_at <= ${to_date}`);
      }

      const result = await sql`
        SELECT * FROM quote_requests 
        ORDER BY created_at DESC
      `;

      return res.json({
        success: true,
        data: result.rows,
      });
    } catch (error: any) {
      console.error('Error fetching quotes:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch quotes',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
