/**
 * Run Plugin Database Initialization
 * 
 * This script runs the TypeScript plugin database initialization script using ts-node.
 * Usage: node scripts/run-plugin-init.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Path to the TypeScript initialization script
const scriptPath = path.join(__dirname, 'init-plugin-db.ts');

// Run the script with ts-node
const tsNode = spawn('npx', ['ts-node', scriptPath], {
  stdio: 'inherit',
  shell: true
});

tsNode.on('close', (code) => {
  if (code === 0) {
    console.log('Plugin database initialization completed successfully!');
  } else {
    console.error(`Plugin database initialization failed with code ${code}`);
    process.exit(code);
  }
});
