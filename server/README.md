# Manufacturing Quote Intake - Backend Server

Backend API server for storing and managing manufacturing quote requests in SQLite database.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

3. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Create Quote Request
```http
POST /api/quote-requests
Content-Type: application/json

{
  "quote_number": "QR-20260102-ABCD",
  "company_name": "Acme Corp",
  "contact_name": "John Doe",
  "email": "john@acme.com",
  "phone": "555-1234",
  "project_name": "Hydraulic Bracket",
  "description": "Project details...",
  "quantity": "500",
  "lead_time": "standard",
  "part_notes": "Tolerances and requirements...",
  "materials": ["6061-T6 Aluminum", "PEEK"],
  "finishes": ["Anodize (Type II)", "Bead Blast"],
  "certifications": ["itar", "iso"],
  "files": [
    {
      "filename": "bracket.step",
      "file_extension": ".step",
      "file_size_bytes": 1048576
    }
  ]
}
```

### Get All Quote Requests
```http
GET /api/quote-requests
GET /api/quote-requests?status=pending
GET /api/quote-requests?company_name=Acme
```

### Get Single Quote Request
```http
GET /api/quote-requests/:id
GET /api/quote-requests/QR-20260102-ABCD
```

### Update Quote Status
```http
PATCH /api/quote-requests/:id/status
Content-Type: application/json

{
  "status": "processing"
}
```

### Get Analytics
```http
GET /api/analytics/quote-requests
```

## Database Structure

The database uses a normalized structure optimized for AI querying:

- **quote_requests** - Main quote data
- **materials** - Material catalog with custom materials
- **finishes** - Finish catalog with custom finishes
- **certifications** - Available certifications
- **quote_materials** - Many-to-many: quotes ↔ materials
- **quote_finishes** - Many-to-many: quotes ↔ finishes
- **quote_certifications** - Many-to-many: quotes ↔ certifications
- **quote_files** - File metadata (filename, extension, size)

## Environment Variables

Create a `.env` file:
```
PORT=3001
DATABASE_PATH=../database/quotes.db
```

## Next Steps: N8N Integration

After quotes are stored in the database, you can:
1. Create an N8N webhook to receive new quote notifications
2. Process uploaded files (actual files would be stored separately)
3. Send confirmation emails
4. Update quote status via API
