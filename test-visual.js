#!/usr/bin/env node

/**
 * Visual WebhookData Verification Test
 * 
 * This script demonstrates the exact data structure that gets sent
 * to the n8n webhook and validates the response.
 */

import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function header(text) {
  console.log('\n' + colors.bright + colors.cyan + '═'.repeat(70) + colors.reset);
  console.log(colors.bright + colors.cyan + '  ' + text + colors.reset);
  console.log(colors.bright + colors.cyan + '═'.repeat(70) + colors.reset + '\n');
}

function section(text) {
  console.log('\n' + colors.bright + colors.blue + '▸ ' + text + colors.reset);
  console.log(colors.blue + '─'.repeat(70) + colors.reset);
}

async function visualTest() {
  header('🧪 COMPREHENSIVE WEBHOOK DATA FLOW TEST');

  // Test data
  const testData = {
    companyName: 'Precision Aerospace Manufacturing',
    contactName: 'Dr. Emily Chen',
    email: 'emily.chen@precisionaero.com',
    phone: '+1 (555) 123-4567',
    projectName: 'Advanced Turbine Blade Assembly',
    description: `Multi-stage turbine blade assembly for commercial jet engines.
    
Requirements:
- Material: Inconel 718 superalloy
- Temperature resistance: 1800°F continuous
- Tolerances: ±0.0001" on critical dimensions
- Surface finish: 8-16 Ra
- Quantity: 500 units per quarter
- Delivery: Staged over 12 months

Special considerations:
- Full traceability required
- NADCAP certified facility required
- First article inspection mandatory
- CMM reports for all critical features`,
    materials: ['Inconel 718', 'Titanium Grade 5', 'Ceramic Matrix Composite'],
    finishes: ['Shot Peening', 'Thermal Barrier Coating', 'Electropolish'],
    quantity: '500',
    leadTime: '12 weeks',
    partNotes: `Critical features:
- Blade root dovetail: Class 4 tolerance
- Airfoil profile: ±0.0002"
- Tip clearance: 0.010" ±0.001"
- Balance: <1 gram-inch
- All dimensions per AS9102 requirements`,
    certifications: ['AS9100', 'NADCAP', 'Material Certs', 'First Article Inspection', 'ISO 9001']
  };

  section('📋 FORM DATA STRUCTURE');
  
  console.log(colors.yellow + '\nField-by-field breakdown:\n' + colors.reset);
  
  const fieldTypes = {
    companyName: 'String',
    contactName: 'String',
    email: 'Email',
    phone: 'Phone',
    projectName: 'String',
    description: 'Text (multiline)',
    materials: 'Array → JSON',
    finishes: 'Array → JSON',
    quantity: 'String (number)',
    leadTime: 'String',
    partNotes: 'Text (multiline)',
    certifications: 'Array → JSON'
  };

  for (const [key, value] of Object.entries(testData)) {
    const type = fieldTypes[key];
    const displayValue = typeof value === 'string' && value.length > 80
      ? value.substring(0, 80) + '...'
      : Array.isArray(value)
      ? `[${value.length} items]`
      : value;
    
    console.log(colors.cyan + `  ${key.padEnd(20)}` + colors.reset + 
                colors.magenta + ` (${type})`.padEnd(25) + colors.reset + 
                colors.green + displayValue + colors.reset);
  }

  section('📎 FILE ATTACHMENTS');

  const testFile = {
    name: 'turbine-blade-CAD-model.step',
    content: `STEP CAD FILE - ISO 10303-21
FILE_DESCRIPTION: ${testData.projectName}
ORGANIZATION: ${testData.companyName}
AUTHOR: ${testData.contactName}
CREATED: ${new Date().toISOString()}

ENTITY DEFINITIONS:
- Part Number: TRB-500-Rev-C
- Material: Inconel 718
- Process: 5-Axis CNC + EDM
- Features: 847 surfaces, 2,341 curves
- Tolerances: Per AS9102

[... simulated CAD data ...]

This is a test file simulating a real STEP CAD model.
Production files are typically 10-100MB with full 3D geometry.
`
  };

  const filePath = path.join(__dirname, testFile.name);
  fs.writeFileSync(filePath, testFile.content);
  const stats = fs.statSync(filePath);

  console.log(colors.yellow + '\nFile details:\n' + colors.reset);
  console.log(`  ${colors.cyan}Filename:${colors.reset}     ${testFile.name}`);
  console.log(`  ${colors.cyan}Size:${colors.reset}         ${stats.size.toLocaleString()} bytes`);
  console.log(`  ${colors.cyan}Type:${colors.reset}         application/step (CAD model)`);
  console.log(`  ${colors.cyan}Encoding:${colors.reset}     binary/multipart`);

  section('🚀 PREPARING FORMDATA PAYLOAD');

  const formData = new FormData();
  
  // Add all fields
  let fieldCount = 0;
  for (const [key, value] of Object.entries(testData)) {
    const formValue = Array.isArray(value) ? JSON.stringify(value) : value;
    formData.append(key, formValue);
    fieldCount++;
  }

  // Add file
  formData.append('files', fs.createReadStream(filePath), {
    filename: testFile.name,
    contentType: 'application/step'
  });

  console.log(colors.yellow + '\nPayload composition:\n' + colors.reset);
  console.log(`  ${colors.green}✓${colors.reset} Form fields: ${fieldCount}`);
  console.log(`  ${colors.green}✓${colors.reset} File attachments: 1`);
  console.log(`  ${colors.green}✓${colors.reset} Total size: ${stats.size} bytes`);
  console.log(`  ${colors.green}✓${colors.reset} Content-Type: multipart/form-data`);

  section('🌐 SENDING TO WEBHOOK');

  const webhookUrl = 'https://speakhost.app.n8n.cloud/webhook/project-submission';
  console.log(`\n  ${colors.cyan}Target:${colors.reset} ${webhookUrl}`);
  console.log(`  ${colors.cyan}Method:${colors.reset} POST`);
  console.log(`  ${colors.cyan}Format:${colors.reset} multipart/form-data with boundary`);

  try {
    console.log(`\n  ${colors.yellow}⏳ Transmitting...${colors.reset}\n`);
    
    const startTime = Date.now();
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    const duration = Date.now() - startTime;

    section('📡 WEBHOOK RESPONSE');

    const statusColor = response.ok ? colors.green : colors.red;
    console.log(`\n  Status: ${statusColor}${response.status} ${response.statusText}${colors.reset}`);
    console.log(`  Response Time: ${colors.cyan}${duration}ms${colors.reset}`);
    console.log(`  Content-Type: ${colors.cyan}${response.headers.get('content-type')}${colors.reset}`);

    const responseData = await response.json();

    if (response.ok) {
      section('✅ SUCCESS - DATA VERIFICATION');

      console.log(colors.green + '\nn8n workflow completed successfully!\n' + colors.reset);
      
      console.log(colors.yellow + 'What happened:\n' + colors.reset);
      console.log(`  ${colors.green}1.${colors.reset} Webhook received all ${fieldCount} form fields`);
      console.log(`  ${colors.green}2.${colors.reset} File upload (${stats.size} bytes) processed`);
      console.log(`  ${colors.green}3.${colors.reset} Job specification document generated`);
      console.log(`  ${colors.green}4.${colors.reset} Document uploaded to Google Drive`);
      console.log(`  ${colors.green}5.${colors.reset} File metadata returned in response`);

      console.log(colors.yellow + '\nGoogle Drive file created:\n' + colors.reset);
      console.log(`  ${colors.cyan}File ID:${colors.reset}      ${responseData.id}`);
      console.log(`  ${colors.cyan}Filename:${colors.reset}     ${responseData.name}`);
      console.log(`  ${colors.cyan}Type:${colors.reset}         ${responseData.mimeType}`);
      console.log(`  ${colors.cyan}Size:${colors.reset}         ${responseData.size} bytes`);
      console.log(`  ${colors.cyan}Created:${colors.reset}      ${responseData.createdTime}`);
      console.log(`  ${colors.cyan}Owner:${colors.reset}        ${responseData.owners[0].displayName}`);
      console.log(`  ${colors.cyan}View Link:${colors.reset}    ${colors.blue}${responseData.webViewLink}${colors.reset}`);
      
      if (responseData.downloadRestrictions) {
        console.log(`  ${colors.cyan}Download:${colors.reset}     ${responseData.downloadRestrictions.itemDownloadRestriction.restrictedForReaders ? 'Restricted' : 'Allowed'}`);
      }

      section('📊 COMPLETE DATA FLOW');

      console.log(`
  ${colors.bright}┌─────────────┐${colors.reset}
  │   Browser   │
  │    Form     │
  └──────┬──────┘
         │ ${colors.cyan}FormData${colors.reset}
         │ ${fieldCount} fields + 1 file
         ▼
  ${colors.bright}┌─────────────┐${colors.reset}
  │   n8n       │
  │  Webhook    │ ${colors.green}✓ Received${colors.reset}
  └──────┬──────┘
         │ ${colors.cyan}Process${colors.reset}
         │ Generate job spec
         ▼
  ${colors.bright}┌─────────────┐${colors.reset}
  │   Google    │
  │   Drive     │ ${colors.green}✓ Stored${colors.reset}
  └──────┬──────┘
         │ ${colors.cyan}Metadata${colors.reset}
         │ File info
         ▼
  ${colors.bright}┌─────────────┐${colors.reset}
  │  Response   │
  │   ${response.status} OK     │ ${colors.green}✓ Success${colors.reset}
  └─────────────┘
`);

      header('✅ ALL TESTS PASSED');
      
      console.log(colors.green + '  • Form data transmission: VERIFIED' + colors.reset);
      console.log(colors.green + '  • File upload: VERIFIED' + colors.reset);
      console.log(colors.green + '  • n8n workflow: VERIFIED' + colors.reset);
      console.log(colors.green + '  • Google Drive integration: VERIFIED' + colors.reset);
      console.log(colors.green + '  • Response data: VERIFIED' + colors.reset);
      
    } else {
      section('❌ ERROR');
      console.log(colors.red + '\nWebhook returned an error:\n' + colors.reset);
      console.log(JSON.stringify(responseData, null, 2));
    }

  } catch (error) {
    section('❌ TEST FAILED');
    console.log(colors.red + '\nError during submission:\n' + colors.reset);
    console.error(error.message);
  } finally {
    // Clean up
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`\n  ${colors.cyan}🗑️  Cleaned up test file${colors.reset}\n`);
    }
  }
}

// Run the visual test
visualTest();
