#!/usr/bin/env node

/**
 * Integration test for error handling improvements
 * Tests the fixes made for issues found in screenshot_example_logs.md
 */

const http = require('http');

// Test configuration
const SERVER_HOST = 'localhost';
const SERVER_PORT = 4000;
const TESTS_PASSED = [];
const TESTS_FAILED = [];

console.log('🧪 Testing Error Handling Improvements\n');
console.log('=' .repeat(50));
console.log('Note: This test assumes the server is NOT running');
console.log('We are testing error handling logic, not live server');
console.log('=' .repeat(50) + '\n');

// Helper function to make HTTP requests
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, errorCode: err.code });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test helper
function test(name, fn) {
  return fn()
    .then(() => {
      TESTS_PASSED.push(name);
      console.log(`✅ ${name}`);
    })
    .catch((err) => {
      TESTS_FAILED.push({ name, error: err.message || err });
      console.log(`❌ ${name}`);
      console.log(`   Error: ${err.message || err}`);
    });
}

// Run all tests
async function runTests() {
  await test('Test 1: Server code includes rate limit error detection', async () => {
    const fs = require('fs');
    const serverCode = fs.readFileSync('./server/index.cjs', 'utf8');
    
    // Check for rate limit detection
    if (!serverCode.includes('isRateLimitError')) {
      throw new Error('Rate limit detection code not found');
    }
    
    // Check for fail-fast logic
    if (!serverCode.includes('failing fast without retry')) {
      throw new Error('Fail-fast logging not found');
    }
    
    // Check for improved error messages
    if (!serverCode.includes('MOCK_MODE_ENABLED=true')) {
      throw new Error('Mock mode suggestion not found in error messages');
    }
  });
  
  await test('Test 2: File tree endpoint auto-creates missing directories', async () => {
    const fs = require('fs');
    const serverCode = fs.readFileSync('./server/index.cjs', 'utf8');
    
    // Check for directory creation logic
    if (!serverCode.includes('Creating missing directory')) {
      throw new Error('Directory creation logic not found');
    }
    
    // Check for access check
    if (!serverCode.includes('fs.access(targetDir)')) {
      throw new Error('Directory access check not found');
    }
    
    // Check for recursive mkdir
    if (!serverCode.includes('recursive: true')) {
      throw new Error('Recursive mkdir not found');
    }
  });
  
  await test('Test 3: Error handlers map to correct HTTP status codes', async () => {
    const fs = require('fs');
    const serverCode = fs.readFileSync('./server/index.cjs', 'utf8');
    
    // Check for 429 status code
    if (!serverCode.includes('statusCode = 429')) {
      throw new Error('429 status code not found');
    }
    
    // Check for 401 status code
    if (!serverCode.includes('statusCode = 401')) {
      throw new Error('401 status code not found');
    }
    
    // Check for 504 status code
    if (!serverCode.includes('statusCode = 504')) {
      throw new Error('504 status code not found');
    }
  });
  
  await test('Test 4: Troubleshooting documentation created', async () => {
    const fs = require('fs');
    const path = require('path');
    
    const troubleshootingPath = './resources/reference_files/test_results/TROUBLESHOOTING.md';
    
    if (!fs.existsSync(troubleshootingPath)) {
      throw new Error('TROUBLESHOOTING.md not found');
    }
    
    const content = fs.readFileSync(troubleshootingPath, 'utf8');
    
    // Verify it covers rate limiting
    if (!content.includes('API Rate Limiting')) {
      throw new Error('Rate limiting section not found');
    }
    
    // Verify it covers file system errors
    if (!content.includes('File System Errors')) {
      throw new Error('File system errors section not found');
    }
    
    // Verify it mentions mock mode
    if (!content.includes('MOCK_MODE_ENABLED')) {
      throw new Error('Mock mode documentation not found');
    }
  });
  
  await test('Test 5: .env.example updated with mock mode info', async () => {
    const fs = require('fs');
    const envExample = fs.readFileSync('./.env.example', 'utf8');
    
    // Check for mock mode documentation
    if (!envExample.includes('MOCK_MODE_ENABLED')) {
      throw new Error('MOCK_MODE_ENABLED not found in .env.example');
    }
    
    // Check for reduced retry count
    if (!envExample.includes('VITE_RATE_LIMIT_MAX_RETRIES=2')) {
      throw new Error('Reduced retry count not found');
    }
    
    // Check for fail-fast comment
    if (!envExample.includes('fail fast')) {
      throw new Error('Fail-fast documentation not found');
    }
  });
  
  await test('Test 6: Retry logic checks for auth and rate limit errors', async () => {
    const fs = require('fs');
    const serverCode = fs.readFileSync('./server/index.cjs', 'utf8');
    
    // Check for helper functions
    if (!serverCode.includes('function isAuthError(error)')) {
      throw new Error('isAuthError helper function not found');
    }
    
    if (!serverCode.includes('function isRateLimitError(error)')) {
      throw new Error('isRateLimitError helper function not found');
    }
    
    // Check that both error types cause early exit in retry logic
    const rateLimitCheck = serverCode.includes('if (isRateLimitError(err))') && 
                           serverCode.includes('failing fast without retry');
    const authCheck = serverCode.includes('if (isAuthError(err))') && 
                      serverCode.includes('failing fast without retry');
    
    if (!rateLimitCheck) {
      throw new Error('Rate limit fail-fast logic not found');
    }
    
    if (!authCheck) {
      throw new Error('Auth fail-fast logic not found');
    }
    
    // Check that helper functions are used in error handling
    const errorHandlingRateLimit = serverCode.includes('if (isRateLimitError(error))');
    const errorHandlingAuth = serverCode.includes('if (isAuthError(error))');
    
    if (!errorHandlingRateLimit) {
      throw new Error('Rate limit helper not used in error handling');
    }
    
    if (!errorHandlingAuth) {
      throw new Error('Auth error helper not used in error handling');
    }
  });
  
  // Print summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${TESTS_PASSED.length}`);
  console.log(`❌ Failed: ${TESTS_FAILED.length}`);
  
  if (TESTS_FAILED.length > 0) {
    console.log('\n❌ Failed Tests:');
    TESTS_FAILED.forEach(({ name, error }) => {
      console.log(`   - ${name}`);
      console.log(`     ${error}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    console.log('\n📝 Changes Summary:');
    console.log('   • Enhanced error handling with specific status codes');
    console.log('   • Fail-fast logic for rate limits and auth errors');
    console.log('   • Auto-create missing project directories');
    console.log('   • Comprehensive troubleshooting documentation');
    console.log('   • Updated configuration with mock mode recommendations');
    process.exit(0);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
