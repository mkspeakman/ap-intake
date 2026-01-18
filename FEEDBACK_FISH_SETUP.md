# Feedback Fish Setup Guide

This app uses [Feedback Fish](https://feedback.fish/) to collect user feedback with screenshots.

## Setup Instructions

1. **Create a Feedback Fish Account**
   - Go to https://feedback.fish/
   - Sign up for a free account
   - Create a new project

2. **Get Your Project ID**
   - In your Feedback Fish dashboard, find your project
   - Copy the Project ID (it will be shown in the integration section)

3. **Add to Environment Variables**
   
   **Local Development:**
   ```bash
   # Add to .env.local
   VITE_FEEDBACK_FISH_PROJECT_ID=your_project_id_here
   ```
   
   **Production (Vercel):**
   ```bash
   # Add environment variable in Vercel dashboard
   vercel env add VITE_FEEDBACK_FISH_PROJECT_ID
   # Or add via Vercel dashboard: Settings > Environment Variables
   ```

4. **Test the Widget**
   - Look for the floating "Feedback" button in the bottom-right corner
   - Click it to open the feedback dialog
   - Submit test feedback to verify it appears in your Feedback Fish dashboard

## Features

- ✅ Floating feedback button on all pages
- ✅ Screenshot capture capability
- ✅ Optional email for follow-up
- ✅ Metadata included (URL, user agent, viewport, timestamp)
- ✅ Success confirmation after submission

## Customization

The FeedbackWidget component (`src/components/FeedbackWidget.tsx`) can be customized:
- Button position and styling
- Dialog appearance
- Fields and metadata
- Screenshot implementation (currently placeholder)

## API Endpoint

The widget posts to: `https://feedback.fish/api/feedback`

Payload structure:
```json
{
  "projectId": "your-project-id",
  "message": "User feedback message",
  "email": "optional@email.com",
  "metadata": {
    "url": "current-page-url",
    "userAgent": "browser-info",
    "timestamp": "2026-01-18T...",
    "viewport": "1920x1080"
  }
}
```

## Troubleshooting

- If feedback doesn't appear in dashboard, verify your Project ID is correct
- Check browser console for API errors
- Ensure CORS is not blocking requests (Feedback Fish handles this)
