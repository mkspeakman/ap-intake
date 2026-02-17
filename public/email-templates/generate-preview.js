#!/usr/bin/env node

/**
 * Email Template Preview Generator
 * 
 * Generates a preview HTML file with sample data
 * Usage: node generate-preview.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_FILE = path.join(__dirname, 'quote-notification.html');
const SAMPLE_DATA_FILE = path.join(__dirname, 'sample-data.json');
const OUTPUT_FILE = path.join(__dirname, 'preview.html');

try {
  // Read template
  console.log('📧 Loading email template...');
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  
  // Read sample data
  console.log('📊 Loading sample data...');
  const data = JSON.parse(fs.readFileSync(SAMPLE_DATA_FILE, 'utf8'));
  
  // Replace variables
  console.log('🔄 Replacing template variables...');
  let preview = template;
  
  // Use uploadedFilesText (option A: no files)
  data.uploadedFilesText = data.uploadedFilesText || 'Uploaded Files: None';
  
  Object.keys(data).forEach(key => {
    // Skip alternate examples
    if (key.endsWith('Alt')) return;
    
    const regex = new RegExp(`{{${key}}}`, 'g');
    const value = data[key] || '';
    preview = preview.replace(regex, value);
  });
  
  // Write preview file
  console.log('💾 Writing preview file...');
  fs.writeFileSync(OUTPUT_FILE, preview, 'utf8');
  
  console.log('✅ Preview generated successfully!');
  console.log(`📄 Open: ${OUTPUT_FILE}`);
  console.log('');
  console.log('To test with different data:');
  console.log('1. Edit sample-data.json');
  console.log('2. Run: node generate-preview.js');
  
} catch (error) {
  console.error('❌ Error generating preview:', error.message);
  process.exit(1);
}
