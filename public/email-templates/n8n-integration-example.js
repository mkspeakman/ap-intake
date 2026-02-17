#!/usr/bin/env node

/**
 * n8n Email Integration Example
 * 
 * Example code showing how to integrate the email template with n8n
 * This can be adapted for use in n8n Function nodes
 */

// =============================================================================
// OPTION 1: Simple Variable Replacement (Recommended for n8n)
// =============================================================================

function formatEmailFromTemplate(templateString, data) {
  let result = templateString;
  
  // Replace all template variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key] || '');
  });
  
  return result;
}

// Example usage in n8n Function node:
const exampleN8nFunctionNode = `
// In n8n, your quote request data comes from previous nodes
const quoteData = $json;

// Format the date
const dateSubmitted = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short', 
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
});

// Format uploaded files text
let uploadedFilesText = 'Uploaded Files: None';
if (quoteData.files && quoteData.files.length > 0) {
  const fileTypes = {};
  quoteData.files.forEach(file => {
    const ext = file.file_extension.toUpperCase().replace('.', '');
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });
  uploadedFilesText = 'Uploaded Files: ' + 
    Object.entries(fileTypes)
      .map(([ext, count]) => \`\${ext}(\${count})\`)
      .join(', ');
}

// Prepare template data
const templateData = {
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

// Load HTML template (stored in n8n credential or hardcoded)
const htmlTemplate = \`... paste template here ...\`;

// Replace variables
let emailHtml = htmlTemplate;
Object.keys(templateData).forEach(key => {
  const regex = new RegExp(\`{{\${key}}}\`, 'g');
  emailHtml = emailHtml.replace(regex, templateData[key]);
});

// Return for email sending
return {
  subject: \`New Quote Request: \${templateData.quoteNumber}\`,
  html: emailHtml,
  to: 'estimating@autopilotmanufacturing.com',
  from: 'notifications@ap-ai.com'
};
`;

// =============================================================================
// OPTION 2: Using n8n Email Template Feature
// =============================================================================

const n8nEmailTemplateExample = {
  "notes": [
    "1. Store the HTML template in n8n as a static string or in credentials",
    "2. Use Set node to prepare all template variables",
    "3. Use Function node to do string replacement",
    "4. Use Send Email node with the processed HTML"
  ],
  "workflow": {
    "nodes": [
      {
        "name": "Webhook - Quote Submitted",
        "type": "n8n-nodes-base.webhook",
        "position": [250, 300],
        "parameters": {
          "path": "quote-submitted",
          "responseMode": "responseNode"
        }
      },
      {
        "name": "Prepare Email Data",
        "type": "n8n-nodes-base.set",
        "position": [450, 300],
        "parameters": {
          "values": {
            "string": [
              {
                "name": "dateSubmitted",
                "value": "={{new Date().toLocaleDateString('en-US')}}"
              },
              {
                "name": "quoteNumber",
                "value": "={{$json.quote_number}}"
              },
              {
                "name": "projectName",
                "value": "={{$json.project_name}}"
              },
              {
                "name": "companyName",
                "value": "={{$json.company_name}}"
              },
              {
                "name": "contactName",
                "value": "={{$json.contact_name}}"
              },
              {
                "name": "email",
                "value": "={{$json.email}}"
              },
              {
                "name": "phone",
                "value": "={{$json.phone || 'Not provided'}}"
              },
              {
                "name": "description",
                "value": "={{$json.description}}"
              },
              {
                "name": "driveLink",
                "value": "={{$json.drive_link}}"
              }
            ]
          }
        }
      },
      {
        "name": "Format Email HTML",
        "type": "n8n-nodes-base.function",
        "position": [650, 300],
        "parameters": {
          "functionCode": "// Paste the function from above"
        }
      },
      {
        "name": "Send Email",
        "type": "n8n-nodes-base.emailSend",
        "position": [850, 300],
        "parameters": {
          "fromEmail": "notifications@ap-ai.com",
          "toEmail": "estimating@autopilotmanufacturing.com",
          "subject": "={{$json.subject}}",
          "emailType": "html",
          "message": "={{$json.html}}"
        }
      }
    ]
  }
};

// =============================================================================
// OPTION 3: Using External Email Service (SendGrid, AWS SES, etc.)
// =============================================================================

const sendGridExample = `
// n8n HTTP Request node configuration
{
  "method": "POST",
  "url": "https://api.sendgrid.com/v3/mail/send",
  "authentication": "headerAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{$credentials.sendgridApi}}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      {
        "name": "personalizations",
        "value": [{
          "to": [{"email": "estimating@autopilotmanufacturing.com"}],
          "subject": "New Quote Request: {{$json.quoteNumber}}"
        }]
      },
      {
        "name": "from",
        "value": {"email": "notifications@ap-ai.com"}
      },
      {
        "name": "content",
        "value": [{
          "type": "text/html",
          "value": "{{$json.emailHtml}}"
        }]
      }
    ]
  }
}
`;

// =============================================================================
// Export examples for documentation
// =============================================================================

export {
  formatEmailFromTemplate,
  exampleN8nFunctionNode,
  n8nEmailTemplateExample,
  sendGridExample
};

// If run directly, show examples
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('📧 n8n Email Integration Examples\n');
  console.log('='.repeat(60));
  console.log('\n1. Copy the HTML template from quote-notification.html');
  console.log('2. Store it in n8n (as a credential or hardcoded string)');
  console.log('3. Use the Function node code from this file');
  console.log('4. Configure your email provider\n');
  console.log('See README.md for detailed integration instructions.');
  console.log('');
}
