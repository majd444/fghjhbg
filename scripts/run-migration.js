#!/usr/bin/env node

/**
 * Script to run the TypeScript migration script
 */
const { execSync } = require('child_process');
const path = require('path');

// Define paths
const scriptPath = path.join(__dirname, 'migrate-agents-to-sqlite.ts');

console.log('Compiling and running migration script...');

try {
  // Run the migration script using ts-node
  execSync(`npx ts-node ${scriptPath}`, { stdio: 'inherit' });
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
