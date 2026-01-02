# AP Intake - Quote Request Application

A modern single-page web application built with Vite, React, TypeScript, Tailwind CSS, and shadCN UI for collecting customer quote requests.

## Features

- ✨ Modern, responsive UI with shadCN components
- 🎨 Tailwind CSS for styling
- 📝 Form handling for customer quote requests
- 🔌 API integration ready for N8N and Google services
- 🚀 Fast development with Vite and HMR

## Tech Stack

- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadCN UI** - Component library
- **Axios** - HTTP client for API requests

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

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
├── src/
│   ├── components/
│   │   └── ui/           # shadCN UI components
│   ├── lib/
│   │   ├── api-client.ts # Axios configuration
│   │   └── utils.ts      # Utility functions
│   ├── services/
│   │   ├── n8n.service.ts    # N8N API integration
│   │   └── google.service.ts # Google API integration
│   ├── App.tsx           # Main form component
│   ├── index.css         # Global styles with Tailwind
│   └── main.tsx          # Application entry point
├── .env.example          # Environment variables template
└── package.json
```

## API Integration

### N8N Integration

The application includes utilities for submitting data to N8N webhooks. Update your webhook URL in `.env`:

```typescript
import { submitToN8N } from './services/n8n.service';

// Submit form data to N8N
await submitToN8N(formData);
```

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
