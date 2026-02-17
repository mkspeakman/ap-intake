# AP-Intake AI Context Document

**Last Updated**: February 1, 2026  
**Purpose**: Comprehensive context for AI agents to understand the project state and provide informed recommendations.

---

## 1. Project Overview

### What This Is
A **Manufacturing Quote Request System** built for Advanced Plastiform (AP), enabling customers to submit detailed RFQs (Request for Quote) with specifications, files, and requirements. The system captures complex manufacturing data and routes it through automated workflows.

### Business Domain
- **Industry**: Manufacturing (plastic injection molding, finishing, assembly)
- **Users**: External customers submitting quote requests + internal admins managing requests
- **Core Workflow**: Customer fills form → Data sent to n8n webhook → Stored in PostgreSQL → Admin reviews/processes

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: PostgreSQL (Neon)
- **Deployment**: Vercel (auto-deploy from GitHub main branch)
- **Automation**: n8n webhooks for workflow integration
- **Auth**: Token-based authentication with RBAC (Role-Based Access Control)

### Current Status
✅ **Production-ready** and deployed  
✅ Full RBAC with admin user management  
✅ Browser history routing with SPA fallback  
✅ Comprehensive form with file uploads  
✅ Database integration with proper schema  
✅ Automated deployment pipeline  

---

## 2. Architecture

### System Components

```
┌─────────────────┐
│   React SPA     │ ← Frontend (Vite dev server / Vercel CDN)
│  (Port 3000)    │
└────────┬────────┘
         │
         ├─── API Calls (fetch)
         │
┌────────▼────────────────────┐
│  Vercel Serverless Functions│ ← Backend API endpoints
│  /api/*                      │
└────────┬────────────────────┘
         │
         ├─── PostgreSQL (Neon)    ← Database
         ├─── n8n Webhook          ← Automation workflows
         └─── Google Drive API     ← File uploads
```

### Data Flow: Quote Request Submission

1. **User fills form** → Form data in React state
2. **File uploads** → Uploaded to Google Drive via `/api/drive-link.ts`
3. **Submit form** → POST to `/api/webhook.js`
4. **Webhook stores data** → INSERT into PostgreSQL `quote_requests` table
5. **Webhook forwards** → Sends to n8n for processing/notifications
6. **Admin views** → Admin accesses "Submission History" to review requests

### Routing Architecture

**Browser History Mode** with SPA fallback:
- Frontend: Custom router in `src/Router.tsx` with `window.history.pushState`
- Local Dev: Vite SPA middleware in `vite.config.ts`
- Production: Vercel rewrites in `vercel.json` (all routes → `/index.html` except `/api/*`)
- Legacy support: Hash URL migration for old bookmarks

---

## 3. Database Schema

### PostgreSQL Tables (Neon)

#### `quote_requests`
Primary table for all quote submissions.

```sql
CREATE TABLE quote_requests (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  project_name VARCHAR(255),
  project_description TEXT,
  part_name VARCHAR(255),
  part_number VARCHAR(255),
  material_type VARCHAR(255),
  material_spec TEXT,
  quantity INTEGER,
  timeline VARCHAR(255),
  secondary_operations JSONB,    -- Array of operations like assembly, packaging
  certifications JSONB,           -- Array of required certs (ISO, AS9100, etc.)
  finishing_requirements TEXT,
  special_requirements TEXT,
  files JSONB,                    -- Array of {name, url, driveId}
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Equipment matching fields
  equipment_capability TEXT,      -- AI analysis of required equipment
  matching_equipment JSONB,       -- Array of matched equipment IDs
  capability_score INTEGER        -- Confidence score 0-100
);
```

#### `users`
Authentication and user management.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'viewer',  -- 'admin', 'operator', 'viewer'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

#### `equipment`
Manufacturing equipment catalog for capability matching.

```sql
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),               -- 'molding', 'finishing', 'assembly', etc.
  capabilities TEXT,               -- Searchable description
  specifications JSONB,            -- Technical specs
  status VARCHAR(50) DEFAULT 'active'
);
```

### Key Relationships
- `quote_requests.matching_equipment` references `equipment.id` (array)
- `users.role` determines access level in RBAC system
- `quote_requests.files` stored as JSONB array with Google Drive links

---

## 4. API Endpoints

All API routes are Vercel serverless functions in `/api/` directory.

### Public Endpoints

#### `POST /api/webhook.js`
**Purpose**: Submit a new quote request  
**Auth**: None (public endpoint)  
**Body**:
```json
{
  "company_name": "Acme Corp",
  "contact_name": "John Doe",
  "email": "john@acme.com",
  "phone": "555-1234",
  "project_name": "Widget Housing",
  "project_description": "Plastic housing for widget...",
  "part_name": "Housing V2",
  "part_number": "WH-100",
  "material_type": "ABS",
  "quantity": 10000,
  "timeline": "4-6 weeks",
  "secondary_operations": ["assembly", "packaging"],
  "certifications": ["ISO 9001"],
  "finishing_requirements": "Smooth finish",
  "special_requirements": "FDA approved materials",
  "files": [{"name": "drawing.pdf", "url": "https://...", "driveId": "..."}]
}
```
**Response**: `200 OK` with `{ success: true, id: 123 }`

#### `POST /api/drive-link.ts`
**Purpose**: Upload files to Google Drive  
**Auth**: None (public endpoint)  
**Body**: `multipart/form-data` with file  
**Response**: `{ url: "https://drive.google.com/...", driveId: "..." }`

### Protected Endpoints (Require Auth Token)

#### `POST /api/auth/login.ts`
**Purpose**: Authenticate user and get token  
**Auth**: None  
**Body**: `{ email: "user@example.com", password: "..." }`  
**Response**: `{ token: "...", user: { id, email, name, role } }`

#### `GET /api/quote-requests.ts`
**Purpose**: List all quote requests  
**Auth**: Required (token in `Authorization: Bearer <token>`)  
**Query Params**: `?status=pending&limit=50`  
**Response**: Array of quote request objects

#### `GET /api/quote-requests/[id]/drive-link.ts`
**Purpose**: Get download link for files attached to quote request  
**Auth**: Required  
**Response**: `{ files: [{name, url, driveId}] }`

#### `POST /api/analyze-capability.ts`
**Purpose**: AI analysis to match quote requirements with equipment  
**Auth**: Required  
**Body**: `{ quoteRequestId: 123 }`  
**Response**: `{ capability: "...", matchingEquipment: [...], score: 85 }`

#### `GET /api/equipment.ts`
**Purpose**: List available manufacturing equipment  
**Auth**: Required  
**Response**: Array of equipment objects

#### `POST /api/feedback.ts`
**Purpose**: Submit user feedback via Feedback Fish  
**Auth**: None  
**Body**: `{ message: "...", metadata: {...} }`  
**Response**: `{ success: true }`

---

## 5. Authentication & Authorization

### RBAC Implementation

**Roles**:
- `admin` - Full access: manage users, view/edit all quotes, equipment management
- `operator` - View quotes, update status, view equipment
- `viewer` - Read-only access to quotes

**Role Enforcement**:
- Frontend: `AuthContext` provides `user` object with role
- Backend: Each API endpoint checks `Authorization` header token and verifies role
- Protected routes: Router redirects unauthenticated users to login

### Auth Flow

1. **Login**: User submits credentials → `/api/auth/login.ts` validates → returns JWT token
2. **Token Storage**: Token stored in `localStorage.getItem('token')`
3. **API Requests**: Frontend includes token in `Authorization: Bearer <token>` header
4. **Token Validation**: Backend verifies token signature and expiration
5. **Role Check**: Backend verifies user role meets endpoint requirements

### Auth Context (`src/contexts/AuthContext.tsx`)

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

### Test Users (Development)

```
admin@example.com / password123 (role: admin)
operator@example.com / password123 (role: operator)
viewer@example.com / password123 (role: viewer)
```

---

## 6. Frontend Components

### Component Hierarchy

```
App.tsx
├── Router.tsx (custom history-based routing)
│   ├── Layout.tsx (navigation, header, footer)
│   │   ├── LoginModal.tsx
│   │   └── FeedbackWidget.tsx
│   │
│   ├── [Main Form] (default route: /)
│   │   ├── ProjectInformationSection
│   │   ├── CompanyContactSection
│   │   ├── PartRequirementsSection
│   │   ├── MaterialRequirementsSection
│   │   ├── QuantityTimelineSection
│   │   ├── ProjectRequirementsSection
│   │   ├── FinishRequirementsSection
│   │   ├── CertificationSection
│   │   ├── FileUploadSection
│   │   │   └── FileUploadItem (multiple)
│   │   └── SubmissionDialog (success confirmation)
│   │
│   ├── SubmissionHistory.tsx (route: /history) [Protected: admin/operator]
│   │   └── Table with quote request list
│   │
│   └── [User Management] (route: /users) [Protected: admin only]
│       └── User list, add/edit forms
│
└── AuthContext.Provider (wraps entire app)
```

### Key UI Components (Radix + Tailwind)

Located in `src/components/ui/`:
- `button.tsx` - Primary UI button (Radix Button)
- `input.tsx` - Text inputs with validation states
- `select.tsx` - Dropdown selects (Radix Select)
- `textarea.tsx` - Multi-line text inputs
- `checkbox.tsx` - Checkboxes for certifications/operations
- `dialog.tsx` - Modal dialogs (Radix Dialog)
- `table.tsx` - Data tables for history view
- `badge.tsx` - Status badges (pending, approved, etc.)
- `progress.tsx` - File upload progress indicators
- `accordion.tsx` - Collapsible sections in form

### Form Validation

- Client-side validation before submission
- Required field checks
- Email format validation
- Phone number format validation
- File size limits (enforced in upload handler)

---

## 7. Routing System

### Custom Browser History Router

**Implementation**: `src/Router.tsx`

```typescript
// Uses native browser history API
window.history.pushState(state, '', path);

// Custom navigation event for cross-component updates
window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));

// Protected route logic
if (requiresAuth && !isAuthenticated) {
  return <Redirect to="/" />;
}
```

### Route Configuration

```typescript
const routes = {
  '/': { component: MainForm, protected: false },
  '/history': { component: SubmissionHistory, protected: true, roles: ['admin', 'operator'] },
  '/users': { component: UserManagement, protected: true, roles: ['admin'] }
};
```

### SPA Fallback Configuration

**Development** (`vite.config.ts`):
```typescript
export default defineConfig({
  appType: 'spa',  // Enables SPA middleware
  server: {
    proxy: {
      '/api': 'http://localhost:3000'  // Proxy API requests in dev
    }
  }
});
```

**Production** (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Navigation Component (`src/components/Layout.tsx`)

```typescript
const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
};

// Usage
<button onClick={() => navigate('/history')}>View History</button>
```

### Legacy Hash URL Migration

Automatically redirects old hash-based URLs:
- `/#/history` → `/history`
- `/#/users` → `/users`

Implemented in `Router.tsx` on initial mount.

---

## 8. Key Features

### ✅ Implemented & Working

1. **Comprehensive Quote Request Form**
   - Multi-section form with 8+ categories
   - File upload with progress indicators
   - Real-time validation
   - Success confirmation dialog

2. **File Upload System**
   - Upload to Google Drive via API
   - Multiple files supported
   - Progress tracking per file
   - File metadata stored in database

3. **Submission History Dashboard**
   - Paginated table of all quote requests
   - Filtering by status (pending, approved, rejected)
   - Search functionality
   - Download attached files
   - Admin/operator access only

4. **User Management**
   - CRUD operations for users
   - Role assignment (admin/operator/viewer)
   - Password management
   - Admin-only access

5. **Authentication & RBAC**
   - Login modal with token-based auth
   - Role-based route protection
   - Persistent sessions (localStorage)
   - Automatic logout on token expiration

6. **Equipment Capability Matching**
   - AI-powered analysis of quote requirements
   - Match requirements to available equipment
   - Confidence scoring (0-100)
   - Admin can view matching results

7. **Browser History Routing**
   - Clean URLs (no hash)
   - SPA fallback for direct navigation
   - Page refresh support
   - Back/forward button support

8. **Feedback Widget**
   - Integrated Feedback Fish
   - User feedback collection
   - Accessible on all pages

9. **Responsive Design**
   - Mobile-first Tailwind CSS
   - Tablet and desktop layouts
   - Touch-friendly interactions

10. **Deployment Pipeline**
    - Auto-deploy from GitHub main branch
    - Vercel serverless functions
    - Environment variables for secrets
    - Pre-commit testing hooks

---

## 9. Development Workflow

### Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm start    # → http://localhost:3000 (Vercel Dev - Recommended)
npm run dev  # → http://localhost:3000 (Vite only)

# Build for production
npm run build

# Preview production build locally
npm run preview  # → http://localhost:4173
```

### Environment Variables

Create `.env` file in project root:

```bash
# Database (Neon PostgreSQL)
POSTGRES_URL="postgresql://user:password@host/dbname"
POSTGRES_PRISMA_URL="postgresql://user:password@host/dbname?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host/dbname"

# Google Drive API
GOOGLE_DRIVE_API_KEY="..."
GOOGLE_DRIVE_FOLDER_ID="..."

# n8n Webhook
N8N_WEBHOOK_URL="https://..."

# Auth
JWT_SECRET="..."
```

### Git Workflow

```bash
# Make changes
git add .
git commit -m "Description"

# Pre-commit hook will prompt:
# "Have you completed testing checklist? (y/n)"

# Push to deploy
git push origin main  # Auto-deploys to Vercel
```

### Pre-Commit Testing Checklist

Located in `TESTING_CHECKLIST.md`:

1. ✅ `npm run build` - No errors
2. ✅ `npm run preview` - Test navigation
3. ✅ All routes update views correctly
4. ✅ Page refresh works on all routes
5. ✅ No console errors
6. ✅ Login/logout works
7. ✅ Protected routes redirect correctly
8. ✅ Form submission succeeds
9. ✅ File uploads work

### Testing Commands

```bash
# Run test scripts
node test-validation.js   # Test form validation
node test-webhook.js      # Test webhook endpoint
node test-visual.js       # Visual regression tests
node test-proxy.js        # Test API proxy
```

---

## 10. Deployment

### Vercel Configuration

**Project Root**: `~/dev/ap-intake`  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### Vercel Environment Variables

Set in Vercel dashboard:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `GOOGLE_DRIVE_API_KEY`
- `GOOGLE_DRIVE_FOLDER_ID`
- `N8N_WEBHOOK_URL`
- `JWT_SECRET`

### Deployment Process

1. **Local changes** → Commit to `main` branch
2. **Push to GitHub** → Triggers Vercel build
3. **Vercel builds** → Runs `npm run build`
4. **Vercel deploys** → Serverless functions + static assets
5. **Live in ~2-3 minutes**

### Post-Deploy Verification

1. Visit production URL
2. Test navigation across all routes
3. Test form submission
4. Test file upload
5. Test login/logout
6. Check browser console for errors

---

## 11. Testing Strategy

### Current Approach

**Manual Testing** (primary):
- Pre-commit checklist enforced via git hook
- Manual navigation testing
- Form validation testing
- File upload testing
- Cross-browser testing (Chrome, Safari, Firefox)

**Automated Scripts** (basic):
- `test-validation.js` - Form field validation
- `test-webhook.js` - API endpoint tests
- `test-visual.js` - Screenshot comparison
- `test-proxy.js` - Dev server proxy tests

### Testing Gaps (Future)

- [ ] Unit tests (Jest/Vitest)
- [ ] Integration tests (React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] API contract tests
- [ ] Load testing for webhook endpoint
- [ ] Accessibility testing (automated)

---

## 12. Known Issues & Limitations

### Current Limitations

1. **No Email Notifications**
   - Quote submissions don't send confirmation emails
   - Admins not notified of new submissions
   - Consider: Integrate SendGrid or similar

2. **Limited Search/Filter**
   - Submission history has basic filtering only
   - No full-text search across quote requests
   - No advanced filtering (date range, material type, etc.)

3. **No Quote Response System**
   - Admins can view quotes but can't send responses in-app
   - No pricing/timeline response workflow
   - Consider: Add quote response form

4. **File Storage Dependency**
   - Relies on Google Drive API
   - No fallback if Drive API fails
   - Consider: Add direct blob storage (Vercel Blob, S3)

5. **No Real-Time Updates**
   - Submission history requires manual refresh
   - Consider: WebSocket or polling for live updates

6. **Basic User Management**
   - No password reset flow
   - No email verification
   - No audit log of user actions

7. **Equipment Matching Not Fully Automated**
   - Requires manual trigger via API call
   - Not integrated into submission workflow
   - Consider: Auto-trigger on quote submission

### Security Considerations

- ✅ JWT tokens for auth
- ✅ CORS configured for API endpoints
- ✅ Input validation on backend
- ⚠️ No rate limiting on public endpoints
- ⚠️ No CAPTCHA on quote form
- ⚠️ Passwords hashed but no 2FA option

---

## 13. Future Considerations

### Potential Enhancements

**User Experience**:
- Email notifications for quote status updates
- In-app messaging between customers and admins
- Quote history dashboard for customers (customer portal)
- Mobile app (React Native)

**Business Logic**:
- Automated pricing calculation based on requirements
- Quote approval workflow (multi-stage review)
- Equipment scheduling/availability tracking
- Customer order tracking post-quote acceptance

**Technical Improvements**:
- Migrate to Next.js for SSR/SSG benefits
- Add Redis for caching frequently accessed quotes
- Implement GraphQL for more flexible API queries
- Add WebSocket for real-time collaboration
- Implement CDN for file uploads (Cloudinary, Imgix)

**Analytics & Insights**:
- Quote conversion metrics (submitted → accepted)
- Popular material/finish combinations
- Average quote turnaround time
- Equipment utilization reports

**Integrations**:
- ERP system integration (QuickBooks, SAP, etc.)
- CRM integration (Salesforce, HubSpot)
- Calendar integration for timeline coordination
- Payment gateway for deposits/invoices

---

## 14. Critical Files Reference

### Must-Understand Files

```
~/dev/ap-intake/
├── src/
│   ├── Router.tsx             # Custom routing logic
│   ├── App.tsx                # Root component
│   ├── main.tsx               # React entry point
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   └── components/
│       ├── Layout.tsx          # Navigation wrapper
│       └── form-sections/      # Form component library
│
├── api/
│   ├── webhook.js             # Main quote submission endpoint
│   ├── auth/login.ts          # Authentication endpoint
│   ├── quote-requests.ts      # List quotes endpoint
│   └── db.ts                  # Database connection helper
│
├── database/
│   ├── schema-postgres.sql    # PostgreSQL schema
│   └── schema-users.sql       # Users table schema
│
├── vite.config.ts             # Vite configuration (SPA mode)
├── vercel.json                # Vercel deployment config
├── tailwind.config.js         # Tailwind CSS config
└── package.json               # Dependencies & scripts
```

### Configuration Files

- `vite.config.ts` - Dev server, build settings, API proxy
- `vercel.json` - Routing rewrites, API exclusions
- `tailwind.config.js` - Design system tokens, theme
- `tsconfig.json` - TypeScript compiler options
- `.env` - Environment variables (local only, not committed)

### Documentation Files

- `README.md` - Project overview and setup instructions
- `TESTING_CHECKLIST.md` - Pre-deploy manual test checklist
- `DEPLOYMENT_READY.md` - Deployment readiness assessment
- `DESIGN_SYSTEM_FINAL.md` - Design tokens and UI guidelines
- `VERCEL_DATABASE.md` - Database setup instructions
- `ACCESSIBILITY_ANALYSIS.md` - Accessibility audit results

---

## 15. Questions for AI Agents to Consider

When analyzing this project, consider:

1. **Architecture**: Is the serverless function approach optimal for this use case? Should we migrate to a traditional Node.js server?

2. **Database**: Are there missing indexes that would improve query performance? Should we add database migrations?

3. **Security**: What additional security measures should be implemented for a production manufacturing system?

4. **User Experience**: What friction points exist in the quote submission flow? How can we reduce form abandonment?

5. **Scalability**: If quote volume grows 10x, what bottlenecks will emerge? How do we prepare?

6. **Integration**: What third-party services would add the most value? (Payment, CRM, ERP, etc.)

7. **Testing**: What testing strategy would give the highest ROI for this codebase?

8. **Accessibility**: Are there WCAG compliance gaps that need addressing?

9. **Performance**: Are there opportunities for code splitting, lazy loading, or caching?

10. **Developer Experience**: How can we improve the development workflow and documentation?

---

## 16. Getting Help from This Document

### For Code Reviews
Focus on sections: Architecture, API Endpoints, Frontend Components

### For Feature Recommendations
Focus on sections: Known Issues & Limitations, Future Considerations

### For Security Audit
Focus on sections: Authentication & Authorization, API Endpoints, Security Considerations

### For Performance Optimization
Focus on sections: Database Schema, Architecture, Deployment

### For UX Improvements
Focus on sections: Frontend Components, User Experience (Future Considerations)

---

**End of AI Context Document**

*This document should be updated as the project evolves. Last updated: February 1, 2026*
