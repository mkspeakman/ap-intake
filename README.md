# AP-AI Manufacturing Quote Request System

A modern web application for collecting and managing manufacturing quote requests with user authentication, file uploads, and database integration.

## 🚀 Features

### Core Functionality
- **Quote Request Form** - Comprehensive intake form for manufacturing projects
- **Submission History** - View and manage all submitted quotes (authenticated users)
- **User Authentication** - Login system with role-based permissions
- **File Upload** - Multi-file upload with progress tracking to Google Drive
- **Real-time Processing** - N8N webhook integration for automated workflows

### Technical Features
- ✨ Modern, responsive UI with shadcN components
- 🎨 Tokenized design system with customizable typography
- 🔐 Role-based access control (RBAC)
- 📊 Vercel Postgres database integration
- 🔌 N8N webhook integration
- 📁 File upload with progress tracking
- 🚀 Built with Vite, React 19, TypeScript

## 🛠️ Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 19** - UI framework with latest features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcN UI** - Component library (Radix UI primitives)
- **Lucide React** - Icon library

### Backend & Infrastructure
- **Vercel Serverless Functions** - Production API endpoints
- **Vercel Postgres** - Production database (Neon)
- **N8N** - Workflow automation (webhook integration)
- **Google Drive API** - File storage

## 📋 Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment)
- N8N webhook URL (for file processing)
- Vercel Postgres database (auto-configured on Vercel)

## 🚀 Getting Started

### Installation

1. **Clone and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update \`.env\` with your N8N webhook URL:
   \`\`\`
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id
   \`\`\`

### Development

**Option 1: Local Development (without database)**
\`\`\`bash
npm run dev
\`\`\`
- Available at http://localhost:5173
- Form submissions work
- History view shows "no database" message
- Authentication uses mock data

**Option 2: Vercel Dev (with database)**
\`\`\`bash
vercel dev
\`\`\`
- Available at http://localhost:3000
- Full database connectivity
- Real authentication
- Complete feature set

### Database Setup

Run these SQL files in your Vercel Postgres dashboard:

1. **Quote requests table:**
   \`\`\`bash
   database/schema-postgres.sql
   \`\`\`

2. **Users table (for authentication):**
   \`\`\`bash
   database/schema-users.sql
   \`\`\`

### Default Test Credentials

**Local development** (\`npm run dev\`):
- Email: \`test@example.com\`
- Password: \`password\`

**Production/Vercel dev** - Add users manually to database

## 📁 Project Structure

\`\`\`
ap-intake/
├── api/                      # Vercel Serverless Functions
│   ├── auth/
│   │   └── login.ts         # Authentication endpoint
│   ├── db.ts                # Database utilities
│   ├── quote-requests.ts    # Quote CRUD operations
│   └── drive-link.ts        # Google Drive integration
├── src/
│   ├── components/
│   │   ├── ui/              # shadcN UI components
│   │   ├── form-sections/   # Form component modules
│   │   ├── Layout.tsx       # Main layout with nav/auth
│   │   ├── LoginModal.tsx   # Authentication modal
│   │   └── SubmissionDialog.tsx  # Upload progress dialog
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── services/            # API clients
│   ├── types/               # TypeScript definitions
│   ├── App.tsx              # Quote request form
│   ├── SubmissionHistory.tsx # History view
│   └── Router.tsx           # Route handling
├── database/                # SQL schema files
├── public/                  # Static assets
└── vercel.json             # Vercel configuration
\`\`\`

## 🔐 Authentication & Permissions

### User Roles
Users in the database have permissions:
- \`can_view_history\` - Access to submission history page

### Navigation Behavior
- **Not authenticated:** Only form view available, user icon shows login modal
- **Authenticated (no history permission):** Form view + user dropdown
- **Authenticated (with history permission):** Form view + History view + user dropdown

### Adding Users
\`\`\`sql
INSERT INTO users (email, password_hash, name, can_view_history)
VALUES 
  ('user@example.com', 'hashed-password', 'User Name', true);
\`\`\`

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
2. **Import to Vercel:** Connect your repository at vercel.com
3. **Configure Environment Variables:** Add \`VITE_N8N_WEBHOOK_URL\`
4. **Add Postgres Database:** Storage tab → Create → Postgres
5. **Run Database Migrations:** Execute SQL files in Postgres dashboard

### Environment Variables

**Required:**
- \`VITE_N8N_WEBHOOK_URL\` - Your N8N webhook endpoint

**Auto-configured by Vercel:**
- \`POSTGRES_URL\`, \`POSTGRES_PRISMA_URL\`, \`POSTGRES_URL_NON_POOLING\`

## 📝 API Endpoints

### Quote Requests
- \`POST /api/quote-requests\` - Create new quote
- \`GET /api/quote-requests\` - List all quotes (authenticated)

### Authentication
- \`POST /api/auth/login\` - User login

## 🧪 Development Commands

\`\`\`bash
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
vercel dev           # Start with database connection (port 3000)
\`\`\`

## 📚 Documentation

- \`TYPOGRAPHY_SYSTEM.md\` - Typography tokens and font swapping
- \`DATABASE_SETUP.md\` - Database schema details
- \`VERCEL_SETUP.md\` - Vercel deployment guide

## 📄 License

Proprietary - All rights reserved
