# AP Intake - Quote Request Application

A modern single-page web application built with Vite, React, TypeScript, Tailwind CSS, and shadCN UI for collecting customer quote requests.

## Features

- ✨ Modern, responsive UI with shadCN components
- 🎨 Tailwind CSS for styling
- 📝 Modular form with 8 separate components
- 📊 Database integration (SQLite local, PostgreSQL production)
- 🔌 n8n webhook integration with Google Drive
- 📁 File upload with progress tracking
- 🎯 Database-first submission strategy for reliability
- 🚀 Fast development with Vite and HMR

## Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadCN UI** - Component library (Radix UI primitives)
- **Axios** - HTTP client for API requests

### Backend
- **Express.js** - Local development server
- **SQLite** (better-sqlite3) - Local database
- **PostgreSQL** (Neon) - Production database on Vercel
- **Vercel Serverless Functions** - Production API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment variables file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your API credentials:
   - `VITE_N8N_WEBHOOK_URL` - Your N8N webhook URL
   - `VITE_GOOGLE_API_KEY` - Your Google API key (if using)
   - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth client ID (if using)

### Development

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Setup and start the backend server:**
   ```bash
   cd server
   npm install
   npm run init-db  # Creates SQLite database
   npm run dev      # Starts server on http://localhost:3001
   ```

3. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev  # Available at http://localhost:5173
   ```

The Vite dev proxy automatically routes:
- `/api/webhook` → n8n webhook (file uploads)
- `/api/*` → Local Express server (database operations)

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
ap-intake/
├── api/                          # Vercel serverless functions (production)
│   ├── quote-requests.ts         # Create/list quotes
│   ├── quote-requests/[id]/
│   │   └── drive-link.ts         # Update Drive links
│   ├── db.ts                     # Database helpers
│   └── webhook.js                # n8n CORS proxy
├── database/
│   ├── schema.sql                # SQLite schema (local)
│   └── schema-postgres.sql       # PostgreSQL schema (Vercel)
├── server/                       # Express backend (local dev)
│   ├── index.ts                  # API routes
│   └── package.json
├── src/
│   ├── components/
│   │   ├── form-sections/        # 8 modular form components
│   │   └── ui/                   # shadCN UI components
│   ├── lib/
│   │   ├── api-client.ts         # Axios configuration
│   │   └── utils.ts              # Utility functions
│   ├── services/
│   │   ├── database.service.ts   # Database API calls
│   │   ├── n8n.service.ts        # n8n webhook integration
│   │   └── google.service.ts     # Google API (future)
│   ├── types/
│   │   └── database.types.ts     # TypeScript types
│   ├── App.tsx                   # Main form orchestration
│   └── main.tsx                  # Application entry point
├── DATABASE_SETUP.md             # Local database guide
├── VERCEL_DATABASE.md            # Production deployment guide
└── package.json
```

## Architecture

### Database-First Submission Strategy

The application uses a **dual-submission approach** for reliability:

1. **Database (Primary)** - Fast, reliable, queryable
   - Form data saved to database immediately
   - Returns quote ID
   - Enables history display and future CRUD operations
   
2. **n8n Webhook (Secondary)** - Business process integration
   - Uploads files to Google Drive
   - Creates organized folder structure
   - Returns Drive link
   
3. **Link Systems** - Complete the data model
   - Database record updated with Drive link
   - Full traceability between systems

**Why this approach?**
- Database saves are fast and reliable
- n8n can fail without losing form data
- Queryable data enables AI agents and analytics
- Google Drive integration maintains human workflow

### Environments

**Local Development:**
- SQLite database (file-based)
- Express.js API server
- Vite proxy routes requests

**Production (Vercel):**
- PostgreSQL database (Neon)
- Serverless functions
- Direct API routes

## Deployment

See [VERCEL_DATABASE.md](VERCEL_DATABASE.md) for complete deployment instructions.

### Google API Integration

Helper functions are provided for Google services (Drive, Gmail, Calendar). Configure your Google API credentials in `.env`:

```typescript
import { uploadToGoogleDrive, sendGmailEmail } from './services/google.service';

// Upload file to Google Drive
await uploadToGoogleDrive(file);

// Send email via Gmail
await sendGmailEmail({ to, subject, body });
```

## Form Fields

The quote request form includes:
- Company Name
- Contact Name
- Email
- Phone Number
- Project Name
- Project Description
- Desired Due Date
- File Upload (supports .pdf, .step, .stp, .igs, .iges, .dxf, .zip)

## Customization

### Styling

Tailwind CSS and shadCN provide extensive customization options. Modify:
- `tailwind.config.js` - Tailwind theme configuration
- `src/index.css` - CSS variables for shadCN components

### Components

Add more shadCN components as needed by manually creating component files in `src/components/ui/`

## License

MIT
