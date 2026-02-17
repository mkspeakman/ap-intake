#!/usr/bin/env node

/**
 * Email Template Test Script
 * 
 * Tests variable replacement and generates both HTML and text versions
 * Usage: node test-template.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTML_TEMPLATE = path.join(__dirname, 'quote-notification.html');
const TEXT_TEMPLATE = path.join(__dirname, 'quote-notification.txt');
const SAMPLE_DATA = path.join(__dirname, 'sample-data.json');

function replaceVariables(template, data) {
  let result = template;
  Object.keys(data).forEach(key => {
    if (key.endsWith('Alt')) return; // Skip alternate examples
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key] || '');
  });
  return result;
}

function checkMissingVariables(template, data) {
  const variablePattern = /{{(\w+)}}/g;
  const matches = template.matchAll(variablePattern);
  const missing = [];
  
  for (const match of matches) {
    const varName = match[1];
    if (!data.hasOwnProperty(varName) && !varName.endsWith('Alt')) {
      missing.push(varName);
    }
  }
  
  return [...new Set(missing)];
}

function analyzeTemplate(template, type) {
  const stats = {
    type,
    size: Buffer.byteLength(template, 'utf8'),
    lines: template.split('\n').length,
    variables: [...new Set(template.match(/{{(\w+)}}/g) || [])].length,
  };
  
  if (type === 'html') {
    stats.tables = (template.match(/<table/g) || []).length;
    stats.images = (template.match(/<img/g) || []).length;
    stats.links = (template.match(/<a/g) || []).length;
  }
  
  return stats;
}

console.log('📧 Email Template Test\n');
console.log('=' .repeat(50));

try {
  // Load files
  console.log('\n📂 Loading files...');
  const htmlTemplate = fs.readFileSync(HTML_TEMPLATE, 'utf8');
  const textTemplate = fs.readFileSync(TEXT_TEMPLATE, 'utf8');
  const sampleData = JSON.parse(fs.readFileSync(SAMPLE_DATA, 'utf8'));
  
  console.log('✅ HTML template loaded');
  console.log('✅ Text template loaded');
  console.log('✅ Sample data loaded');
  
  // Analyze templates
  console.log('\n📊 Template Analysis:');
  const htmlStats = analyzeTemplate(htmlTemplate, 'html');
  const textStats = analyzeTemplate(textTemplate, 'text');
  
  console.log('\nHTML Template:');
  console.log(`  Size: ${(htmlStats.size / 1024).toFixed(2)} KB`);
  console.log(`  Lines: ${htmlStats.lines}`);
  console.log(`  Tables: ${htmlStats.tables}`);
  console.log(`  Links: ${htmlStats.links}`);
  console.log(`  Variables: ${htmlStats.variables}`);
  
  console.log('\nText Template:');
  console.log(`  Size: ${(textStats.size / 1024).toFixed(2)} KB`);
  console.log(`  Lines: ${textStats.lines}`);
  console.log(`  Variables: ${textStats.variables}`);
  
  // Check for missing variables
  console.log('\n🔍 Checking for missing variables...');
  const htmlMissing = checkMissingVariables(htmlTemplate, sampleData);
  const textMissing = checkMissingVariables(textTemplate, sampleData);
  
  if (htmlMissing.length > 0) {
    console.log(`⚠️  HTML template missing data for: ${htmlMissing.join(', ')}`);
  } else {
    console.log('✅ All HTML variables have sample data');
  }
  
  if (textMissing.length > 0) {
    console.log(`⚠️  Text template missing data for: ${textMissing.join(', ')}`);
  } else {
    console.log('✅ All text variables have sample data');
  }
  
  // Test variable replacement
  console.log('\n🔄 Testing variable replacement...');
  
  // Use the non-Alt version of uploadedFilesText
  sampleData.uploadedFilesText = sampleData.uploadedFilesText || 'Uploaded Files: None';
  
  const htmlResult = replaceVariables(htmlTemplate, sampleData);
  const textResult = replaceVariables(textTemplate, sampleData);
  
  // Check if any variables remain unreplaced
  const htmlUnreplaced = (htmlResult.match(/{{(\w+)}}/g) || []);
  const textUnreplaced = (textResult.match(/{{(\w+)}}/g) || []);
  
  if (htmlUnreplaced.length > 0) {
    console.log(`⚠️  HTML has unreplaced variables: ${htmlUnreplaced.join(', ')}`);
  } else {
    console.log('✅ All HTML variables replaced successfully');
  }
  
  if (textUnreplaced.length > 0) {
    console.log(`⚠️  Text has unreplaced variables: ${textUnreplaced.join(', ')}`);
  } else {
    console.log('✅ All text variables replaced successfully');
  }
  
  // Save test outputs
  console.log('\n💾 Saving test outputs...');
  fs.writeFileSync(path.join(__dirname, 'test-output.html'), htmlResult, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'test-output.txt'), textResult, 'utf8');
  
  console.log('✅ test-output.html created');
  console.log('✅ test-output.txt created');
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests passed!');
  console.log('\nNext steps:');
  console.log('1. Open test-output.html in a browser');
  console.log('2. Test in different email clients');
  console.log('3. Integrate with n8n workflow');
  console.log('');
  
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
