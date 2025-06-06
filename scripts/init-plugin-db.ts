/**
 * Initialize Plugin Database
 * 
 * This script initializes the plugin database tables and ensures they're ready for use.
 * Run this script after setting up the application to prepare the plugin system.
 */
import { pluginDb } from '../lib/database/plugin-db';
import path from 'path';
import fs from 'fs';

async function initializePluginDatabase() {
  console.log('Initializing plugin database...');
  
  // The plugin database is automatically initialized when imported
  // This script just ensures it's properly set up and reports status
  
  try {
    // Check if the database file exists
    const dataDir = path.join(process.cwd(), 'data');
    const dbPath = path.join(dataDir, 'plugins.db');
    
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(dbPath)) {
      console.log('Plugin database does not exist yet. It will be created when the application runs.');
    } else {
      console.log('Plugin database already exists at:', dbPath);
    }
    
    // Test database connection by getting plugin configs
    const testConfigs = await pluginDb.getPluginConfigs('test-user');
    console.log('Successfully connected to plugin database.');
    console.log(`Found ${testConfigs.length} test plugin configurations.`);
    
    console.log('Plugin database initialization complete!');
  } catch (error) {
    console.error('Error initializing plugin database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializePluginDatabase().catch(error => {
  console.error('Unhandled error during plugin database initialization:', error);
  process.exit(1);
});
