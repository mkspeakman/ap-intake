# Database Setup and Integration Guide

## Overview

**This guide covers LOCAL DEVELOPMENT with SQLite + Express.**  
**For Vercel production deployment, see [VERCEL_DATABASE.md](VERCEL_DATABASE.md)**

The manufacturing quote intake system includes a complete SQL database structure optimized for:
- Storing all form submissions
- AI-friendly querying and analysis
- Flexible material/finish/certification management
- File metadata tracking (filenames and extensions only)
- Future CRUD operations with AI agents

## Database Structure

### Normalized Schema

The database uses a **normalized relational structure** with the following tables:

1. **quote_requests** - Main quote data with company, contact, and project info
2. **materials** - Catalog of materials (pre-populated + custom entries)
3. **finishes** - Catalog of finishes (pre-populated + custom entries)
4. **certifications** - Available certifications (ISO, ITAR, etc.)
5. **quote_materials** - Junction table linking quotes to materials (many-to-many)
6. **quote_finishes** - Junction table linking quotes to finishes (many-to-many)
7. **quote_certifications** - Junction table linking quotes to certifications (many-to-many)
8. **quote_files** - File metadata including filename, extension, size, order

### Why This Structure?

✅ **AI-Friendly**: Easy to query patterns like "most common materials" or "quotes requiring ITAR"
✅ **Flexible**: Add custom materials/finishes without schema changes
✅ **Normalized**: Avoid data duplication, maintain referential integrity
✅ **Scalable**: Efficient for thousands of quotes with proper indexing
✅ **Queryable**: Supports complex analytics and reporting

### Dual Environment Support

**Local Development (this guide):**
- **Database:** SQLite (`database/quotes.db`)
- **Schema:** `database/schema.sql`
- **Backend:** Express.js server (`server/index.ts`)
- **Port:** http://localhost:3001

**Production on Vercel:**
- **Database:** PostgreSQL (Neon)
- **Schema:** `database/schema-postgres.sql`
- **Backend:** Serverless functions (`/api/*`)
- **See:** [VERCEL_DATABASE.md](VERCEL_DATABASE.md)

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Initialize Database

```bash
# Create database with schema
npm run init-db
```

This creates `database/quotes.db` with all tables and pre-populated data.

### 3. Start Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

Server runs on `http://localhost:3001`

### 4. Configure Frontend

Update `.env` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 5. Test the Integration

1. Start both frontend and backend:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd server && npm run dev
   ```

2. Submit a quote through the form
3. Check database: `sqlite3 database/quotes.db`
   ```sql
   SELECT * FROM quote_requests;
   SELECT * FROM quote_files;
   ```

## Example Queries

### Get all quotes with materials and files
```sql
SELECT 
  qr.*,
  GROUP_CONCAT(DISTINCT m.name) as materials,
  GROUP_CONCAT(DISTINCT qf.filename) as files
FROM quote_requests qr
LEFT JOIN quote_materials qm ON qr.id = qm.quote_request_id
LEFT JOIN materials m ON qm.material_id = m.id
LEFT JOIN quote_files qf ON qr.id = qf.quote_request_id
GROUP BY qr.id;
```

### Find quotes by material
```sql
SELECT qr.* FROM quote_requests qr
JOIN quote_materials qm ON qr.id = qm.quote_request_id
JOIN materials m ON qm.material_id = m.id
WHERE m.name = '6061-T6 Aluminum';
```

### Get certification statistics
```sql
SELECT c.name, COUNT(*) as usage_count
FROM certifications c
JOIN quote_certifications qc ON c.id = qc.certification_id
GROUP BY c.id
ORDER BY usage_count DESC;
```

## API Endpoints

All endpoints return JSON in this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### POST /api/quote-requests
Create new quote request. Returns quote ID and number.

### GET /api/quote-requests
List all quotes (supports filtering by status, company, date)

### GET /api/quote-requests/:id
Get detailed quote with all relations

### PATCH /api/quote-requests/:id/status
Update quote status (pending → processing → quoted → completed)

### GET /api/analytics/quote-requests
Get aggregated statistics for AI analysis

## File Handling

**Important**: The database stores only file **metadata** (filename, extension, size). The actual files are NOT stored in the database.

For N8N workflow integration, you'll need to:
1. Store actual files separately (filesystem, S3, etc.)
2. Use the stored filenames to retrieve files for processing
3. Update quote status via API after processing

## Next Steps: N8N Integration

Once the database is recording quotes, you can:

1. **Webhook Trigger**: N8N listens for new quote submissions
2. **Database Query**: Fetch quote details from API
3. **File Processing**: Process uploaded CAD files and drawings
4. **Notifications**: Send emails to sales team and customer
5. **Status Updates**: Update quote status via API

See N8N integration guide in the next section.
