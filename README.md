# AP-AI Manufacturing Quote Request System

A modern web application for collecting and managing manufacturing quote requests with user authentication, role-based access control, file uploads, and database integration.

## 🚀 Features

### Core Functionality
- **Quote Request Form** - Comprehensive intake form for manufacturing projects
- **Submission History** - View and manage all submitted quotes (authenticated users)
- **User Management** - Admin interface for managing users and roles (admin/superadmin only)
- **Role-Based Access Control (RBAC)** - 5 user roles with granular permissions
- **User Authentication** - Secure login with JWT-like token authentication
- **File Upload** - Multi-file upload with progress tracking to Google Drive
- **Real-time Processing** - N8N webhook integration for automated workflows
- **Equipment Matching** - AI-powered capability analysis and machine matching

### Technical Features
- ✨ Modern, responsive UI with Radix UI components
- 🎨 Tokenized design system with Swiss-style typography
- 🔐 Role-based access control with audit logging
- 📊 Vercel Postgres database integration (Neon)
- 🔌 N8N webhook integration
- 📁 File upload with progress tracking
- 🤖 AI-powered equipment capability analysis
- 🚀 Built with Vite, React 19, TypeScript

## 🛠️ Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 19** - UI framework with latest features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
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

**Option 1: Full Stack (Recommended)**
```bash
# Terminal 1: Start Vercel serverless functions
vercel dev

# Terminal 2: Start Vite dev server
npm run dev
```
- Vite: http://localhost:5173 (frontend)
- Vercel: http://localhost:3000 (API proxy)
- Full database connectivity
- Real authentication
- Complete feature set

**Option 2: Frontend Only (Limited)**
```bash
npm run dev
```
- Available at http://localhost:5173
- Form submissions work
- No database features
- Authentication uses mock data

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
- `GET /api/quote-requests/[id]/drive-link` - Get Google Drive link for quote files

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

1. **Push to GitHub**
2. **Import to Vercel:** Connect your repository at vercel.com
3. **Configure Environment Variables:** Add `VITE_N8N_WEBHOOK_URL`
4. **Add Postgres Database:** Storage tab → Create → Postgres
5. **Run Database Migrations:** Execute SQL files in Postgres dashboard (in order listed above)
6. **Create Admin User:** Run SQL to insert initial superadmin
7. **Deploy:** Push to main branch or trigger manual deploy

### Environment Variables

**Required:**
- `VITE_N8N_WEBHOOK_URL` - Your N8N webhook endpoint

**Auto-configured by Vercel:**
- `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`

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
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
vercel dev           # Start Vercel serverless (port 3000)
vercel logs          # View production logs
```

## 📚 Additional Documentation

- `TYPOGRAPHY_SYSTEM.md` - Typography tokens and font swapping
- `DESIGN_SYSTEM_FINAL.md` - Design system implementation
- `DATABASE_SETUP.md` - Database schema details
- `VERCEL_SETUP.md` - Vercel deployment guide
- `DEPLOYMENT_READY.md` - Deployment readiness checklist
- `ACCESSIBILITY_ANALYSIS.md` - Accessibility compliance

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
