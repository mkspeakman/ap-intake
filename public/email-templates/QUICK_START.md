# Quick Start: Email Notification Setup

## 1️⃣ Get Your Logo URL

Your logo is already deployed! Just replace with your actual Vercel URL:

```
https://YOUR-APP.vercel.app/favicon-32x32.png
```

Find your URL:
```bash
vercel ls
# Or check vercel.com dashboard
```

---

## 2️⃣ Add to n8n Workflow

### Function Node: Format Email Data

```javascript
const quoteData = $json;

// Format date
const dateSubmitted = new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric',
  hour: 'numeric', minute: '2-digit', hour12: true
});

// Format files
let uploadedFilesText = '[A: example if no files were uploaded: Uploaded Files: None]';
if (quoteData.files && quoteData.files.length > 0) {
  const fileTypes = {};
  quoteData.files.forEach(f => {
    const ext = f.file_extension.toUpperCase().replace('.', '');
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });
  uploadedFilesText = '[B: example if uploaded files exist: Uploaded Files: ' + 
    Object.entries(fileTypes).map(([ext, n]) => `${ext}(${n})`).join(', ') + ']';
}

return {
  emailData: {
    logoUrl: 'https://YOUR-APP.vercel.app/favicon-32x32.png', // << UPDATE
    dateSubmitted,
    quoteNumber: quoteData.quote_number,
    summaryLink: quoteData.drive_link || '#',
    uploadedFilesText,
    projectName: quoteData.project_name,
    companyName: quoteData.company_name,
    contactName: quoteData.contact_name,
    email: quoteData.email,
    phone: quoteData.phone || 'Not provided',
    description: quoteData.description || 'No description provided',
    driveLink: quoteData.drive_link || '#'
  }
};
```

### HTTP Request Node: Load Template

- **Method:** GET
- **URL:** `https://YOUR-APP.vercel.app/email-templates/quote-notification.html`

### Function Node: Replace Variables

```javascript
const htmlTemplate = $('HTTP Request').first().json.data;
const emailData = $('Format Email Data').first().json.emailData;

let emailHtml = htmlTemplate;
Object.keys(emailData).forEach(key => {
  emailHtml = emailHtml.replace(new RegExp(`{{${key}}}`, 'g'), emailData[key]);
});

return {
  html: emailHtml,
  subject: `New Quote Request: ${emailData.quoteNumber}`
};
```

### Send Email Node

- **From:** notifications@your-domain.com
- **To:** estimating@autopilotmanufacturing.com  
- **Subject:** `={{ $('Replace Variables').first().json.subject }}`
- **HTML:** `={{ $('Replace Variables').first().json.html }}`

---

## 3️⃣ Test It

1. Submit a test quote through your app
2. Check email delivery
3. Verify logo displays correctly

---

## 📚 Full Documentation

See [N8N_IMPLEMENTATION.md](./N8N_IMPLEMENTATION.md) for:
- Complete workflow setup
- SendGrid/AWS SES integration
- Alternative implementations
- Troubleshooting guide

---

## ✅ Checklist

- [ ] Update `logoUrl` in Function node
- [ ] Configure email credentials (Gmail/SendGrid/SMTP)
- [ ] Set correct recipient email
- [ ] Test email in Gmail, Outlook, Apple Mail
- [ ] Verify logo loads
- [ ] Check spam folder if not receiving
