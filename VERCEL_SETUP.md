# Vercel Deployment - Complete Setup Guide

## Prerequisites

- ✅ Vercel account (sign up at vercel.com)
- ✅ GitHub repository with this code
- ✅ Dependencies installed locally (`npm install`)

---

## Step-by-Step Vercel Database Setup

### Step 1: Deploy to Vercel (Initial)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add database integration"
   git push
   ```

2. **Import project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your `ap-intake` repository
   - Click "Import"

3. **Configure project**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Click "Deploy"

4. **Wait for initial deployment** (this will succeed but database won't work yet)

---

### Step 2: Create Neon Database

1. **Navigate to your project in Vercel dashboard**
   - Go to your deployed project

2. **Open Storage tab**
   - Click "Storage" in the top navigation

3. **Add Neon Postgres**
   - Click "Create Database" or "Connect Store"
   - Select **"Neon"** from the list
   - Click "Continue"

4. **Configure Neon database**
   - **Database Name:** `ap-intake-db` (or your preference)
   - **Region:** Choose closest to your users (e.g., `us-east-1`)
   - Click "Create"

5. **Authorize integration**
   - Vercel will prompt to authorize Neon
   - Click "Authorize" (creates Neon account if you don't have one)
   - Wait for database creation (~30 seconds)

6. **Verify environment variables**
   - Vercel automatically sets these:
     ```
     POSTGRES_URL
     POSTGRES_PRISMA_URL
     POSTGRES_URL_NON_POOLING
     DATABASE_URL
     ```
   - Go to Settings → Environment Variables to verify

---

### Step 3: Initialize Database Schema

**Option A: Via Neon Console (Recommended)**

1. **Open Neon Console**
   - In Vercel: Storage → Your Database
   - Click "Open in Neon" or "Manage Database"

2. **Open SQL Editor**
   - In Neon dashboard, click "SQL Editor" tab

3. **Run the schema**
   - Open `database/schema-postgres.sql` in VS Code
   - Copy the entire file contents
   - Paste into Neon SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify tables created**
   - Run this query:
     ```sql
     SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public';
     ```
   - Should see: `quote_requests`, `materials`, `finishes`, `certifications`, `quote_materials`, `quote_finishes`, `quote_certifications`, `quote_files`

**Option B: Via Terminal (Alternative)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Link to your project**
   ```bash
   vercel link
   ```

3. **Pull environment variables**
   ```bash
   vercel env pull .env.local
   ```

4. **Install psql** (if not installed)
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql-client
   ```

5. **Run schema**
   ```bash
   # Extract connection string from .env.local
   psql $(grep POSTGRES_URL .env.local | cut -d '=' -f2-) < database/schema-postgres.sql
   ```

---

### Step 4: Redeploy Application

1. **Trigger new deployment**
   - In Vercel dashboard, go to Deployments
   - Click "Redeploy" button
   - OR push a new commit to trigger auto-deploy

2. **Wait for deployment** (~1-2 minutes)

3. **Check deployment logs**
   - Make sure build completes successfully
   - No errors in Functions tab

---

### Step 5: Test the Database Integration

1. **Open your deployed application**
   - Click "Visit" in Vercel dashboard
   - Or go to `https://your-app.vercel.app`

2. **Submit a test quote**
   - Fill out the form completely
   - Upload at least one test file
   - Click "Submit Project Information"

3. **Verify submission succeeded**
   - You should see success message
   - Check browser Network tab (no errors)

4. **Query the database**
   - Go to Neon Console → SQL Editor
   - Run:
     ```sql
     SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 5;
     ```
   - Your test submission should appear

5. **Check Google Drive**
   - Verify files were uploaded to Drive
   - Folder should be organized by quote number

6. **Verify Drive link saved**
   - In SQL Editor:
     ```sql
     SELECT quote_number, drive_link, drive_file_id 
     FROM quote_requests 
     ORDER BY created_at DESC 
     LIMIT 1;
     ```
   - Should show the Google Drive link

---

## Monitoring and Debugging

### View Serverless Function Logs

1. **Go to Vercel dashboard**
2. **Functions tab** → Click any function
3. **View logs** for all `/api/*` invocations

### Query Database Directly

1. **Neon Console** → SQL Editor
2. **Useful queries:**
   ```sql
   -- All quotes
   SELECT * FROM quote_requests;
   
   -- Quotes with materials
   SELECT qr.*, m.name as material
   FROM quote_requests qr
   JOIN quote_materials qm ON qr.id = qm.quote_request_id
   JOIN materials m ON qm.material_id = m.id;
   
   -- Quotes missing Drive links (webhook failed)
   SELECT * FROM quote_requests WHERE drive_link IS NULL;
   ```

### Check Environment Variables

1. **Vercel Dashboard** → Settings → Environment Variables
2. **Verify:**
   - `POSTGRES_URL` - Set by Neon integration
   - Any custom env vars from your `.env`

---

## Common Issues and Solutions

### Issue: "Connection error" when submitting form

**Solution:**
- Check Functions logs in Vercel
- Verify environment variables are set
- Ensure database schema was run successfully

### Issue: Form submits but no data in database

**Solution:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- If tables missing, re-run schema-postgres.sql
```

### Issue: n8n webhook fails

**Solution:**
- This is expected to not break the app
- Data still saved in database
- Check n8n workflow logs
- Can manually upload files to Drive later

### Issue: Drive link not saved to database

**Solution:**
```sql
-- Find quotes without Drive links
SELECT id, quote_number FROM quote_requests WHERE drive_link IS NULL;

-- If you have the Drive link, update manually:
UPDATE quote_requests 
SET drive_link = 'your-drive-link-here' 
WHERE id = 123;
```

---

## Cost Estimate

### Neon Free Tier
- ✅ 512 MB storage
- ✅ 200 compute hours/month
- ✅ Auto-suspend after 5 min inactivity
- **Plenty for starting out!**

### Vercel Free Tier
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless function execution
- ✅ Unlimited deployments
- **Perfect for this use case**

### Total Monthly Cost
- **$0** (stays within free tiers for typical usage)

---

## Next Steps

Once deployed:

1. **Phase 1 (Current):** Form submissions stored in database ✅
2. **Phase 2 (Next):** Build admin dashboard to display history
3. **Phase 3 (Future):** Add CRUD operations and AI agents

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Project Docs:** 
  - [README.md](README.md) - Overview
  - [DATABASE_SETUP.md](DATABASE_SETUP.md) - Local development
  - [VERCEL_DATABASE.md](VERCEL_DATABASE.md) - Technical details
