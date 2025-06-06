#!/usr/bin/env node
/**
 * Sevalla Deployment Script
 * 
 * This script automates the deployment of the SaaS chatbot backend to Sevalla.
 * It handles building the application, validating the configuration, and deploying to Sevalla.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  projectName: 'saas-chatbot-backend',
  buildCommand: 'npm run build',
  deployCommand: 'sevalla deploy',
  configFile: 'sevalla.config.js'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Execute a shell command and return the output
 */
function executeCommand(command, options = {}) {
  console.log(`${colors.dim}> ${command}${colors.reset}`);
  try {
    return execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      ...options
    });
  } catch (error) {
    if (!options.ignoreError) {
      console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
      process.exit(1);
    }
    return null;
  }
}

/**
 * Check if Sevalla CLI is installed
 */
function checkSevallaInstallation() {
  try {
    const version = executeCommand('sevalla --version', { silent: true });
    console.log(`${colors.green}✓ Sevalla CLI detected: ${version.trim()}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Sevalla CLI not found: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}To install Sevalla CLI, run:${colors.reset}`);
    console.log(`${colors.cyan}npm install -g @sevalla/cli${colors.reset}`);
    console.log(`${colors.yellow}After installation, you'll need to log in:${colors.reset}`);
    console.log(`${colors.cyan}sevalla login${colors.reset}`);
    console.log(`\n${colors.bright}${colors.yellow}NOTE: If you're just preparing for deployment and don't have Sevalla CLI yet,${colors.reset}`);
    console.log(`${colors.bright}${colors.yellow}you can continue with the GitHub repository setup first:${colors.reset}`);
    console.log(`${colors.cyan}npm run github-init${colors.reset}`);
    return false;
  }
}

/**
 * Validate the Sevalla configuration file
 */
async function validateConfig() {
  const configPath = path.join(process.cwd(), config.configFile);
  
  if (!fs.existsSync(configPath)) {
    console.error(`${colors.red}✗ Sevalla configuration file not found: ${config.configFile}${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Sevalla configuration file found${colors.reset}`);
  
  try {
    // Load and validate the configuration using dynamic import for ES modules
    const configModule = await import(`file://${configPath}`);
    const sevallaConfig = configModule.default;
    
    if (!sevallaConfig.name) {
      console.error(`${colors.red}✗ Missing 'name' in Sevalla configuration${colors.reset}`);
      process.exit(1);
    }
    
    if (!sevallaConfig.entrypoint) {
      console.error(`${colors.red}✗ Missing 'entrypoint' in Sevalla configuration${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`${colors.green}✓ Sevalla configuration is valid${colors.reset}`);
    return sevallaConfig;
  } catch (error) {
    console.error(`${colors.red}✗ Error loading Sevalla configuration: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Build the application
 */
async function buildApplication() {
  console.log(`${colors.bright}${colors.blue}Building application...${colors.reset}`);
  executeCommand(config.buildCommand);
  console.log(`${colors.green}✓ Build completed successfully${colors.reset}`);
}

/**
 * Deploy to Sevalla
 */
async function deployToSevalla() {
  console.log(`${colors.bright}${colors.blue}Deploying to Sevalla...${colors.reset}`);
  executeCommand(config.deployCommand);
  console.log(`${colors.green}✓ Deployment completed successfully${colors.reset}`);
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.bright}${colors.cyan}=== Sevalla Deployment Script ===${colors.reset}\n`);
  
  // Check if Sevalla CLI is installed
  const sevallaInstalled = checkSevallaInstallation();
  
  if (!sevallaInstalled) {
    console.log(`\n${colors.yellow}Skipping deployment due to missing Sevalla CLI.${colors.reset}`);
    console.log(`${colors.yellow}Please install Sevalla CLI and try again when ready.${colors.reset}`);
    return;
  }
  
  try {
    // Validate Sevalla configuration
    const sevallaConfig = await validateConfig();
    
    // Build the application
    await buildApplication();
    
    // Deploy to Sevalla
    await deployToSevalla();
    
    console.log(`\n${colors.bright}${colors.green}=== Deployment Completed Successfully ===${colors.reset}`);
    console.log(`${colors.green}Your application has been deployed to Sevalla!${colors.reset}`);
    console.log(`${colors.green}Project: ${sevallaConfig.name}${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}=== Deployment Failed ===${colors.reset}`);
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
  process.exit(1);
});
