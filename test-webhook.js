import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test data matching the form structure
const testData = {
  companyName: 'Acme Manufacturing Inc.',
  contactName: 'John Smith',
  email: 'john.smith@acme.com',
  phone: '555-0123',
  projectName: 'Hydraulic Mounting Bracket Assembly',
  description: 'Need 100 custom CNC machined aluminum brackets for hydraulic system. Must meet aerospace tolerances and include AS9100 certification.',
  materials: ['Aluminum 6061-T6', 'Stainless Steel 316'],
  finishes: ['Anodized', 'Passivated'],
  quantity: '100',
  leadTime: '4 weeks',
  partNotes: 'Critical dimensions: ±0.001", Surface finish: 32 Ra',
  certifications: ['AS9100', 'Material Certs', 'First Article Inspection']
};

async function testWebhook() {
  console.log('🧪 Testing Webhook Submission\n');
  console.log('━'.repeat(60));
  
  const formData = new FormData();
  
  // Add all form fields
  console.log('\n📝 Form Data:');
  Object.entries(testData).forEach(([key, value]) => {
    const formValue = Array.isArray(value) ? JSON.stringify(value) : value;
    formData.append(key, formValue);
    console.log(`  ${key}: ${typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}`);
  });
  
  // Create a test file (small text file to simulate CAD file)
  console.log('\n📎 Creating test file...');
  const testFileName = 'test-drawing.txt';
  const testFilePath = path.join(__dirname, testFileName);
  const testFileContent = `TEST CAD FILE
Project: ${testData.projectName}
Company: ${testData.companyName}
Generated: ${new Date().toISOString()}

This is a test file to verify file upload functionality.
In production, this would be a .step, .stl, or .pdf file.
`;
  
  fs.writeFileSync(testFilePath, testFileContent);
  const fileStats = fs.statSync(testFilePath);
  console.log(`  ✓ Created ${testFileName} (${fileStats.size} bytes)`);
  
  // Add file to form data
  formData.append('files', fs.createReadStream(testFilePath), {
    filename: testFileName,
    contentType: 'text/plain'
  });
  
  // Determine webhook URL
  const webhookUrl = 'https://speakhost.app.n8n.cloud/webhook/project-submission';
  console.log(`\n🌐 Webhook URL: ${webhookUrl}`);
  
  try {
    console.log('\n⏳ Submitting form data...\n');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    console.log('━'.repeat(60));
    console.log('\n📡 Response:');
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Headers:`, Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json();
      console.log('\n  Response Body (JSON):');
      console.log(JSON.stringify(responseData, null, 2));
    } else {
      responseData = await response.text();
      console.log('\n  Response Body (Text):');
      console.log(responseData);
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log(`\n🗑️  Cleaned up test file`);
    
    if (response.ok) {
      console.log('\n✅ TEST PASSED - Form submitted successfully!');
      
      // Show what was sent
      console.log('\n📊 Summary:');
      console.log(`  ✓ Form fields: ${Object.keys(testData).length}`);
      console.log(`  ✓ Files: 1`);
      console.log(`  ✓ Total size: ${fileStats.size} bytes`);
      console.log(`  ✓ Status: ${response.status}`);
      
      if (responseData?.quoteNumber || responseData?.quote_number) {
        console.log(`  ✓ Quote Number: ${responseData.quoteNumber || responseData.quote_number}`);
      }
    } else {
      console.log('\n❌ TEST FAILED - Server returned error');
      console.log(`  Status: ${response.status}`);
      console.log(`  Message: ${responseData?.message || responseData}`);
    }
    
  } catch (error) {
    // Clean up test file on error
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    
    console.log('\n❌ TEST FAILED - Error during submission:');
    console.error(`  ${error.message}`);
    
    if (error.cause) {
      console.error(`  Cause: ${error.cause.message}`);
    }
    
    process.exit(1);
  }
  
  console.log('\n' + '━'.repeat(60));
}

// Run the test
testWebhook();
