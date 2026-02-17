# AP-AI Manufacturing Quote Request System

A modern web application for collecting and managing manufacturing quote requests with user authentication, role-based access control, file uploads, and database integration.

## 🚀 Quick Start

**Two terminals required:**

```bash
# Terminal 1: API Server
npm run dev:api

# Terminal 2: Frontend
npm start
```

Access at **http://localhost:3000** and login with:
- **Email:** `admin@example.com`  
- **Password:** `password123`

See [Local Development Guide](./LOCAL_DEVELOPMENT.md) for detailed setup.

---

## 🚀 Features

### Core Functionality
- **Quote Request Form** - Comprehensive intake form for manufacturing projects
- **Submission History** - View and manage all submitted quotes (authenticated users)
- **User Management** - Admin interface for managing users and roles (admin/superadmin only)
- **Role-Based Access Control (RBAC)** - 5 user roles with granular permissions
- **User Authentication** - Secure login with JWT-like token authentication
- **File Upload** - Multi-file upload with progress tracking to Google Drive
- **Email Notifications** - Professional HTML email templates for quote notifications
- **Real-time Processing** - N8N webhook integration for automated workflows
- **Equipment Matching** - AI-powered capability analysis and machine matching
- **Cost Estimation** - Automated material and machining cost calculations
- **Lead Time Estimates** - Production and queue time calculations
- **Material Assessment** - Difficulty ratings and risk flags for exotic materials
- **Dark Mode** - Full theme support with system preference detection

### Technical Features
- ✨ Modern, responsive UI with Radix UI components
- 🎨 Tokenized design system with Swiss-style typography
- 🔐 Role-based access control with audit logging
- 📊 Vercel Postgres database integration (Neon)
- 🔌 N8N webhook integration
- 📁 File upload with progress tracking
- 🤖 AI-powered equipment capability analysis
- 🚀 Built with Vite, React 19, TypeScript
- 🧭 Browser history routing with SPA fallback

## 🏗️ Architecture

### Routing
- **Browser History Mode** - Clean URLs (`/history`, `/users`) with SPA fallback
- **Automatic Hash Migration** - Legacy `#/path` URLs automatically redirect to `/path`
- **Vercel Rewrites** - All non-API routes serve `index.html` for client-side routing
- **Protected Routes** - Role-based access control on `/history` and `/users`

### Authentication Flow
1. User logs in via `/api/auth/login`
2. Base64-encoded email token stored in localStorage
3. Token sent with API requests via Authorization header
4. Server-side RBAC middleware validates role and permissions
5. Client-side `useAuth` hook manages authentication state

### Data Flow
1. **Form Submission** → `/api/quote-requests` → Postgres + N8N webhook
2. **File Upload** → N8N → Google Drive → Drive link stored in DB
3. **History View** → `/api/quote-requests` → Filtered by user role
4. **User Management** → `/api/admin/users` → Admin/Superadmin only

## 🛠️ Tech Stack

### Frontend
- **Vite 7** - Build tool and dev server with HMR
- **React 19** - UI framework with latest features
- **TypeScript 5.9** - Type safety and developer experience
- **Tailwind CSS 3** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Infrastructure
- **Vercel Serverless Functions** - Production API endpoints
- **Vercel Postgres (Neon)** - Production database
- **N8N** - Workflow automation (webhook integration)
- **Google Drive API** - File storage

## 📋 Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment)
- N8N webhook URL (for file processing)
- Vercel Postgres database (auto-configured on Vercel)
- Google Drive API credentials (optional, for file storage)

## 🚀 Getting Started

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd ap-intake
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id
   # Database vars are auto-configured by Vercel
   ```

### Database Setup

Run migrations in order in your Vercel Postgres (Neon) dashboard:

1. **Core tables:**
   ```bash
   database/schema-postgres.sql     # Quote requests table
   database/schema-users.sql        # Users table
   ```

2. **RBAC and user features:**
   ```bash
   database/add-user-roles.sql      # Add role enum, last_login, audit_logs
   database/add-user-company-phone.sql  # Add company_name, phone fields
   database/add-test-user-flag.sql  # Add is_test_user flag for test data
   ```

3. **Equipment matching (optional):**
   ```bash
   database/add-capability-fields.sql   # Add capability analysis fields
   database/insert-equipment-postgres.sql  # Seed equipment data
   ```

### Default Test Users

Create initial admin user:
```sql
INSERT INTO users (email, password_hash, name, role, is_test_user)
VALUES 
  ('admin@example.com', 'password123', 'Admin User', 'superadmin', true);
```

**Note:** Password is stored in plain text for development. In production, use bcrypt hashing.

### Development

**Single Command (Recommended)**
```bash
npm start
# or: npm run dev:vercel
```
- Available at http://localhost:3000
- Runs both frontend (Vite) and API (Vercel Dev)
- Full database connectivity
- Real authentication
- Complete feature set

**Frontend Only (Limited)**
```bash
npm run dev
```
- Available at http://localhost:3000 (or next available port)
- Form submissions work (limited)
- No API/database features
- Good for UI development only

## 🔐 Authentication & Roles

### User Roles (Hierarchical)
1. **Guest** - System-assigned only, no manual assignment
2. **Sales** - Basic access
3. **Estimator** - Quote management
4. **Admin** - User management, full access except superadmin actions
5. **Superadmin** - Full system access, test user management

### Permissions
- `canViewHistory` - Access submission history
- `canManageUsers` - Manage user accounts (admin/superadmin)

### User Management UI
- **Location:** `/users` route (admin/superadmin only)
- **Features:**
  - View all users with details (name, company, email, phone, role, timestamps)
  - Create new users with invitation email
  - Edit existing users
  - Send login credentials via mailto link
  - Role assignment (guest role is system-only)

## 📁 Project Structure

```
ap-intake/
├── api/                      # Vercel Serverless Functions
│   ├── auth/
│   │   └── login.ts         # Authentication endpoint
│   ├── admin/
│   │   ├── users.ts         # User CRUD operations (admin/superadmin)
│   │   └── test-users.ts    # Test user management (superadmin)
│   ├── middleware/
│   │   └── rbac.ts          # RBAC middleware, auth, audit logging
│   ├── helpers/
│   │   └── guest-user.ts    # Guest user creation & claiming
│   ├── db.ts                # Database utilities
│   ├── quote-requests.ts    # Quote CRUD operations
│   ├── drive-link.ts        # Google Drive integration
│   ├── equipment.ts         # Equipment matching
│   └── analyze-capability.ts # AI capability analysis
├── src/
│   ├── components/
│   │   ├── ui/              # Radix UI components
│   │   ├── form-sections/   # Form component modules
│   │   ├── Layout.tsx       # Main layout with nav/auth
│   │   ├── LoginModal.tsx   # Authentication modal
│   │   ├── AddUserModal.tsx # Create user dialog
│   │   ├── EditUserModal.tsx # Edit user dialog
│   │   ├── RoleGate.tsx     # Permission-based rendering
│   │   └── SubmissionDialog.tsx  # Upload progress dialog
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state + RBAC
│   ├── services/            # API clients
│   ├── types/
│   │   ├── database.types.ts # Database models
│   │   └── user.types.ts     # User roles & permissions
│   ├── lib/
│   │   └── rbac.ts          # Frontend RBAC utilities
│   ├── App.tsx              # Quote request form
│   ├── SubmissionHistory.tsx # History view
│   ├── UserManagement.tsx   # User admin interface
│   └── Router.tsx           # Route handling
├── database/                # SQL migrations
│   ├── schema-postgres.sql  # Quote requests table
│   ├── schema-users.sql     # Users table
│   ├── add-user-roles.sql   # RBAC system
│   ├── add-user-company-phone.sql # Client info fields
│   ├── add-test-user-flag.sql # Test user management
│   ├── add-capability-fields.sql # Equipment matching
│   └── insert-equipment-postgres.sql # Equipment seed data
├── email-templates/         # Notification email templates
│   ├── quote-notification.html  # Responsive HTML template
│   ├── quote-notification.txt   # Plain text version
│   ├── sample-data.json         # Example template data
│   ├── generate-preview.js      # Preview generator script
│   ├── test-template.js         # Template validation script
│   ├── n8n-integration-example.js # n8n integration guide
│   └── README.md                # Full documentation
└── vercel.json             # Vercel configuration
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ success, user: { id, email, name, role, permissions } }`

### Quote Requests
- `POST /api/quote-requests` - Create new quote
- `GET /api/quote-requests` - List all quotes (authenticated)
- `PATCH /api/quote-requests/[id]/drive-link` - Update Google Drive link
- `POST /api/analyze-capability` - Run equipment capability analysis
  - Body: `{ quote_id, materials, quantity, certifications, description }`
  - Returns: Cost estimates, lead time, material difficulty, risk flags

### User Management (Admin/Superadmin)
- `GET /api/admin/users` - List users (add `?includeTestUsers=true` to include test users)
- `POST /api/admin/users` - Create new user
  - Body: `{ email, name, companyName?, phone?, role, password, isTestUser? }`
- `PATCH /api/admin/users` - Update user
  - Body: `{ userId, email?, name?, company_name?, phone?, role? }`

### Test User Management (Superadmin)
- `GET /api/admin/test-users` - List all test users
- `POST /api/admin/test-users` - Mark users as test users
  - Body: `{ userIds: [1, 2, 3] }`
- `DELETE /api/admin/test-users` - Bulk delete test users
  - Body: `{ confirm: "DELETE_ALL_TEST_USERS" }`

### Equipment Matching
- `GET /api/equipment` - List all equipment
- `POST /api/analyze-capability` - Analyze manufacturing requirements
  - Body: `{ quoteRequestId }`

## 📧 Email Notifications

Professional HTML email templates are available for notifying Autopilot when new quote requests are submitted.

**Templates included:**
- `email-templates/quote-notification.html` - Responsive HTML email
- `email-templates/quote-notification.txt` - Plain text version
- `email-templates/sample-data.json` - Example data for testing

**Quick start:**
```bash
cd email-templates

# Generate preview with sample data
node generate-preview.js
# Opens preview.html in your browser

# Test template validation
node test-template.js
```

**Email client compatibility:**
- ✅ Gmail, Apple Mail, Outlook 2016+
- ✅ Mobile responsive design
- ✅ Dark mode support
- ✅ Table-based layout for maximum compatibility

**Integration options:**
- n8n workflow (recommended)
- SendGrid API
- AWS SES
- Nodemailer

See [email-templates/README.md](./email-templates/README.md) for full documentation and integration examples.

## 🧪 Test Data Management

The system includes a test user flag to manage fake/demo data:

**Mark test users in SQL:**
```sql
UPDATE users SET is_test_user = TRUE 
WHERE email IN ('admin@example.com', 'user@example.com');
```

**Via API (superadmin only):**
```bash
# List test users
curl /api/admin/test-users -H "Authorization: Bearer <token>"

# Mark as test users
curl -X POST /api/admin/test-users \
  -H "Authorization: Bearer <token>" \
  -d '{"userIds": [1, 2, 3]}'

# Bulk delete all test users
curl -X DELETE /api/admin/test-users \
  -H "Authorization: Bearer <token>" \
  -d '{"confirm": "DELETE_ALL_TEST_USERS"}'
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** - Vercel auto-deploys on push to main
2. **Import to Vercel:** Connect your repository at vercel.com
3. **Configure Environment Variables:** Add database credentials (auto-added with Vercel Postgres)
4. **Add Postgres Database:** Storage tab → Create → Postgres
5. **Run Database Migrations:** Execute SQL files in Postgres dashboard (see DATABASE_MIGRATIONS.md)
6. **Create Admin User:** Run SQL to insert initial superadmin
7. **Verify Deployment:**
   - Check build logs for errors
   - Test routing: `/`, `/history`, `/users`
   - Verify API routes: `/api/auth/login`, `/api/quote-requests`
   - Test authentication and RBAC

### Environment Variables

**Required:**
- `POSTGRES_URL` - Database connection string (auto-configured by Vercel)
- `POSTGRES_PRISMA_URL` - Pooled connection (auto-configured)
- `POSTGRES_URL_NON_POOLING` - Direct connection (auto-configured)

**Optional:**
- `VITE_N8N_WEBHOOK_URL` - N8N webhook endpoint (if using N8N integration)

### Vercel Configuration

The `vercel.json` file configures:
```json
{
  "rewrites": [{
    "source": "/((?!api).*)",  // Exclude API routes
    "destination": "/index.html"  // SPA fallback
  }]
}
```

This ensures:
- All non-API routes serve the SPA
- Page refreshes work on any route
- Direct URL navigation works
- API routes are not intercepted

### Post-Deployment Checklist
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Login works
- [ ] User management accessible
- [ ] File uploads working
- [ ] History view accessible
- [ ] N8N webhook responding

## 🧪 Development Commands

```bash
# Development (requires 2 terminals)
npm run dev:api     # Terminal 1: API server (port 3001)
npm start            # Terminal 2: Frontend (port 3000)
# or: npm run dev

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Deployment
vercel deploy        # Deploy to preview
vercel --prod        # Deploy to production
vercel logs          # View production logs
```

**Login Credentials:**
- Local/Production: `admin@example.com` / `password123`

## ✅ Testing

**Before every commit affecting functionality**, complete the testing checklist:

```bash
# 1. Build
npm run build

# 2. Preview and test
npm run preview
# Open http://localhost:4173

# 3. Test navigation
# - Click through all routes
# - Verify views update
# - Test browser back/forward
# - Refresh on each route

# 4. Commit only if all tests pass
```

See [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for comprehensive testing procedures.

## 📚 Additional Documentation

### Core Documentation
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Pre-commit testing procedures (MANDATORY)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture
- **[DATABASE_MIGRATIONS.md](DATABASE_MIGRATIONS.md)** - Database schema and migrations
- **[LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)** - Local development setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[RBAC_GUIDE.md](RBAC_GUIDE.md)** - Role-based access control details

### Design System
- **[DESIGN_SYSTEM_FINAL.md](DESIGN_SYSTEM_FINAL.md)** - UI design system
- **[TYPOGRAPHY_SYSTEM.md](TYPOGRAPHY_SYSTEM.md)** - Typography tokens
- **[DESIGN_TOKENS.md](DESIGN_TOKENS.md)** - Color and spacing tokens

### Feature Documentation
- **[docs/CAPABILITY_ANALYSIS_VALUE_ASSESSMENT.md](docs/CAPABILITY_ANALYSIS_VALUE_ASSESSMENT.md)** - Capability analysis improvements
- **[docs/IMPLEMENTATION_SUMMARY_2026-02-02.md](docs/IMPLEMENTATION_SUMMARY_2026-02-02.md)** - Recent implementation details
- **[HISTORY_VIEW.md](HISTORY_VIEW.md)** - Submission history features

## 🔒 Security Notes

**⚠️ Important for Production:**
1. Replace plain text passwords with bcrypt hashing
2. Implement proper JWT token authentication
3. Add rate limiting to API endpoints
4. Enable HTTPS only
5. Add CSRF protection
6. Implement password reset flow
7. Add 2FA for admin accounts
8. Regular security audits

## 📄 License

Proprietary - All rights reserved
