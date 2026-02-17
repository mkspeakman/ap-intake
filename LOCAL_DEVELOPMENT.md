# Local Development Setup Guide

Complete guide for setting up the AP-AI Manufacturing Quote Request System for local development.

## 🔑 Local Login Credentials

When running locally, use these database test credentials:

- **Email:** `admin@example.com`
- **Password:** `password123`

Or:

- **Email:** `user@example.com`
- **Password:** `password123`

> **Note:** If login stalls or hangs, check the browser console for errors. The app uses a 10-second timeout for login requests.

## Prerequisites

- **Node.js 18+** and npm
- **Git** for version control
- **Vercel CLI** for local database access
- **Neon/Vercel Postgres** account (for database)
- **Code Editor** (VS Code recommended)

## Quick Start

You need **two terminal windows** running simultaneously:

### Terminal 1: API Server
```bash
npm run dev:api
```
Starts Vercel serverless functions on **port 3001**

### Terminal 2: Frontend
```bash
npm start
```
Starts Vite dev server on **port 3000** (proxies API to 3001)

**Access at:** http://localhost:3000

**Login with:** `admin@example.com` / `password123`

### Environment Setup (Optional - for new clones)

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Link to Vercel project and pull environment variables
vercel link
vercel env pull
```

This creates `.env.local` with database credentials. Already configured in this project.

## Application Architecture

### Routing System

**Browser History Mode** - The app uses clean URLs without hash fragments:
- ✅ `/` - Home (quote request form)
- ✅ `/history` - Submission history (authenticated users only)
- ✅ `/users` - User management (admin/superadmin only)

**How it works:**
1. Client-side routing via React Router (custom implementation)
2. Vite dev server automatically handles SPA routing
3. Vercel production uses rewrite rules in `vercel.json`
4. Legacy hash URLs (`#/path`) auto-migrate to clean URLs

**Protected Routes:**
- Routes check authentication and permissions before rendering
- Unauthorized users redirect to home (`/`)
- RBAC middleware validates on both client and server

## Detailed Setup

### 1. Install Dependencies

```bash
npm install
```

**Key dependencies:**
- React 19 (UI framework)
- Vite (build tool)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Radix UI (components)
- Vercel Postgres SDK

### 2. Database Setup

#### Option A: Use Existing Vercel Project

```bash
# Link to existing Vercel project
vercel link

# Pull environment variables (includes database credentials)
vercel env pull
```

#### Option B: Create New Database

1. Go to https://console.neon.tech
2. Create new project
3. Copy connection string
4. Create `.env` file:

```bash
# .env
POSTGRES_URL="postgresql://user:password@host/database"
POSTGRES_PRISMA_URL="postgresql://user:password@host/database?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host/database"
VITE_N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/your-id"
```

#### Run Migrations

In your Neon/Vercel Postgres SQL editor, run migrations in order:

```sql
-- 1. Core tables
\i database/schema-postgres.sql
\i database/schema-users.sql

-- 2. RBAC system
\i database/add-user-roles.sql
\i database/add-user-company-phone.sql
\i database/add-test-user-flag.sql

-- 3. Optional: Equipment matching
\i database/add-capability-fields.sql
\i database/insert-equipment-postgres.sql
```

Or copy/paste SQL content from each file.

#### Create Test Admin User

```sql
INSERT INTO users (email, password_hash, name, role, is_test_user)
VALUES 
  ('admin@example.com', 'password123', 'Test Admin', 'superadmin', true);
```

### 3. Start Development Servers

You need **TWO terminal windows** running concurrently:

#### Terminal 1: Vercel Serverless Functions (API)
```bash
npm run dev:api
```
- Runs on port 3001
- Provides API endpoints at `/api/*`
- Database connectivity

#### Terminal 2: Vite Dev Server (Frontend)
```bash
npm start
# or: npm run dev
```
- Runs on port 3000
- Hot module reloading
- React app with fast refresh
- Proxies `/api/*` requests to port 3001

**Access:**
- Application: http://localhost:3000
- API (direct): http://localhost:3001/api/*

### 4. Login and Test

1. Open http://localhost:3000
2. Click user icon in header
3. Login with database credentials:
   - **Admin:** `admin@example.com` / `password123`
   - **User:** `user@example.com` / `password123`
4. Verify authentication and protected routes work
5. Check `/history` and `/users` pages (if authorized)

## Development Workflow

### Making Changes

**Frontend changes:**
- Edit files in `src/`
- Vite hot-reloads automatically
- Check browser console for errors

**API changes:**
- Edit files in `api/`
- Vercel dev auto-restarts
- Check terminal for errors

**Database changes:**
- Create new `.sql` file in `database/`
- Run in Neon SQL editor
- Update `DATABASE_MIGRATIONS.md`

### Testing Features

**User Management:**
1. Login as admin/superadmin
2. Navigate to `/users`
3. Test create, edit, role assignment
4. Verify email mailto links work

**Quote Submission:**
1. Fill out form at `/`
2. Upload test files
3. Submit quote
4. Check `/history` for submission
5. Verify N8N webhook receives data

**RBAC Testing:**
1. Create users with different roles
2. Login as each role
3. Verify navigation changes
4. Test permission restrictions

## Environment Variables

### Required for Development

```bash
# .env or .env.local
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id

# Database (from Vercel)
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
```

### Optional

```bash
# Google Drive API (if using file storage)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Common Issues

### Login Stalls or Hangs

**Symptoms:** Login button stays in "Signing in..." state indefinitely.

**Solutions:**
1. Make sure **BOTH** terminals are running:
   - Terminal 1: `npm run dev:api` (port 3001)
   - Terminal 2: `npm start` (port 3000)
2. Check browser console for errors (F12)
3. Use correct credentials: `admin@example.com` / `password123`
4. Check Network tab for failed `/api/auth/login` requests
5. Restart both servers if needed

**Timeout:** Login has a 10-second timeout to prevent infinite hanging.

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or let Vercel use next available port
npm start  # Will auto-increment if 3000 is busy
```

### Database Connection Errors

```bash
# Verify environment variables
vercel env pull

# Test connection
node -e "const { sql } = require('@vercel/postgres'); sql\`SELECT NOW()\`.then(r => console.log(r.rows))"
```

### CORS Errors

CORS is configured in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working

```bash
# Restart Vite dev server
# Press 'r' in terminal to force reload
# Or restart with:
npm run dev
```

## Database Management

### View Users
```sql
SELECT id, email, name, role, is_test_user, created_at
FROM users
ORDER BY created_at DESC;
```

### View Quotes
```sql
SELECT id, project_title, company_name, status, created_at
FROM quote_requests
ORDER BY created_at DESC
LIMIT 10;
```

### View Audit Logs
```sql
SELECT u.email, al.action, al.resource_type, al.created_at
FROM audit_logs al
JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 20;
```

### Reset Test Data
```bash
# In Neon SQL editor:
DELETE FROM audit_logs WHERE user_id IN (SELECT id FROM users WHERE is_test_user = TRUE);
DELETE FROM quote_requests WHERE created_by IN (SELECT email FROM users WHERE is_test_user = TRUE);
DELETE FROM users WHERE is_test_user = TRUE;
```

## Testing Checklist

Before committing changes:

- [ ] `npm run build` succeeds
- [ ] TypeScript types compile without errors
- [ ] Login/logout works
- [ ] User management CRUD operations work
- [ ] Quote submission saves to database
- [ ] File uploads complete successfully
- [ ] History view loads and displays data
- [ ] Role-based navigation correct
- [ ] Audit logs record actions
- [ ] No console errors in browser
- [ ] No errors in terminal logs

## Project Structure Quick Reference

```
src/
├── components/
│   ├── ui/              # Radix UI components (Button, Input, etc.)
│   ├── form-sections/   # Quote form sections
│   ├── Layout.tsx       # Header, nav, user menu
│   ├── LoginModal.tsx   # Login dialog
│   ├── AddUserModal.tsx # Create user dialog
│   └── EditUserModal.tsx # Edit user dialog
├── contexts/
│   └── AuthContext.tsx  # Auth state + RBAC
├── services/
│   └── *.service.ts     # API clients
├── types/
│   ├── database.types.ts # DB models
│   └── user.types.ts     # User roles
├── App.tsx              # Quote form (main page)
├── SubmissionHistory.tsx # Quote history
├── UserManagement.tsx   # User admin UI
└── Router.tsx           # Route handling

api/
├── auth/
│   └── login.ts         # POST /api/auth/login
├── admin/
│   ├── users.ts         # User CRUD
│   └── test-users.ts    # Test user management
├── middleware/
│   └── rbac.ts          # Auth + permissions
└── quote-requests.ts    # Quote CRUD
```

## Useful Commands

```bash
# Development
npm run dev              # Vite dev server
vercel dev               # Serverless functions + DB
npm run build            # Production build
npm run preview          # Preview build

# Vercel CLI
vercel env pull          # Pull environment variables
vercel logs              # View production logs
vercel link              # Link to Vercel project

# Database
vercel postgres connect  # Connect to database CLI

# Code Quality
npm run type-check       # TypeScript check
npm run lint             # ESLint check

# Git
git status               # Check changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to remote
```

## Next Steps

1. **Set up N8N webhook** - For automated quote processing
2. **Configure Google Drive** - For file storage
3. **Implement bcrypt** - Replace plain text passwords
4. **Add email service** - For invitation emails
5. **Set up monitoring** - Error tracking and analytics
6. **Write tests** - Unit and integration tests
7. **Configure CI/CD** - Automated testing and deployment

## Support

- Check `README.md` for features and architecture
- See `DATABASE_MIGRATIONS.md` for migration details
- Review `DESIGN_SYSTEM_FINAL.md` for UI components
- Read `DEPLOYMENT_READY.md` for production deployment

For issues, check console logs and Vercel function logs for error details.
