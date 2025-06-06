#!/usr/bin/env node
/**
 * Environment Variable Checker
 * 
 * This script checks if all required environment variables are set
 * and provides guidance on how to set them if they're missing.
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log(chalk.blue('Loading environment variables from .env file'));
  dotenv.config({ path: envPath });
}

// Define required environment variables
const requiredVariables = [
  {
    name: 'NEXT_PUBLIC_AUTH0_DOMAIN',
    description: 'Your Auth0 domain (e.g., your-tenant.auth0.com)',
    example: 'your-tenant.auth0.com'
  },
  {
    name: 'NEXT_PUBLIC_AUTH0_CLIENT_ID',
    description: 'Your Auth0 client ID',
    example: 'abcdefghijklmnopqrstuvwxyz123456'
  },
  {
    name: 'NEXT_PUBLIC_AUTH0_AUDIENCE',
    description: 'Your Auth0 API audience URL',
    example: 'https://api.yourdomain.com'
  },
  {
    name: 'NEXT_PUBLIC_AUTH0_REDIRECT_URI',
    description: 'The redirect URI after Auth0 authentication',
    example: 'http://localhost:3000/callback'
  }
];

// Define optional environment variables
const optionalVariables = [
  {
    name: 'NODE_ENV',
    description: 'Environment mode (development, production)',
    example: 'production',
    default: 'development'
  },
  {
    name: 'PORT',
    description: 'Port to run the server on',
    example: '3002',
    default: '3002'
  },
  {
    name: 'DEFAULT_API_KEY',
    description: 'Default API key for authentication',
    example: 'api_key_12345',
    default: 'Generated automatically if not provided'
  }
];

// Check required environment variables
console.log(chalk.bold('\nChecking required environment variables:'));
let missingRequired = false;

requiredVariables.forEach(variable => {
  if (process.env[variable.name]) {
    console.log(chalk.green(`✓ ${variable.name} is set`));
  } else {
    console.log(chalk.red(`✗ ${variable.name} is not set`));
    console.log(chalk.yellow(`  Description: ${variable.description}`));
    console.log(chalk.yellow(`  Example: ${variable.example}`));
    missingRequired = true;
  }
});

// Check optional environment variables
console.log(chalk.bold('\nChecking optional environment variables:'));

optionalVariables.forEach(variable => {
  if (process.env[variable.name]) {
    console.log(chalk.green(`✓ ${variable.name} is set to: ${process.env[variable.name]}`));
  } else {
    console.log(chalk.yellow(`○ ${variable.name} is not set (will use default: ${variable.default})`));
    console.log(chalk.gray(`  Description: ${variable.description}`));
  }
});

// Provide guidance if required variables are missing
if (missingRequired) {
  console.log(chalk.bold.red('\n⚠️ Some required environment variables are missing!'));
  console.log(chalk.yellow('Please set them in a .env file or in your environment before deploying.'));
  
  console.log(chalk.bold('\nExample .env file:'));
  let exampleEnv = '';
  
  requiredVariables.forEach(variable => {
    exampleEnv += `${variable.name}=${variable.example}\n`;
  });
  
  optionalVariables.forEach(variable => {
    exampleEnv += `# ${variable.name}=${variable.example}\n`;
  });
  
  console.log(chalk.gray(exampleEnv));
  
  process.exit(1);
} else {
  console.log(chalk.bold.green('\n✓ All required environment variables are set!'));
  console.log(chalk.blue('Your application is ready to be deployed.'));
}
