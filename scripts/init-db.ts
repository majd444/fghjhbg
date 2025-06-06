/**
 * Database Initialization Script
 * 
 * This script initializes the SQLite database with the necessary tables
 * for the SaaS chatbot platform. It creates tables for accounts, agents,
 * plugins, and other required data structures.
 */

import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, 'chatbot.db');
console.log(`Initializing database at: ${dbPath}`);

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create accounts table
function createAccountsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS accounts (
      account_id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      picture TEXT,
      created_at TEXT NOT NULL,
      last_login TEXT NOT NULL,
      metadata TEXT
    )
  `;
  
  try {
    db.exec(query);
    console.log('✅ Accounts table created or already exists');
  } catch (error) {
    console.error('❌ Error creating accounts table:', error);
    throw error;
  }
}

// Create agents table
function createAgentsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS agents (
      agent_id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      config TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(account_id)
    )
  `;
  
  try {
    db.exec(query);
    console.log('✅ Agents table created or already exists');
  } catch (error) {
    console.error('❌ Error creating agents table:', error);
    throw error;
  }
}

// Create plugins table
function createPluginsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS plugins (
      plugin_id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      config TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(account_id),
      FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    )
  `;
  
  try {
    db.exec(query);
    console.log('✅ Plugins table created or already exists');
  } catch (error) {
    console.error('❌ Error creating plugins table:', error);
    throw error;
  }
}

// Create conversations table
function createConversationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      external_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    )
  `;
  
  try {
    db.exec(query);
    console.log('✅ Conversations table created or already exists');
  } catch (error) {
    console.error('❌ Error creating conversations table:', error);
    throw error;
  }
}

// Create messages table
function createMessagesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      message_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      metadata TEXT,
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
    )
  `;
  
  try {
    db.exec(query);
    console.log('✅ Messages table created or already exists');
  } catch (error) {
    console.error('❌ Error creating messages table:', error);
    throw error;
  }
}

// Create indexes for better performance
function createIndexes() {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email)',
    'CREATE INDEX IF NOT EXISTS idx_agents_account_id ON agents(account_id)',
    'CREATE INDEX IF NOT EXISTS idx_plugins_account_id ON plugins(account_id)',
    'CREATE INDEX IF NOT EXISTS idx_plugins_agent_id ON plugins(agent_id)',
    'CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id)',
    'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)'
  ];
  
  try {
    indexes.forEach(index => db.exec(index));
    console.log('✅ Indexes created or already exist');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

// Main initialization function
function initializeDatabase() {
  console.log('🔄 Starting database initialization...');
  
  // Run all initialization functions in a transaction
  db.transaction(() => {
    createAccountsTable();
    createAgentsTable();
    createPluginsTable();
    createConversationsTable();
    createMessagesTable();
    createIndexes();
  })();
  
  console.log('✅ Database initialization completed successfully');
}

// Run the initialization
try {
  initializeDatabase();
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
} finally {
  // Close the database connection
  db.close();
}
