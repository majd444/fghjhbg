/**
 * Test script for the Auth0 Profile API
 * 
 * This script tests the profile API endpoints:
 * - GET /api/auth/profile - Get user profile
 * - PUT /api/auth/profile - Update user profile
 * - PATCH /api/auth/profile - Sync profile with Auth0
 */

// Mock user ID for testing - use the same format as in the account creation process
const TEST_USER_ID = 'mock-user-123';
const TEST_EMAIL = 'mock-user@example.com';
const API_BASE_URL = 'http://localhost:3004';

// Store account information after creation
let accountId = null;

// Helper function to make API requests
async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // Include credentials to send/receive cookies
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making ${method} request to ${url}`);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making ${method} request to ${endpoint}:`, error);
    return { status: 500, error: error.message };
  }
}

// Test strategies endpoint
async function testStrategies() {
  console.log('\n=== Testing GET /api/auth/strategies ===');
  return await makeRequest('GET', '/api/auth/strategies');
}

// Create a test account
async function createTestAccount() {
  console.log('\n=== Creating test account ===');
  const result = await makeRequest('POST', '/api/account', {
    userId: TEST_USER_ID,
    email: TEST_EMAIL
  });
  
  if (result.status === 200 && result.data.account) {
    accountId = result.data.account.accountId;
    console.log(`Created account with ID: ${accountId}`);
    return result.data.account;
  }
  
  console.error('Failed to create test account');
  return null;
}

// Test GET profile endpoint
async function testGetProfile() {
  console.log('\n=== Testing GET /api/auth/profile ===');
  // We need to use the userId from Auth0, not the accountId
  // Note: In our database, the userId and email fields might be swapped
  // Try both the userId and email fields
  const response = await makeRequest('GET', `/api/auth/profile?userId=${TEST_USER_ID}`);
  
  // If the first attempt fails, try with the email field
  if (response.status === 404) {
    console.log('User not found with userId, trying with email...');
    return await makeRequest('GET', `/api/auth/profile?userId=${TEST_EMAIL}`);
  }
  
  return response;
}

// Test PUT profile endpoint to update profile
async function testUpdateProfile() {
  console.log('\n=== Testing PUT /api/auth/profile ===');
  
  // First get the profile to determine which field is the userId
  const profileResponse = await testGetProfile();
  
  if (profileResponse.status !== 200) {
    console.error('Cannot update profile: user not found');
    return profileResponse;
  }
  
  // Use the userId from the retrieved profile
  const userId = profileResponse.data.profile.userId;
  
  const profileData = {
    userId: userId,
    name: 'Test User Updated',
    picture: 'https://example.com/updated-picture.jpg',
    metadata: {
      favoriteColor: 'blue',
      preferredLanguage: 'JavaScript'
    }
  };
  
  return await makeRequest('PUT', '/api/auth/profile', profileData);
}

// Test PATCH profile endpoint to sync with Auth0
async function testSyncProfile() {
  console.log('\n=== Testing PATCH /api/auth/profile ===');
  
  // First get the profile to determine which field is the userId
  const profileResponse = await testGetProfile();
  
  if (profileResponse.status !== 200) {
    console.error('Cannot sync profile: user not found');
    return profileResponse;
  }
  
  // Use the userId from the retrieved profile
  const userId = profileResponse.data.profile.userId;
  
  return await makeRequest('PATCH', `/api/auth/profile?userId=${userId}`);
}

// Run all tests
async function runTests() {
  console.log('Starting profile API tests...');
  
  // Test strategies endpoint first
  await testStrategies();
  
  // Create an account for our test user
  const account = await createTestAccount();
  if (!account) {
    console.error('Cannot proceed with tests without a valid account');
    return;
  }
  
  // Test profile endpoints
  await testGetProfile();
  await testUpdateProfile();
  await testGetProfile(); // Get profile again to verify update
  await testSyncProfile();
  
  console.log('\nAll tests completed!');
}

// Run the tests
runTests().catch(console.error);
