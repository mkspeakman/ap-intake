# n8n Email Notification Implementation Guide

Complete guide for implementing the quote notification email in your n8n workflow.

## Prerequisites

- n8n instance running (`https://speakhost.app.n8n.cloud`)
- Email sending capability (Gmail, SendGrid, SMTP, etc.)
- Your Vercel production URL

## Step-by-Step Implementation

### Step 1: Get Your Vercel Production URL

Find your deployed app URL:
```bash
vercel ls
# Or check: vercel.com dashboard
```

Example: `https://ap-intake-production.vercel.app`

The logo will be available at: `https://your-app.vercel.app/favicon-32x32.png`

### Step 2: Update Your n8n Workflow

Your current n8n webhook receives quote submissions at:
`https://speakhost.app.n8n.cloud/webhook/project-submission`

Add these nodes to your workflow:

#### Node 1: Webhook Trigger (Already Exists)
- **Name:** Quote Request Webhook
- **Path:** `project-submission`
- **Method:** POST

#### Node 2: Format Email Data
**Type:** Function Node

```javascript
// Extract quote data from webhook
const quoteData = $json;

// Format the date
const now = new Date();
const dateSubmitted = now.toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

// Format uploaded files text
let uploadedFilesText = '[A: example if no files were uploaded: Uploaded Files: None]';
if (quoteData.files && quoteData.files.length > 0) {
  const fileTypes = {};
  quoteData.files.forEach(file => {
    const ext = file.file_extension.toUpperCase().replace('.', '');
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });
  uploadedFilesText = '[B: example if uploaded files exist: Uploaded Files: ' + 
    Object.entries(fileTypes)
      .map(([ext, count]) => `${ext}(${count})`)
      .join(', ') + ']';
}

// Prepare template data
const emailData = {
  logoUrl: 'https://YOUR-APP.vercel.app/favicon-32x32.png', // << UPDATE THIS
  dateSubmitted: dateSubmitted,
  quoteNumber: quoteData.quote_number,
  summaryLink: quoteData.drive_link || '#',
  uploadedFilesText: uploadedFilesText,
  projectName: quoteData.project_name,
  companyName: quoteData.company_name,
  contactName: quoteData.contact_name,
  email: quoteData.email,
  phone: quoteData.phone || 'Not provided',
  description: quoteData.description || 'No description provided',
  driveLink: quoteData.drive_link || '#'
};

return { emailData };
```

#### Node 3: Load Email Template
**Type:** HTTP Request Node

- **Method:** GET
- **URL:** `https://YOUR-APP.vercel.app/email-templates/quote-notification.html`
- **Response Format:** String

> **Alternative:** Copy/paste the HTML template directly into a Function node (see Option B below)

#### Node 4: Replace Template Variables
**Type:** Function Node

```javascript
// Get the HTML template from previous node
const htmlTemplate = $('Load Email Template').first().json.data;

// Get email data from previous node
const emailData = $('Format Email Data').first().json.emailData;

// Replace all template variables
let emailHtml = htmlTemplate;
Object.keys(emailData).forEach(key => {
  const regex = new RegExp(`{{${key}}}`, 'g');
  emailHtml = emailHtml.replace(regex, emailData[key]);
});

// Return for email sending
return {
  html: emailHtml,
  subject: `New Quote Request: ${emailData.quoteNumber}`,
  emailData: emailData // pass through for plain text
};
```

#### Node 5: Generate Plain Text Version
**Type:** Function Node

```javascript
const emailData = $('Format Email Data').first().json.emailData;

const plainText = `
AP-AI
NEW QUOTE REQUEST RECEIVED
================================

Date Submitted: ${emailData.dateSubmitted}
Quote Number: ${emailData.quoteNumber}
Summary: ${emailData.summaryLink}

${emailData.uploadedFilesText}

PROJECT DETAILS
================================

Project Name: ${emailData.projectName}

Company: ${emailData.companyName}
Contact Name: ${emailData.contactName}
Email: ${emailData.email}
Phone: ${emailData.phone}

${emailData.description}

VIEW PROJECT FILES
================================
${emailData.driveLink}

---
This is an automated notification from the AP-AI Manufacturing Quote Request System.
`;

return { text: plainText };
```

#### Node 6: Send Email
**Type:** Send Email Node

##### Option A: Gmail
- **From:** your-notifications@gmail.com
- **To:** estimating@autopilotmanufacturing.com
- **Subject:** `={{ $('Replace Template Variables').first().json.subject }}`
- **Email Type:** HTML
- **HTML:** `={{ $('Replace Template Variables').first().json.html }}`
- **Text:** `={{ $('Generate Plain Text Version').first().json.text }}`

##### Option B: SendGrid
**Type:** HTTP Request Node

```javascript
{
  "method": "POST",
  "url": "https://api.sendgrid.com/v3/mail/send",
  "authentication": "headerAuth",
  "headerParameters": {
    "Authorization": "Bearer YOUR_SENDGRID_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "personalizations": [{
      "to": [{"email": "estimating@autopilotmanufacturing.com"}],
      "subject": "={{ $('Replace Template Variables').first().json.subject }}"
    }],
    "from": {"email": "notifications@your-domain.com", "name": "AP-AI Notifications"},
    "content": [
      {
        "type": "text/html",
        "value": "={{ $('Replace Template Variables').first().json.html }}"
      },
      {
        "type": "text/plain",
        "value": "={{ $('Generate Plain Text Version').first().json.text }}"
      }
    ]
  }
}
```

##### Option C: AWS SES
**Type:** AWS SES Node
- Configure with AWS credentials
- Subject, HTML, and Text from previous nodes

##### Option D: SMTP
**Type:** Send Email Node (SMTP)
- **Host:** smtp.your-provider.com
- **Port:** 587 or 465
- **Authentication:** Username/Password
- Rest same as Gmail option

---

## Option B: Embed Template Directly (No HTTP Request)

If you don't want to fetch the template via HTTP, you can embed it directly:

#### Modified Node 3: Embed Template
**Type:** Function Node

```javascript
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  ... PASTE ENTIRE TEMPLATE HERE ...
</head>
<body>
  ... REST OF TEMPLATE ...
</body>
</html>
`;

return { htmlTemplate };
```

Then proceed with Node 4 (Replace Template Variables) as shown above.

---

## Complete n8n Workflow JSON

Here's the complete workflow you can import:

```json
{
  "name": "Quote Request Email Notification",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "project-submission",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "functionCode": "// PASTE Format Email Data code here"
      },
      "name": "Format Email Data",
      "type": "n8n-nodes-base.function",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "=https://YOUR-APP.vercel.app/email-templates/quote-notification.html",
        "options": {}
      },
      "name": "Load Email Template",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300]
    },
    {
      "parameters": {
        "functionCode": "// PASTE Replace Template Variables code here"
      },
      "name": "Replace Template Variables",
      "type": "n8n-nodes-base.function",
      "position": [850, 300]
    },
    {
      "parameters": {
        "functionCode": "// PASTE Generate Plain Text Version code here"
      },
      "name": "Generate Plain Text Version",
      "type": "n8n-nodes-base.function",
      "position": [850, 450]
    },
    {
      "parameters": {
        "fromEmail": "notifications@your-domain.com",
        "toEmail": "estimating@autopilotmanufacturing.com",
        "subject": "={{ $('Replace Template Variables').first().json.subject }}",
        "emailType": "html",
        "message": "={{ $('Replace Template Variables').first().json.html }}",
        "options": {
          "ccEmail": "",
          "bccEmail": "",
          "replyTo": "",
          "text": "={{ $('Generate Plain Text Version').first().json.text }}"
        }
      },
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [1050, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Format Email Data", "type": "main", "index": 0}]]
    },
    "Format Email Data": {
      "main": [[
        {"node": "Load Email Template", "type": "main", "index": 0},
        {"node": "Generate Plain Text Version", "type": "main", "index": 0}
      ]]
    },
    "Load Email Template": {
      "main": [[{"node": "Replace Template Variables", "type": "main", "index": 0}]]
    },
    "Replace Template Variables": {
      "main": [[{"node": "Send Email", "type": "main", "index": 0}]]
    },
    "Generate Plain Text Version": {
      "main": [[{"node": "Send Email", "type": "main", "index": 0}]]
    }
  }
}
```

---

## Testing Your Implementation

### 1. Test in n8n (Manual Execution)

In n8n workflow editor:
1. Click "Execute Workflow" 
2. Use test webhook data
3. Check email delivery

### 2. Test with Real Submission

Submit a quote through your app:
```bash
# Your app form URL
https://YOUR-APP.vercel.app/
```

### 3. Verify Email Rendering

Test in multiple email clients:
- Gmail (web, iOS, Android)
- Outlook (desktop, web)
- Apple Mail
- Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com/) for comprehensive testing

---

## Important: Update These Values

Before deploying, replace these placeholders:

### In n8n Function Node (Format Email Data):
```javascript
logoUrl: 'https://YOUR-APP.vercel.app/favicon-32x32.png'
//       ^^^^^^^^^^^^^^ UPDATE THIS
```

### In Send Email Node:
```
From: notifications@your-domain.com
To: estimating@autopilotmanufacturing.com
```

---

## Troubleshooting

### Email Not Sending
- Check n8n execution logs for errors
- Verify email credentials are correct
- Check spam folder
- Ensure "From" email is authorized (for SendGrid/SES)

### Logo Not Showing
- Verify Vercel URL is accessible: `curl https://your-app.vercel.app/favicon-32x32.png`
- Check if logo file exists in `/public/favicon-32x32.png`
- Some email clients block images by default (user setting)

### Template Variables Not Replaced
- Check that all `{{variable}}` placeholders are spelled correctly
- Verify emailData object has all required fields
- Console.log the final HTML to debug

### Styling Issues
- Test in actual email clients, not just browser
- Outlook has limited CSS support (tables-only layout)
- Use inline styles (already done in template)

---

## Alternative: Direct API Implementation (No n8n)

If you want to send emails directly from Vercel serverless functions:

### Create `/api/send-quote-notification.ts`

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { quoteData } = req.body;

  // Load template
  const templateUrl = `https://${req.headers.host}/email-templates/quote-notification.html`;
  const templateResponse = await fetch(templateUrl);
  let htmlTemplate = await templateResponse.text();

  // Format data and replace variables
  const emailData = {
    logoUrl: `https://${req.headers.host}/favicon-32x32.png`,
    dateSubmitted: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    quoteNumber: quoteData.quote_number,
    // ... rest of fields
  };

  Object.keys(emailData).forEach(key => {
    htmlTemplate = htmlTemplate.replace(new RegExp(`{{${key}}}`, 'g'), emailData[key]);
  });

  // Send via SendGrid/SES/SMTP
  // ... email sending code ...

  return res.json({ success: true });
}
```

Then call from your quote creation endpoint.

---

## Production Checklist

- [ ] Update `logoUrl` with actual Vercel URL
- [ ] Configure email sending credentials
- [ ] Set correct recipient email
- [ ] Test email in multiple clients
- [ ] Verify logo loads correctly
- [ ] Check spam score (use mail-tester.com)
- [ ] Set up email sending monitoring
- [ ] Add error handling for failed sends
- [ ] Consider adding retry logic

---

## Support

For issues:
1. Check n8n execution logs
2. Verify email provider settings
3. Test with curl/Postman
4. Review template variable names

Template files location:
- `/email-templates/quote-notification.html` - HTML template
- `/email-templates/quote-notification.txt` - Plain text version
- `/email-templates/README.md` - Full documentation
