/**
 * Sevalla Deployment Script
 * 
 * This script helps deploy the backend server to Sevalla by:
 * 1. Creating the necessary configuration files
 * 2. Setting up environment variables
 * 3. Configuring database persistence
 * 4. Deploying the application
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration template for sevalla.json
const sevallaConfigTemplate = {
  "name": "chatbot-backend",
  "type": "node",
  "env": "production",
  "region": "us-east-1",
  "resources": {
    "database": {
      "type": "sqlite",
      "persistent": true
    }
  },
  "build": {
    "command": "npm install"
  },
  "start": {
    "command": "node index.js"
  },
  "port": 3001,
  "scale": {
    "min": 1,
    "max": 5
  }
};

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to check if Sevalla CLI is installed
function checkSevallaCliInstalled() {
  try {
    execSync('sevalla --version', { stdio: 'ignore' });
    return true;
  } catch {
    // Silently handle the error when Sevalla CLI is not installed
    return false;
  }
}

// Function to create sevalla.json configuration file
function createSevallaConfig(config) {
  fs.writeFileSync(
    path.join(process.cwd(), 'sevalla.json'),
    JSON.stringify(config, null, 2)
  );
  console.log('✅ Created sevalla.json configuration file');
}

// Function to set environment variables in Sevalla
async function setEnvironmentVariables() {
  console.log('\n📝 Setting up environment variables...');
  
  const defaultApiKey = await prompt('Enter your DEFAULT_API_KEY (leave blank to generate one): ');
  const apiKey = defaultApiKey || `api_${Math.random().toString(36).substring(2, 15)}`;
  
  const appUrl = await prompt('Enter your frontend app URL: ');
  
  // Get the Sevalla app URL
  console.log('\n🔍 Getting Sevalla app URL...');
  let sevallaAppUrl;
  try {
    const appInfoOutput = execSync('sevalla info', { encoding: 'utf8' });
    const urlMatch = appInfoOutput.match(/URL:\s+(https:\/\/[\w-]+\.sevalla\.app)/);
    sevallaAppUrl = urlMatch ? urlMatch[1] : null;
  } catch (error) {
    console.log('⚠️ Could not automatically determine Sevalla app URL:', error.message);
    sevallaAppUrl = await prompt('Enter your Sevalla app URL (e.g., https://your-app.sevalla.app): ');
  }
  
  if (!sevallaAppUrl) {
    console.error('❌ Sevalla app URL is required');
    process.exit(1);
  }
  
  // Set environment variables
  console.log('\n🔒 Setting environment variables in Sevalla...');
  try {
    execSync(`sevalla env set DEFAULT_API_KEY=${apiKey}`, { stdio: 'inherit' });
    execSync(`sevalla env set API_USAGE_ENDPOINT=${sevallaAppUrl}/api/usage/track`, { stdio: 'inherit' });
    execSync(`sevalla env set PLUGIN_INTERACTION_ENDPOINT=${sevallaAppUrl}/api/embed/chat`, { stdio: 'inherit' });
    
    if (appUrl) {
      execSync(`sevalla env set NEXT_PUBLIC_APP_URL=${appUrl}`, { stdio: 'inherit' });
    }
    
    console.log('✅ Environment variables set successfully');
  } catch (error) {
    console.error('❌ Failed to set environment variables:', error.message);
    process.exit(1);
  }
  
  return { apiKey, sevallaAppUrl };
}

// Function to configure database persistence
function configureDatabasePersistence() {
  console.log('\n💾 Configuring database persistence...');
  
  try {
    // Check if storage already exists
    const storageListOutput = execSync('sevalla storage list', { encoding: 'utf8' });
    
    if (!storageListOutput.includes('chatbot-db')) {
      console.log('Creating storage volume...');
      execSync('sevalla storage create --name chatbot-db --size 1GB', { stdio: 'inherit' });
    } else {
      console.log('Storage volume already exists');
    }
    
    console.log('Mounting storage volume...');
    execSync('sevalla storage mount --name chatbot-db --path /app/data', { stdio: 'inherit' });
    
    console.log('✅ Database persistence configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure database persistence:', error.message);
    console.log('⚠️ You may need to configure storage manually after deployment');
    // Log detailed error for debugging
    console.debug('Storage configuration error details:', error);
  }
}

// Function to deploy the application
function deployApplication() {
  console.log('\n🚀 Deploying application to Sevalla...');
  
  try {
    execSync('sevalla deploy', { stdio: 'inherit' });
    console.log('✅ Application deployed successfully');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('🌟 Sevalla Deployment Script for SaaS Chatbot Backend 🌟\n');
  
  // Check if Sevalla CLI is installed
  if (!checkSevallaCliInstalled()) {
    console.error('❌ Sevalla CLI is not installed. Please install it using: npm install -g @sevalla/cli');
    process.exit(1);
  }
  
  // Check if user is logged in to Sevalla
  try {
    execSync('sevalla whoami', { stdio: 'ignore' });
  } catch (error) {
    console.log('⚠️ You are not logged in to Sevalla. Please login first. Error:', error.message);
    execSync('sevalla login', { stdio: 'inherit' });
  }
  
  // Ask user if they want to initialize a new Sevalla project
  const initProject = await prompt('Initialize a new Sevalla project? (y/n): ');
  
  if (initProject.toLowerCase() === 'y') {
    try {
      console.log('\n🔧 Initializing Sevalla project...');
      execSync('sevalla init', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️ Failed to initialize Sevalla project. Using default configuration. Error:', error.message);
      createSevallaConfig(sevallaConfigTemplate);
    }
  } else {
    // Check if sevalla.json exists, if not create it
    if (!fs.existsSync(path.join(process.cwd(), 'sevalla.json'))) {
      console.log('\n🔧 Creating Sevalla configuration...');
      createSevallaConfig(sevallaConfigTemplate);
    }
  }
  
  // Set environment variables
  const { apiKey, sevallaAppUrl } = await setEnvironmentVariables();
  
  // Configure database persistence
  configureDatabasePersistence();
  
  // Ask user if they want to deploy now
  const deployNow = await prompt('\nDeploy application now? (y/n): ');
  
  if (deployNow.toLowerCase() === 'y') {
    deployApplication();
    
    console.log(`\n🎉 Deployment complete! Your API key is: ${apiKey}`);
    console.log(`\n📝 Update your frontend application with these settings:`);
    console.log(`- API_USAGE_ENDPOINT: ${sevallaAppUrl}/api/usage/track`);
    console.log(`- PLUGIN_INTERACTION_ENDPOINT: ${sevallaAppUrl}/api/embed/chat`);
  } else {
    console.log('\n⏸️ Deployment skipped. You can deploy later using: sevalla deploy');
    console.log(`\n🔑 Your API key is: ${apiKey}`);
  }
  
  rl.close();
}

// Run the script
main().catch((error) => {
  console.error('❌ An error occurred:', error);
  process.exit(1);
});
