# Vercel Deployment - Database Configuration

## ✅ What's Configured

### 1. Serverless Postgres Integration
- **Files created:**
  - `/api/quote-requests.ts` - Serverless function for quote CRUD
  - `/api/quote-requests/[id]/drive-link.ts` - Update Drive links
  - `/api/db.ts` - Database helpers
  - `/database/schema-postgres.sql` - PostgreSQL schema

### 2. Dependencies Added
- `@vercel/postgres` - Works with Neon, Vercel's serverless Postgres partner
- `@vercel/node` - TypeScript types for serverless functions

---

## 🗄️ Database Options in Vercel

Based on your Vercel integrations, here are the best options:

### ⭐ **Recommended: Neon** (Serverless Postgres)
- **Perfect fit** - Listed first by Vercel, serverless Postgres
- **Code is ready** - Works with `@vercel/postgres` we already installed
- **Generous free tier** - 512 MB storage, always-on compute
- **Fast setup** - One-click Vercel integration
- **Auto-scaling** - Scales to zero when idle

### 🔄 **Alternative: Turso** (Serverless SQLite)
- **Minimal changes** - Closest to current SQLite setup
- **Edge distribution** - Data replicated globally
- **Would need** - Switch from `better-sqlite3` to `@libsql/client`
- **Good for** - If you prefer SQLite familiarity

### Other Database Options:
- **Supabase** - Postgres backend (good but more features than needed)
- **Prisma Postgres** - Instant serverless (requires Prisma ORM)
- **AWS RDS** - Enterprise option (overkill for this use case)

### Other Vercel Storage Options:

#### 🔵 **Blob** - Fast Object Storage
- **What it is:** File storage (like AWS S3 or Google Cloud Storage)
- **Best for:** Storing uploaded files, images, PDFs, videos
- **Not for:** Structured data or queries (it's storage, not a database)
- **Interesting option:** Could replace Google Drive for file storage
  - Upload files directly to Vercel Blob in serverless function
  - Store blob URLs in Neon database
  - Faster, more reliable than webhook → Google Drive
  - Free tier: 500 MB storage

#### ⚡ **Edge Config** - Ultra-Low Latency Reads
- **What it is:** Read-only key-value store replicated globally
- **Best for:** Feature flags, A/B testing config, redirects, geo-specific content
- **Not for:** User-generated data (read-only, max 512KB total)
- **Not relevant for this project** - Can't store form submissions

---

## 🚀 Setup with Neon (Recommended)

### Step 1: Install Neon Integration

## 🚀 Setup with Neon (Recommended)

### Step 1: Install Neon Integration

1. **Go to your Vercel project dashboard**
2. **Navigate to Storage tab**
3. **Click "Neon - Serverless Postgres"**
4. **Click "Add Integration"**
5. **Authorize Neon** (creates account if you don't have one)
6. **Create database** - Choose region closest to your users

Vercel automatically sets these environment variables:
```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
DATABASE_URL
```

**Note:** `@vercel/postgres` works perfectly with Neon's connection strings!

### Step 2: Initialize Database Schema

**Option A: Via Neon Console**
1. Go to Vercel → Storage → Your Neon Database
2. Click "Open Neon Console"
3. Navigate to SQL Editor
4. Copy contents of `database/schema-postgres.sql`
5. Paste and execute

**Option B: Via psql (Terminal)**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Connect and run schema
psql $(grep POSTGRES_URL .env.local | cut -d '=' -f2-) < database/schema-postgres.sql
```

**Option C: Via Vercel Dashboard**
1. Go to Storage → Your Database → Query tab
2. Copy contents of `database/schema-postgres.sql`
3. Paste and execute

### Step 3: Deploy

```bash
# Install new dependencies
npm install

# Deploy to production
vercel --prod
```

---

## 🔄 How It Works

### Development (Local)
```
Form → SQLite (server/index.ts on localhost:3001) → n8n webhook
```
- Uses local SQLite database
- Run: `cd server && npm run dev`

### Production (Vercel)
```
Form → Vercel Postgres (/api/quote-requests.ts) → n8n webhook
```
- Uses Vercel Postgres
- Automatically deployed as serverless functions
- No server to manage

---

## 📡 API Endpoints (Production)

After deployment, your app will use:

**Database API:**
- `POST /api/quote-requests` - Create quote (saves to Postgres)
- `GET /api/quote-requests` - List all quotes
- `PATCH /api/quote-requests/[id]/drive-link` - Update with Drive link

**n8n Webhook:**
- `POST /api/webhook` - Proxies to n8n (unchanged)

---

## 🧪 Testing Production Database

After deploying, test with:

```bash
# Test quote creation
curl -X POST https://your-app.vercel.app/api/quote-requests \
  -H "Content-Type: application/json" \
  -d '{
    "quote_number": "QR-TEST-001",
    "company_name": "Test Co",
    "contact_name": "John Doe",
    "email": "john@test.com",
    "project_name": "Test Project",
    "quantity": "10",
    "materials": ["Aluminum"],
    "finishes": ["Anodized"],
    "certifications": [],
    "files": []
  }'

# List all quotes
curl https://your-app.vercel.app/api/quote-requests
```

---

## 🔍 Monitoring

**View logs in Vercel:**
1. Go to your project → Functions tab
2. See all `/api/*` function invocations
3. Click any request to see logs

**Query database directly:**
1. Go to Storage → Your Database → Query tab
2. Run SQL queries:
   ```sql
   SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 10;
   SELECT COUNT(*) FROM quote_requests;
   ```Neon Pricing

**Free Tier (Perfect for starting):**
- 512 MB storage per database
- Unlimited databases
- 200 compute hours/month
- Auto-suspend after 5 min inactivity
- **Perfect for this use case!**

**Need more?**
- Launch plan: $19/month (3 GB storage, no auto-suspend)
- Scale plan: $69/month (100 GB storage)

**Need more?**
- Pro plan: $20/month (512 MB storage, 100 compute hours)
- Storage add-ons available

---

## 🔐 Security Notes

✅ **Environment variables** - Automatically secured by Vercel  
✅ **Connection pooling** - Handled by `@vercel/postgres`  
✅ **SQL injection** - Protected by parameterized queries  
✅ **CORS** - Configured in serverless functions  

---

## 🎯 What Happens on Form Submit

### Current Architecture (Database-First)

```
1. User submits form
   ↓
2. POST /api/quote-requests (Neon Postgres - PRIMARY)
   ✓ Data saved immediately (fast, reliable, queryable)
   ✓ Returns quote ID
   ✓ ENABLES: History display, search, filters, AI agents
   ↓
3. POST /api/webhook (n8n → Google Drive - SECONDARY)
   ✓ Uploads files
   ✓ Creates Google Drive folder/doc
   ✓ Returns Drive link
   ✓ ENABLES: Human business workflow access
   ↓
4. PATCH /api/quote-requests/[id]/drive-link (LINKING)
   ✓ Links Drive folder to quote record
   ✓ COMPLETES: Unified data model
   ↓
5. User sees success
   ✓ Data queryable in database
   ✓ Files accessible in Drive
```

**If n8n fails:** Data still in database, frontend can display submission, can retry Drive upload later!

### Why This Architecture?

**Google Drive** = Business process requirement
- Human teams need file access
- Integrated into existing workflows
- Cannot be replaced with Blob storage

**Neon Database** = Frontend evolution platform
- **Phase 1 (Now):** Store submissions
- **Phase 2 (Next):** Display history, search, filter
- **Phase 3 (Future):** CRUD operations + AI agents managing requests

---

## 📊 Ready to Deploy!

Your database setup is complete and ready for Vercel. Just:

1. `npm install` - Get new dependencies
2. Create Vercel Postgres database
3. Run schema SQL
4. `vercel --prod` - Deploy!
