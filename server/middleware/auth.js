/**
 * Authentication Middleware
 * 
 * This middleware handles API key authentication for the backend server.
 */

/**
 * Authenticate API key middleware
 * Verifies that the request contains a valid API key
 */
const authenticateApiKey = (db) => (req, res, next) => {
  try {
    // Get API key from header or query string
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }
    
    // Check if it's the default API key from environment variables
    const defaultApiKey = process.env.DEFAULT_API_KEY;
    if (apiKey === defaultApiKey) {
      // Allow access with default API key
      req.apiKeyUser = {
        id: 'system',
        name: 'System',
        isDefault: true
      };
      return next();
    }
    
    // Look up API key in database
    const apiKeyRecord = db.prepare(`
      SELECT * FROM api_keys WHERE api_key = ?
    `).get(apiKey);
    
    if (!apiKeyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Check if API key is expired
    if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
      return res.status(401).json({ error: 'API key has expired' });
    }
    
    // Update last used timestamp
    db.prepare(`
      UPDATE api_keys
      SET last_used_at = ?
      WHERE api_key = ?
    `).run(new Date().toISOString(), apiKey);
    
    // Add user info to request
    req.apiKeyUser = {
      id: apiKeyRecord.user_id,
      name: apiKeyRecord.name || 'API User',
      isDefault: false
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Rate limiting middleware
 * Limits the number of requests per minute from a single IP address
 */
const rateLimit = (limit = 60, windowMs = 60000) => {
  const requests = {};
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Initialize if this is the first request from this IP
    if (!requests[ip]) {
      requests[ip] = {
        count: 0,
        resetTime: Date.now() + windowMs
      };
    }
    
    // Reset count if the window has passed
    if (Date.now() > requests[ip].resetTime) {
      requests[ip] = {
        count: 0,
        resetTime: Date.now() + windowMs
      };
    }
    
    // Increment request count
    requests[ip].count++;
    
    // Check if limit is exceeded
    if (requests[ip].count > limit) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retryAfter: Math.ceil((requests[ip].resetTime - Date.now()) / 1000)
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateApiKey,
  rateLimit
};
