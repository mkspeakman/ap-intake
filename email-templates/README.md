# Email Templates - Quote Request Notifications

HTML email templates for notifying Autopilot when new quote requests are submitted.

## Files

- **quote-notification.html** - Responsive HTML email template
- **quote-notification.txt** - Plain text fallback version
- **sample-data.json** - Example data for testing
- **preview.html** - Test preview with sample data (see below)

## Template Variables

Replace these placeholders with actual data when sending emails:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{logoUrl}}` | Hosted logo image URL | `https://your-domain.com/images/logo.png` |
| `{{dateSubmitted}}` | Submission date/time | `Tue Feb 17 8:55AM` |
| `{{quoteNumber}}` | Generated quote number | `QR-20260204-ZA98` |
| `{{summaryLink}}` | Link to markdown summary | `https://drive.google.com/...` |
| `{{uploadedFilesText}}` | Files summary | `PDF(1), STEP(2)` or `Uploaded Files: None` |
| `{{projectName}}` | Project name | `SC-006 Crank Knob Rev A` |
| `{{companyName}}` | Company name | `Acme Manufacturing` |
| `{{contactName}}` | Contact person | `John Smith` |
| `{{email}}` | Contact email | `john@acme.com` |
| `{{phone}}` | Phone number | `4065797906` |
| `{{description}}` | Project description | `5000 units requiring...` |
| `{{driveLink}}` | Google Drive folder link | `https://drive.google.com/...` |

### Logo Image Requirements

**Important:** The logo must be hosted externally for email compatibility.

**Hosting options:**
1. **Vercel Static Assets** (easiest) - Place in `/public` folder, URL: `https://your-app.vercel.app/logo.png`
2. **CDN** - Cloudinary, Imgix, AWS CloudFront, etc.
3. **GitHub Raw** - For open source projects: `https://raw.githubusercontent.com/user/repo/main/logo.png`
4. **Google Cloud Storage / AWS S3** - Professional hosting

**Image specifications:**
- Format: PNG with transparency (or JPG/WebP)
- Size: 32x32px (64x64px for retina displays)
- File size: < 50KB for fast loading
- Alt text: Always include for accessibility

**Example:**
```html
<img src="https://your-domain.com/images/ap-ai-logo.png" 
     width="32" height="32" 
     alt="AP-AI Logo" 
     style="display: block; width: 32px; height: 32px; border: 0;" />
```

## Email Client Compatibility

This template is tested and compatible with:

- ✅ Gmail (Desktop & Mobile)
- ✅ Apple Mail (macOS & iOS)
- ✅ Outlook 2016+ (Windows & Mac)
- ✅ Outlook.com / Office 365
- ✅ Yahoo Mail
- ✅ AOL Mail
- ✅ Samsung Mail
- ✅ Thunderbird
- ✅ ProtonMail

### Design Features

- **Table-based layout** for maximum compatibility
- **Inline CSS** for consistent rendering
- **MSO conditionals** for Outlook support
- **Responsive design** adapts to mobile devices
- **Web-safe fonts** with fallbacks
- **VML buttons** for Outlook button support

## Integration Examples

### n8n Workflow

```javascript
// In your n8n HTTP Request node or Email Send node:
const emailBody = `
  <!DOCTYPE html>
  ... [paste template content] ...
`.replace(/{{dateSubmitted}}/g, dateSubmitted)
 .replace(/{{quoteNumber}}/g, quoteNumber)
 .replace(/{{summaryLink}}/g, summaryLink)
 .replace(/{{uploadedFilesText}}/g, uploadedFilesText)
 .replace(/{{projectName}}/g, projectName)
 .replace(/{{companyName}}/g, companyName)
 .replace(/{{contactName}}/g, contactName)
 .replace(/{{email}}/g, email)
 .replace(/{{phone}}/g, phone)
 .replace(/{{description}}/g, description)
 .replace(/{{driveLink}}/g, driveLink);
```

### Node.js (Nodemailer)

```javascript
const nodemailer = require('nodemailer');
const fs = require('fs');

// Load template
let htmlTemplate = fs.readFileSync('./email-templates/quote-notification.html', 'utf8');
let textTemplate = fs.readFileSync('./email-templates/quote-notification.txt', 'utf8');

// Replace variables
const variables = {
  dateSubmitted: 'Tue Feb 17 8:55AM',
  quoteNumber: 'QR-20260204-ZA98',
  // ... other variables
};

Object.keys(variables).forEach(key => {
  const regex = new RegExp(`{{${key}}}`, 'g');
  htmlTemplate = htmlTemplate.replace(regex, variables[key]);
  textTemplate = textTemplate.replace(regex, variables[key]);
});

// Send email
const transporter = nodemailer.createTransport({ /* config */ });
await transporter.sendMail({
  from: 'notifications@ap-ai.com',
  to: 'estimating@autopilotmanufacturing.com',
  subject: `New Quote Request: ${variables.quoteNumber}`,
  html: htmlTemplate,
  text: textTemplate
});
```

### SendGrid

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'estimating@autopilotmanufacturing.com',
  from: 'notifications@ap-ai.com',
  subject: `New Quote Request: ${quoteNumber}`,
  html: htmlTemplate, // with variables replaced
  text: textTemplate  // with variables replaced
};

await sgMail.send(msg);
```

### AWS SES

```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

const params = {
  Source: 'notifications@ap-ai.com',
  Destination: {
    ToAddresses: ['estimating@autopilotmanufacturing.com']
  },
  Message: {
    Subject: {
      Data: `New Quote Request: ${quoteNumber}`
    },
    Body: {
      Html: {
        Data: htmlTemplate // with variables replaced
      },
      Text: {
        Data: textTemplate // with variables replaced
      }
    }
  }
};

await ses.sendEmail(params).promise();
```

## Testing the Template

### Local Preview

Create a test HTML file with sample data:

```bash
# Create preview file with sample data
node -e "
const fs = require('fs');
const template = fs.readFileSync('./quote-notification.html', 'utf8');
const data = JSON.parse(fs.readFileSync('./sample-data.json', 'utf8'));

let preview = template;
Object.keys(data).forEach(key => {
  preview = preview.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
});

fs.writeFileSync('./preview.html', preview);
console.log('Preview created: preview.html');
"
```

Then open `preview.html` in your browser.

### Email Testing Tools

Test rendering across email clients:

- [Litmus](https://litmus.com/) - Comprehensive email testing
- [Email on Acid](https://www.emailonacid.com/) - Preview in 90+ clients
- [Mailtrap](https://mailtrap.io/) - Catch test emails
- [Testi@](https://testi.at/) - Free email address testing

### Command-Line Testing

Send a test email:

```bash
# Using mail command (macOS/Linux)
cat quote-notification.txt | mail -s "Test: New Quote Request" your@email.com

# Or use a Node.js script
node test-email.js
```

## Customization

### Changing Colors

Primary colors are defined inline. To customize:

- **Primary Blue**: `#3b82f6` (button, links)
- **Hover Blue**: `#2563eb` (button hover)
- **Text Dark**: `#18181b` (headings, values)
- **Text Gray**: `#52525b` (labels)
- **Text Light**: `#3f3f46` (body text)
- **Background**: `#f4f4f5` (email background)

### Logo Customization

Replace the SVG logo (lines 115-119) with:
- Image: `<img src="https://your-domain.com/logo.png" width="48" height="48" alt="AP-AI Logo">`
- Different SVG: Update the circle and path elements

### Typography

Default font stack:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
```

To change fonts, update the `@import` URL and font-family declarations.

## Best Practices

1. **Always include plain text version** - Some users prefer text-only emails
2. **Keep file size under 100KB** - Faster loading, better deliverability
3. **Test before deploying** - Check rendering in major email clients
4. **Use descriptive alt text** - For accessibility and when images are blocked
5. **Include unsubscribe option** - If sending to external contacts (not needed for internal notifications)
6. **Monitor deliverability** - Track bounce rates and spam complaints

## Troubleshooting

### Images not loading
- Ensure image URLs are absolute (https://)
- Check Content Security Policy headers
- Some clients block images by default

### Button not displaying correctly
- The template includes MSO conditionals for Outlook
- Falls back to text link if HTML is stripped

### Layout broken in Outlook
- Use table-based layouts (already implemented)
- Avoid flexbox, grid, or modern CSS
- Test in Outlook 2016+ on Windows

### Mobile rendering issues
- Template is responsive, but test on actual devices
- Check viewport meta tag is present
- Ensure touch targets are at least 44x44px

## License

Part of the AP-AI Manufacturing Quote Request System.
