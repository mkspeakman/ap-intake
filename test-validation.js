/**
 * Test script for capability analysis validation
 * Tests both valid and invalid requests
 */

async function testValidation() {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing Capability Analysis Validation\n');
  
  // Test 1: Invalid request - no materials
  console.log('Test 1: No materials specified');
  const test1 = await fetch(`${API_URL}/api/analyze-capability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quote_id: 'test-001',
      materials: [],
      quantity: 100,
      description: 'I need 100 pizzas delivered by Friday',
    }),
  });
  const result1 = await test1.json();
  console.log('Result:', result1.data?.validation_failed ? '✅ REJECTED' : '❌ ACCEPTED');
  console.log('Feasibility:', result1.data?.feasibility);
  console.log('Errors:', result1.data?.analysis?.validation_errors);
  console.log('');
  
  // Test 2: Invalid request - no manufacturing context
  console.log('Test 2: No manufacturing context in description');
  const test2 = await fetch(`${API_URL}/api/analyze-capability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quote_id: 'test-002',
      materials: ['Aluminum'],
      quantity: 0,
      description: 'Pizza',
    }),
  });
  const result2 = await test2.json();
  console.log('Result:', result2.data?.validation_failed ? '✅ REJECTED' : '❌ ACCEPTED');
  console.log('Feasibility:', result2.data?.feasibility);
  console.log('Errors:', result2.data?.analysis?.validation_errors);
  console.log('');
  
  // Test 3: Valid request - should pass
  console.log('Test 3: Valid manufacturing request');
  const test3 = await fetch(`${API_URL}/api/analyze-capability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quote_id: 'test-003',
      materials: ['Aluminum 6061'],
      quantity: 50,
      description: 'CNC machined bracket with tight tolerances, requires drilling and milling operations',
      operations: ['milling', 'drilling'],
    }),
  });
  const result3 = await test3.json();
  console.log('Result:', result3.data?.validation_failed ? '❌ REJECTED' : '✅ ACCEPTED');
  console.log('Feasibility:', result3.data?.feasibility);
  console.log('Machine matches:', result3.data?.machine_matches?.length || 0);
  console.log('');
}

testValidation().catch(console.error);
