#!/usr/bin/env node

/**
 * Simple utility script to test the account API
 * Run this script with Node.js while your Next.js app is running
 */

const fetch = require('node-fetch');

// Base URL of your Next.js app
const BASE_URL = 'http://localhost:3000';

async function testAccountAPI() {
  try {
    console.log('Testing Account API with Auth0-style pagination...\n');
    
    // Test the paginated accounts endpoint
    const response = await fetch(`${BASE_URL}/api/account?all=true&include_totals=true&page=0&limit=5`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Display account information in a table format
    if (data.accounts && Array.isArray(data.accounts)) {
      console.log('\nAccounts:');
      console.log('-'.repeat(100));
      console.log('| Account ID                           | User ID                | Email                          |');
      console.log('-'.repeat(100));
      
      data.accounts.forEach(account => {
        const accountId = account.accountId.padEnd(35);
        const userId = account.userId.substring(0, 20).padEnd(22);
        const email = account.email.substring(0, 30).padEnd(30);
        console.log(`| ${accountId} | ${userId} | ${email} |`);
      });
      
      console.log('-'.repeat(100));
      console.log(`Total accounts: ${data.total}, Showing: ${data.length}, Page: ${data.start/data.limit + 1}`);
    }
  } catch (error) {
    console.error('Error testing account API:', error.message);
  }
}

// Execute the test
testAccountAPI();
