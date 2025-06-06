/**
 * Chatbot Backend Server
 * 
 * This server provides API endpoints for:
 * - API key management
 * - API usage tracking
 * - Plugin interaction logging
 * - HTML & CSS plugin integration
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3002;

// Determine database path (for Sevalla compatibility)
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join(process.env.DB_PATH || '/app/data', 'chatbot.db')
  : './chatbot.db';

console.log(`Using database at: ${dbPath}`);

// Initialize the database
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  -- API keys table
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TEXT NOT NULL,
    last_used_at TEXT,
    expires_at TEXT
  );

  -- API usage table
  CREATE TABLE IF NOT EXISTS api_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    agent_id INTEGER NOT NULL,
    plugin_id TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    date TEXT NOT NULL,
    request_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    UNIQUE(user_id, agent_id, plugin_id, endpoint, date)
  );

  -- Plugin interactions table
  CREATE TABLE IF NOT EXISTS plugin_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    visitor_id TEXT,
    plugin_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    tokens INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL
  );

  -- Events table for tracking
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    visitor_id TEXT,
    url TEXT,
    referrer TEXT,
    timestamp TEXT NOT NULL,
    data TEXT
  );
`);

// Create default API key if it doesn't exist
const defaultApiKey = process.env.DEFAULT_API_KEY;
if (defaultApiKey) {
  const existingKey = db.prepare('SELECT * FROM api_keys WHERE api_key = ?').get(defaultApiKey);
  if (!existingKey) {
    console.log('Creating default API key');
    db.prepare(`
      INSERT INTO api_keys (
        user_id,
        api_key,
        name,
        created_at
      ) VALUES (?, ?, ?, ?)
    `).run(
      'system',
      defaultApiKey,
      'Default API Key',
      new Date().toISOString()
    );
  }
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Import route modules
const apiKeysRoutes = require('./routes/api-keys')(db);
const usageRoutes = require('./routes/usage')(db);
const trackRoutes = require('./routes/track')(db);
const embedRoutes = require('./routes/embed')(db);

// Apply routes
app.use('/api/keys', apiKeysRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/embed', embedRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'production' ? undefined : err.message 
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API tracking enabled: ${!!defaultApiKey}`);
});
