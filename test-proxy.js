import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test data with comprehensive coverage
const testData = {
  companyName: 'Advanced Aerospace Solutions',
  contactName: 'Sarah Johnson',
  email: 'sarah.johnson@aas.com',
  phone: '(555) 987-6543',
  projectName: 'Titanium Heat Shield Assembly',
  description: 'Complex multi-part assembly requiring precision machining of Grade 5 titanium. Parts must withstand temperatures up to 1200°F and include thermal barrier coating.',
  materials: ['Titanium Grade 5', 'Inconel 718', 'Stainless Steel 316'],
  finishes: ['Thermal Spray Coating', 'Electropolish'],
  quantity: '250',
  leadTime: '8 weeks',
  partNotes: 'Critical tolerances: ±0.0005" on mating surfaces. Requires full dimensional inspection report.',
  certifications: ['AS9100', 'NADCAP', 'Material Certs', 'First Article Inspection']
};

async function testLocalProxy() {
  console.log('🧪 Testing Local Dev Server Proxy\n');
  console.log('━'.repeat(60));
  
  // Check if dev server is running
  const devServerUrl = 'http://localhost:5174';
  const proxyUrl = `${devServerUrl}/api`;
  
  console.log(`\n🔍 Checking dev server...`);
  try {
    const healthCheck = await fetch(devServerUrl);
    console.log(`  ✓ Dev server is running at ${devServerUrl}`);
  } catch (error) {
    console.log(`  ❌ Dev server is not running!`);
    console.log(`  Please run: npm run dev`);
    process.exit(1);
  }
  
  const formData = new FormData();
  
  // Add all form fields
  console.log('\n📝 Form Data:');
  Object.entries(testData).forEach(([key, value]) => {
    const formValue = Array.isArray(value) ? JSON.stringify(value) : value;
    formData.append(key, formValue);
    const displayValue = typeof value === 'string' && value.length > 60 
      ? value.substring(0, 60) + '...' 
      : value;
    console.log(`  ${key}: ${displayValue}`);
  });
  
  // Create test files
  console.log('\n📎 Creating test files...');
  const testFiles = [
    {
      name: 'heat-shield-assembly.step',
      content: `STEP FILE FORMAT
PROJECT: ${testData.projectName}
PART NUMBER: HS-001-Rev-A
MATERIAL: Titanium Grade 5
CREATED: ${new Date().toISOString()}

This is a simulated STEP CAD file.
In production, this would be a full 3D CAD model.
File size would typically be 5-50MB.
`
    },
    {
      name: 'technical-drawing.pdf',
      content: `PDF TECHNICAL DRAWING
${testData.projectName}
Company: ${testData.companyName}
Contact: ${testData.contactName}

CRITICAL DIMENSIONS:
- Tolerance: ±0.0005"
- Surface Finish: 32 Ra
- Material: Titanium Grade 5

This simulates a PDF technical drawing.
`
    }
  ];
  
  const createdFiles = [];
  let totalSize = 0;
  
  for (const file of testFiles) {
    const filePath = path.join(__dirname, file.name);
    fs.writeFileSync(filePath, file.content);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    createdFiles.push(filePath);
    
    formData.append('files', fs.createReadStream(filePath), {
      filename: file.name,
      contentType: file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'
    });
    
    console.log(`  ✓ ${file.name} (${stats.size} bytes)`);
  }
  
  console.log(`\n🌐 Proxy URL: ${proxyUrl}`);
  console.log(`  (proxies to: https://speakhost.app.n8n.cloud/webhook/project-submission)`);
  
  try {
    console.log('\n⏳ Submitting through local proxy...\n');
    
    const startTime = Date.now();
    const response = await fetch(proxyUrl, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    const duration = Date.now() - startTime;
    
    console.log('━'.repeat(60));
    console.log('\n📡 Response:');
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Duration: ${duration}ms`);
    
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json();
      console.log('\n  Response Body (JSON):');
      console.log('  ' + JSON.stringify(responseData, null, 2).split('\n').join('\n  '));
    } else {
      responseData = await response.text();
      console.log('\n  Response Body:');
      console.log('  ' + responseData.substring(0, 200));
      if (responseData.length > 200) {
        console.log('  ...(truncated)');
      }
    }
    
    // Clean up test files
    for (const filePath of createdFiles) {
      fs.unlinkSync(filePath);
    }
    console.log(`\n🗑️  Cleaned up ${createdFiles.length} test files`);
    
    if (response.ok) {
      console.log('\n✅ TEST PASSED - Proxy submission successful!');
      
      console.log('\n📊 Summary:');
      console.log(`  ✓ Form fields: ${Object.keys(testData).length}`);
      console.log(`  ✓ Files uploaded: ${testFiles.length}`);
      console.log(`  ✓ Total payload: ${totalSize} bytes`);
      console.log(`  ✓ Response time: ${duration}ms`);
      console.log(`  ✓ Status: ${response.status} ${response.statusText}`);
      
      if (responseData?.id) {
        console.log(`  ✓ Google Drive File ID: ${responseData.id}`);
      }
      if (responseData?.webViewLink) {
        console.log(`  ✓ View Link: ${responseData.webViewLink}`);
      }
      
      console.log('\n💡 The n8n workflow:');
      console.log('  1. Received the form data');
      console.log('  2. Processed the files');
      console.log('  3. Created a job spec document');
      console.log('  4. Uploaded to Google Drive');
      console.log('  5. Returned the Drive file metadata');
      
    } else {
      console.log('\n❌ TEST FAILED - Proxy returned error');
      console.log(`  Status: ${response.status}`);
      console.log(`  Body: ${JSON.stringify(responseData, null, 2)}`);
    }
    
  } catch (error) {
    // Clean up test files on error
    for (const filePath of createdFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    console.log('\n❌ TEST FAILED - Error during submission:');
    console.error(`  ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the dev server is running:');
      console.log('  npm run dev');
    }
    
    process.exit(1);
  }
  
  console.log('\n' + '━'.repeat(60));
}

// Run the test
testLocalProxy();
