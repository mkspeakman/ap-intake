/**
 * Backend API Server for Manufacturing Quote Intake
 * 
 * This is a Node.js/Express server that handles:
 * - Storing quote requests in SQLite database
 * - File metadata storage
 * - RESTful API endpoints
 * - Ready for N8N webhook integration
 * 
 * To run this backend:
 * 1. cd server
 * 2. npm install
 * 3. npm run dev
 */

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite database
const db = new Database(path.join(__dirname, '../database/quotes.db'));
db.pragma('journal_mode = WAL');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to get or create material
const getOrCreateMaterial = (name: string, isCustom = false) => {
  let material = db.prepare('SELECT id FROM materials WHERE name = ?').get(name);
  if (!material) {
    const result = db.prepare('INSERT INTO materials (name, is_custom) VALUES (?, ?)').run(name, isCustom ? 1 : 0);
    return result.lastInsertRowid;
  }
  return material.id;
};

// Helper function to get or create finish
const getOrCreateFinish = (name: string, isCustom = false) => {
  let finish = db.prepare('SELECT id FROM finishes WHERE name = ?').get(name);
  if (!finish) {
    const result = db.prepare('INSERT INTO finishes (name, is_custom) VALUES (?, ?)').run(name, isCustom ? 1 : 0);
    return result.lastInsertRowid;
  }
  return finish.id;
};

// POST /api/quote-requests - Create new quote request
app.post('/api/quote-requests', (req, res) => {
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

    // Begin transaction
    const insert = db.transaction(() => {
      // Insert main quote request
      const quoteResult = db.prepare(`
        INSERT INTO quote_requests (
          quote_number, company_name, contact_name, email, phone,
          project_name, description, quantity, lead_time, part_notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `).run(
        quote_number,
        company_name,
        contact_name,
        email,
        phone || null,
        project_name,
        description || null,
        quantity,
        lead_time || null,
        part_notes || null
      );

      const quoteId = quoteResult.lastInsertRowid;

      // Insert materials
      if (materials && materials.length > 0) {
        const materialStmt = db.prepare('INSERT INTO quote_materials (quote_request_id, material_id) VALUES (?, ?)');
        materials.forEach((materialName: string) => {
          const materialId = getOrCreateMaterial(materialName);
          materialStmt.run(quoteId, materialId);
        });
      }

      // Insert finishes
      if (finishes && finishes.length > 0) {
        const finishStmt = db.prepare('INSERT INTO quote_finishes (quote_request_id, finish_id) VALUES (?, ?)');
        finishes.forEach((finishName: string) => {
          const finishId = getOrCreateFinish(finishName);
          finishStmt.run(quoteId, finishId);
        });
      }

      // Insert certifications
      if (certifications && certifications.length > 0) {
        const certStmt = db.prepare(`
          INSERT INTO quote_certifications (quote_request_id, certification_id)
          SELECT ?, id FROM certifications WHERE code = ?
        `);
        certifications.forEach((certCode: string) => {
          certStmt.run(quoteId, certCode);
        });
      }

      // Insert file metadata
      if (files && files.length > 0) {
        const fileStmt = db.prepare(`
          INSERT INTO quote_files (quote_request_id, filename, file_extension, file_size_bytes, upload_order)
          VALUES (?, ?, ?, ?, ?)
        `);
        files.forEach((file: any, index: number) => {
          fileStmt.run(quoteId, file.filename, file.file_extension, file.file_size_bytes, index);
        });
      }

      return { id: quoteId, quote_number };
    });

    const result = insert();

    res.status(201).json({
      success: true,
      data: {
        id: result.id,
        quote_number: result.quote_number,
        created_at: new Date().toISOString(),
      },
      message: 'Quote request created successfully',
    });
  } catch (error) {
    console.error('Error creating quote request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create quote request',
      message: error.message,
    });
  }
});

// GET /api/quote-requests - Get all quote requests
app.get('/api/quote-requests', (req, res) => {
  try {
    const { status, company_name, from_date, to_date } = req.query;

    let query = 'SELECT * FROM quote_requests WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (company_name) {
      query += ' AND company_name LIKE ?';
      params.push(`%${company_name}%`);
    }
    if (from_date) {
      query += ' AND created_at >= ?';
      params.push(from_date);
    }
    if (to_date) {
      query += ' AND created_at <= ?';
      params.push(to_date);
    }

    query += ' ORDER BY created_at DESC';

    const quotes = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote requests',
    });
  }
});

// GET /api/quote-requests/:id - Get single quote request with all details
app.get('/api/quote-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Get main quote
    const quote = db.prepare('SELECT * FROM quote_requests WHERE id = ? OR quote_number = ?').get(id, id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Quote request not found',
      });
    }

    // Get materials
    const materials = db.prepare(`
      SELECT m.name FROM materials m
      JOIN quote_materials qm ON m.id = qm.material_id
      WHERE qm.quote_request_id = ?
    `).all(quote.id).map(row => row.name);

    // Get finishes
    const finishes = db.prepare(`
      SELECT f.name FROM finishes f
      JOIN quote_finishes qf ON f.id = qf.finish_id
      WHERE qf.quote_request_id = ?
    `).all(quote.id).map(row => row.name);

    // Get certifications
    const certifications = db.prepare(`
      SELECT c.code, c.name FROM certifications c
      JOIN quote_certifications qc ON c.id = qc.certification_id
      WHERE qc.quote_request_id = ?
    `).all(quote.id);

    // Get files
    const files = db.prepare(`
      SELECT filename, file_extension, file_size_bytes, upload_order
      FROM quote_files
      WHERE quote_request_id = ?
      ORDER BY upload_order
    `).all(quote.id);

    res.json({
      success: true,
      data: {
        ...quote,
        materials,
        finishes,
        certifications,
        files,
      },
    });
  } catch (error) {
    console.error('Error fetching quote request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote request',
    });
  }
});

// PATCH /api/quote-requests/:id/status - Update quote status
app.patch('/api/quote-requests/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    db.prepare('UPDATE quote_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);

    res.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status',
    });
  }
});

// GET /api/quote-requests/analytics - Get analytics data
app.get('/api/analytics/quote-requests', (req, res) => {
  try {
    const totalQuotes = db.prepare('SELECT COUNT(*) as count FROM quote_requests').get();
    const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM quote_requests GROUP BY status').all();
    const topMaterials = db.prepare(`
      SELECT m.name, COUNT(*) as count 
      FROM materials m
      JOIN quote_materials qm ON m.id = qm.material_id
      GROUP BY m.name
      ORDER BY count DESC
      LIMIT 10
    `).all();
    const topFinishes = db.prepare(`
      SELECT f.name, COUNT(*) as count 
      FROM finishes f
      JOIN quote_finishes qf ON f.id = qf.finish_id
      GROUP BY f.name
      ORDER BY count DESC
      LIMIT 10
    `).all();

    res.json({
      success: true,
      data: {
        total_quotes: totalQuotes.count,
        by_status: byStatus,
        top_materials: topMaterials,
        top_finishes: topFinishes,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Database: ${path.join(__dirname, '../database/quotes.db')}`);
});

export default app;
