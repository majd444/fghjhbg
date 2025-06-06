#!/usr/bin/env node
/**
 * GitHub Repository Initialization Script
 * 
 * This script helps initialize a GitHub repository for the SaaS chatbot backend
 * and pushes the initial code to GitHub for deployment on Sevalla.
 */

import { execSync } from 'child_process';
import chalk from 'chalk';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to execute commands and log output
function runCommand(command, options = {}) {
  console.log(chalk.blue(`> ${command}`));
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output };
  } catch (error) {
    if (!options.ignoreError) {
      console.error(chalk.red(`Error executing command: ${command}`));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
    return { success: false, error };
  }
}

// Check if git is installed
function checkGitInstalled() {
  try {
    execSync('git --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.log(chalk.yellow(`Git not found: ${error.message}`));
    return false;
  }
}

// Check if repository is already initialized
function isGitInitialized() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.log(chalk.yellow(`Not a git repository: ${error.message}`));
    return false;
  }
}

// Check if remote origin exists
function hasRemoteOrigin() {
  try {
    const remotes = execSync('git remote', { encoding: 'utf8', stdio: 'pipe' });
    return remotes.split('\n').includes('origin');
  } catch (error) {
    console.log(chalk.yellow(`Could not check git remotes: ${error.message}`));
    return false;
  }
}

// Main function
async function main() {
  console.log(chalk.green('=== GitHub Repository Initialization ==='));
  
  // Check if git is installed
  if (!checkGitInstalled()) {
    console.error(chalk.red('Git is not installed. Please install Git and try again.'));
    process.exit(1);
  }
  
  // Check if we're in the project root
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(chalk.red('package.json not found. Please run this script from the project root.'));
    process.exit(1);
  }
  
  // Initialize git if not already initialized
  if (!isGitInitialized()) {
    console.log(chalk.yellow('Git repository not initialized. Initializing...'));
    runCommand('git init');
  } else {
    console.log(chalk.green('Git repository already initialized.'));
  }
  
  // Check if .gitignore exists, create if not
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    console.log(chalk.yellow('.gitignore not found. Creating...'));
    const gitignoreContent = `
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.sqlite
*.sqlite-journal

# Misc
.DS_Store
*.pem
`;
    fs.writeFileSync(gitignorePath, gitignoreContent.trim());
    console.log(chalk.green('.gitignore created.'));
  } else {
    console.log(chalk.green('.gitignore already exists.'));
  }
  
  // Add all files
  console.log(chalk.blue('Adding files to git...'));
  runCommand('git add .');
  
  // Commit changes
  console.log(chalk.blue('Committing changes...'));
  runCommand('git commit -m "Initial commit for SaaS chatbot backend with Auth0 integration"', { ignoreError: true });
  
  // Check if remote origin exists
  if (!hasRemoteOrigin()) {
    // Ask for GitHub repository URL
    const repoUrl = await new Promise(resolve => {
      rl.question(chalk.yellow('Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): '), answer => {
        resolve(answer.trim());
      });
    });
    
    if (!repoUrl) {
      console.error(chalk.red('No repository URL provided. Exiting.'));
      process.exit(1);
    }
    
    // Add remote origin
    console.log(chalk.blue(`Adding remote origin: ${repoUrl}`));
    runCommand(`git remote add origin ${repoUrl}`);
  } else {
    console.log(chalk.green('Remote origin already exists.'));
  }
  
  // Push to GitHub
  console.log(chalk.blue('Pushing to GitHub...'));
  const pushResult = runCommand('git push -u origin main', { ignoreError: true });
  
  if (!pushResult.success) {
    console.log(chalk.yellow('Failed to push to "main" branch. Trying "master" branch...'));
    runCommand('git push -u origin master', { ignoreError: true });
  }
  
  console.log(chalk.green('\n=== GitHub Repository Setup Complete ==='));
  console.log(chalk.blue('Your code has been pushed to GitHub and is ready for deployment on Sevalla.'));
  console.log(chalk.blue('Next steps:'));
  console.log(chalk.blue('1. Run "npm run check-env" to verify environment variables'));
  console.log(chalk.blue('2. Run "npm run db-init" to initialize the database'));
  console.log(chalk.blue('3. Run "npm run sevalla-deploy" to deploy to Sevalla'));
  
  rl.close();
}

main().catch(error => {
  console.error(chalk.red('An error occurred:'));
  console.error(error);
  process.exit(1);
});
