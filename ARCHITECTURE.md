# System Architecture

Comprehensive architectural documentation for the AP-AI Manufacturing Quote Request System.

## Overview

Single-page application (SPA) built with React 19, TypeScript, and Vite, deployed on Vercel with serverless API functions and Postgres database.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React 19 SPA (Vite Build)                      │   │
│  │  - Browser History Routing                      │   │
│  │  - Authentication Context                       │   │
│  │  - Role-Based UI Components                     │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Network (CDN)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Static      │  │  Rewrites    │  │  Serverless  │ │
│  │  Assets      │  │  (SPA)       │  │  Functions   │ │
│  │  (dist/)     │  │              │  │  (/api/*)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Postgres (Neon)                      │
│  - quote_requests                                        │
│  - users (with RBAC)                                     │
│  - audit_logs                                            │
│  - equipment                                             │
└─────────────────────────────────────────────────────────┘
```

## 🧭 Routing Architecture

### Browser History Mode

**Implementation**: Custom React router using HTML5 History API

**Routes**:
- `/` - Quote request form (public)
- `/history` - Submission history (authenticated, `canViewHistory`)
- `/users` - User management (admin/superadmin only)

**Key Files**:
- `src/Router.tsx` - Route definitions and protection
- `src/components/Layout.tsx` - Navigation and route state
- `vercel.json` - Server-side SPA rewrite configuration

### Route Protection

```typescript
// Client-side protection
useEffect(() => {
  if (path === '/history' && !hasPermission('canViewHistory')) {
    window.history.pushState({}, '', '/');
    setPath('/');
  }
}, [path, hasPermission]);

// Server-side protection (API middleware)
export const requireAuth = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // ... validate token
};
```

### Vercel Rewrite Configuration

```json
{
  "rewrites": [{
    "source": "/((?!api).*)",
    "destination": "/index.html"
  }]
}
```

**Behavior**:
- ✅ `/` → serves `/index.html`
- ✅ `/history` → serves `/index.html` (React Router handles routing)
- ✅ `/users` → serves `/index.html`
- ✅ `/api/auth/login` → NOT intercepted, executes serverless function
- ✅ Legacy `/#/path` URLs → automatically migrated to `/path`

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User submits credentials
   ↓
2. POST /api/auth/login
   ↓
3. Server validates against users table
   ↓
4. Returns user object with role
   ↓
5. Client stores token (base64 email) in localStorage
   ↓
6. AuthContext provides user/role globally
   ↓
7. API requests include Authorization header
```

### Token Format

**Type**: Base64-encoded email (simplified JWT alternative)
```javascript
// Encoding
const token = Buffer.from(email).toString('base64');

// Decoding
const email = Buffer.from(token, 'base64').toString('utf-8');
```

**Storage**: `localStorage.setItem('user', JSON.stringify(user))`

### Role Hierarchy

```
superadmin (level 5)
    ↓
  admin (level 4)
    ↓
estimator (level 3)
    ↓
  sales (level 2)
    ↓
  guest (level 1)
```

### Permission Model

```typescript
const ROLE_PERMISSIONS = {
  superadmin: { canManageUsers: true, canViewHistory: true },
  admin:      { canManageUsers: true, canViewHistory: true },
  estimator:  { canManageUsers: false, canViewHistory: true },
  sales:      { canManageUsers: false, canViewHistory: false },
  guest:      { canManageUsers: false, canViewHistory: false },
};
```

### RBAC Middleware

**Location**: `api/middleware/rbac.ts`

**Functions**:
- `requireAuth()` - Validates authentication
- `requireRole()` - Validates minimum role level
- `logAudit()` - Logs user actions to audit_logs table

## 📊 Data Architecture

### Database Schema

#### users table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- Plain text in dev, bcrypt in prod
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(50),
  role user_role NOT NULL DEFAULT 'guest',
  can_view_history BOOLEAN DEFAULT FALSE,
  is_test_user BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### quote_requests table
```sql
CREATE TABLE quote_requests (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  materials TEXT[],
  processes TEXT[],
  finishes TEXT[],
  quantity INTEGER,
  timeline VARCHAR(100),
  drive_folder_link TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### audit_logs table
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Flow Patterns

#### Quote Submission
```
1. User fills form → FormData
2. Client validates required fields
3. POST /api/quote-requests
   - Insert into quote_requests table
   - Trigger N8N webhook (async)
4. N8N processes files → Google Drive
5. N8N updates quote_request with drive_folder_link
6. Success response to client
```

#### User Management
```
1. Admin navigates to /users
2. GET /api/admin/users (with auth token)
3. Middleware validates role (admin/superadmin)
4. Returns filtered users (hide test users by default)
5. Admin actions (create/edit/delete):
   - POST/PUT/DELETE /api/admin/users
   - Audit log created
   - Response returned
```

## 🎨 Frontend Architecture

### Component Structure

```
src/
├── main.tsx                    # App entry point
├── Router.tsx                  # Route definitions
├── App.tsx                     # Quote form (home)
├── SubmissionHistory.tsx       # History view
├── UserManagement.tsx          # User admin
├── components/
│   ├── Layout.tsx             # Header, navigation, user menu
│   ├── LoginModal.tsx         # Authentication dialog
│   ├── AddUserModal.tsx       # Create user dialog
│   ├── EditUserModal.tsx      # Edit user dialog
│   ├── RoleGate.tsx           # Permission-based rendering
│   ├── FeedbackWidget.tsx     # User feedback system
│   └── form-sections/         # Modular form components
│       ├── CompanyContactSection.tsx
│       ├── ProjectInformationSection.tsx
│       ├── MaterialRequirementsSection.tsx
│       └── ...
├── contexts/
│   └── AuthContext.tsx        # Global auth state
├── services/
│   ├── database.service.ts    # Database API client
│   ├── n8n.service.ts         # N8N webhook client
│   └── google.service.ts      # Google Drive API
├── lib/
│   ├── rbac.ts                # Client-side RBAC utilities
│   └── utils.ts               # Helper functions
└── types/
    ├── user.types.ts          # User, Role, Permission types
    └── database.types.ts      # Database model types
```

### State Management

**Global State**: React Context API
- `AuthContext` - User authentication and permissions

**Local State**: React useState/useReducer
- Form data
- UI state (modals, dropdowns)
- Loading states

**Server State**: Direct fetch calls (no React Query)
- API responses cached in component state
- Manual refetch on mutations

### Design System

**Base**: Tailwind CSS + Radix UI primitives

**Components**:
- `src/components/ui/` - Reusable UI components
  - `button.tsx`, `input.tsx`, `select.tsx`, etc.
  - Built on Radix UI for accessibility
  - Styled with Tailwind utilities

**Tokens**: CSS variables for theming
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}
```

## 🔌 API Architecture

### Serverless Functions

**Platform**: Vercel Serverless Functions (AWS Lambda)
**Runtime**: Node.js 18.x
**Location**: `/api/*`

#### Authentication Endpoints

**POST /api/auth/login**
```typescript
Request: { email: string, password: string }
Response: { user: User, token: string }
```

#### Quote Management

**GET /api/quote-requests**
- Lists all quotes (filtered by role)
- Estimator+ can view all
- Sales can only view their own

**POST /api/quote-requests**
- Creates new quote submission
- Public endpoint (no auth required)

**GET /api/quote-requests/:id**
- Gets single quote detail
- Role-based filtering

#### User Management

**GET /api/admin/users**
- Lists all users
- Requires admin/superadmin role
- Optional `?showTestUsers=true`

**POST /api/admin/users**
- Creates new user
- Validates role hierarchy
- Sends invitation email

**PUT /api/admin/users/:id**
- Updates user details
- Audit logged

**DELETE /api/admin/users/:id**
- Soft delete (sets inactive flag)
- Audit logged

#### Middleware Chain

```
Request → requireAuth() → requireRole() → Handler → Response
                ↓              ↓
           Validate       Check role
            token         level
                ↓              ↓
           Set req.user   Authorize
```

## 🚀 Build & Deployment

### Build Process

```bash
npm run build
  ↓
tsc -b  # TypeScript compilation check
  ↓
vite build  # Production bundle
  ↓
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
  └── [static files]
```

### Deployment Pipeline

```
1. Developer pushes to GitHub main branch
   ↓
2. Vercel webhook triggers build
   ↓
3. Build steps:
   - Install dependencies (npm install)
   - Run build command (npm run build)
   - Upload dist/ to CDN
   - Deploy serverless functions
   ↓
4. Deployment complete (~30-60 seconds)
   ↓
5. Automatic URL: https://ap-intake.vercel.app
```

### Environment Variables

**Development**: `.env` file (gitignored)
**Production**: Vercel dashboard → Settings → Environment Variables

**Required**:
- `POSTGRES_URL` (auto-configured with Vercel Postgres)
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

**Optional**:
- `VITE_N8N_WEBHOOK_URL` (for N8N integration)

## 🧪 Testing Strategy

### Current State
- No automated test suite
- Manual testing workflow
- TypeScript provides compile-time safety

### Recommended Testing Setup
```
tests/
├── unit/
│   ├── components/       # Component tests
│   ├── services/         # API client tests
│   └── lib/              # Utility function tests
├── integration/
│   ├── api/              # API endpoint tests
│   └── auth/             # Authentication flow tests
└── e2e/
    ├── quote-submission.spec.ts
    ├── user-management.spec.ts
    └── authentication.spec.ts
```

**Recommended Tools**:
- Vitest (unit/integration)
- React Testing Library (component)
- Playwright (E2E)

## 📈 Performance Considerations

### Bundle Size
- **Current**: 604 KB (171 KB gzipped)
- **Target**: < 200 KB gzipped

**Optimization Opportunities**:
```javascript
// 1. Code splitting by route
const UserManagement = lazy(() => import('./UserManagement'));
const SubmissionHistory = lazy(() => import('./SubmissionHistory'));

// 2. Manual chunks in vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom'],
        'ui': ['@radix-ui/react-*'],
      }
    }
  }
}
```

### Database Queries
- Use connection pooling (Vercel Postgres auto-configured)
- Index on frequently queried columns
- Limit result sets with pagination

### CDN & Caching
- Static assets cached at edge
- HTML served with `Cache-Control: no-cache`
- API responses not cached (dynamic data)

## 🔒 Security Architecture

### Current Implementation
- ✅ Base64 email tokens (simple authentication)
- ✅ Role-based access control
- ✅ Audit logging for admin actions
- ✅ Input validation on forms
- ✅ HTTPS enforced by Vercel

### Production Hardening Needed
- ⚠️ Replace plain text passwords with bcrypt
- ⚠️ Implement proper JWT tokens (signed)
- ⚠️ Add rate limiting to API endpoints
- ⚠️ Implement CSRF protection
- ⚠️ Add password reset flow
- ⚠️ Enable 2FA for admin accounts
- ⚠️ Regular security audits

### Recommended Security Stack
```
Rate Limiting: Upstash Redis
JWT: jsonwebtoken package
Password: bcrypt
CSRF: csurf middleware
2FA: speakeasy + qrcode
```

## 📚 Documentation Index

- `README.md` - Project overview and quick start
- `ARCHITECTURE.md` (this file) - System design
- `DATABASE_MIGRATIONS.md` - Database schema evolution
- `LOCAL_DEVELOPMENT.md` - Development environment setup
- `DEPLOYMENT.md` - Production deployment guide
- `RBAC_GUIDE.md` - Role-based access control details
- `DESIGN_SYSTEM_FINAL.md` - UI design system
- `TYPOGRAPHY_SYSTEM.md` - Typography tokens

## 🔄 Migration Notes

### Hash Routing → History Mode (2026-01-30)

**Change**: Switched from hash-based routing (`/#/path`) to browser history mode (`/path`)

**Impact**:
- ✅ Clean URLs
- ✅ Better SEO
- ✅ Professional appearance
- ✅ Backward compatible (auto-migration)

**Implementation**:
1. Updated `Router.tsx` to use `history.pushState`
2. Added hash URL migration on mount
3. Updated `Layout.tsx` navigation
4. Added Vercel rewrite rule in `vercel.json`

**Testing**:
```bash
# Test old hash URLs (should auto-redirect)
https://app.com/#/history → https://app.com/history

# Test page refresh (should work)
https://app.com/users → [refresh] → stays on /users

# Test API routes (should not be intercepted)
https://app.com/api/auth/login → executes serverless function
```

---

**Last Updated**: January 30, 2026
**Version**: 1.0.0
**Architecture Review Cycle**: Quarterly
