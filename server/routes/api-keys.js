/**
 * API Key Management Routes
 * 
 * These routes handle API key creation, listing, and deletion
 * for secure access to the chatbot API.
 */
const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');
const crypto = require('crypto');

module.exports = (db) => {
  /**
   * @route GET /api/keys
   * @desc Get all API keys for a user
   * @access Private (requires API key)
   */
  router.get('/', authenticateApiKey(db), async (req, res) => {
    try {
      const { userId } = req.query;
      
      // Verify the requesting user has permission to view these keys
      if (!req.apiKeyUser.isDefault && req.apiKeyUser.id !== userId) {
        return res.status(403).json({ error: "You don't have permission to view these API keys" });
      }
      
      // Get all API keys for the user
      const apiKeys = db.prepare(`
        SELECT 
          id,
          user_id,
          name,
          created_at,
          last_used_at,
          expires_at
        FROM api_keys 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `).all(userId);
      
      // Don't return the actual API key values for security
      return res.status(200).json({ 
        keys: apiKeys.map(key => ({
          ...key,
          api_key: undefined, // Don't send the actual key
          masked_key: `${key.api_key.substring(0, 8)}...${key.api_key.substring(key.api_key.length - 4)}`
        }))
      });
    } catch (error) {
      console.error('Error retrieving API keys:', error);
      return res.status(500).json({ error: 'Failed to retrieve API keys' });
    }
  });
  
  /**
   * @route POST /api/keys
   * @desc Create a new API key
   * @access Private (requires API key)
   */
  router.post('/', authenticateApiKey(db), async (req, res) => {
    try {
      const { userId, name, expiresAt } = req.body;
      
      // Verify the requesting user has permission to create keys
      if (!req.apiKeyUser.isDefault && req.apiKeyUser.id !== userId) {
        return res.status(403).json({ error: "You don't have permission to create API keys for this user" });
      }
      
      // Generate a new API key
      const apiKey = `sk_${crypto.randomBytes(24).toString('hex')}`;
      const now = new Date().toISOString();
      
      // Insert the new API key
      const result = db.prepare(`
        INSERT INTO api_keys (
          user_id,
          api_key,
          name,
          created_at,
          expires_at
        ) VALUES (?, ?, ?, ?, ?)
      `).run(
        userId,
        apiKey,
        name || 'API Key',
        now,
        expiresAt || null
      );
      
      // Return the new API key (only time we return the full key)
      return res.status(201).json({
        id: result.lastInsertRowid,
        user_id: userId,
        api_key: apiKey,
        name: name || 'API Key',
        created_at: now,
        expires_at: expiresAt || null
      });
    } catch (error) {
      console.error('Error creating API key:', error);
      return res.status(500).json({ error: 'Failed to create API key' });
    }
  });
  
  /**
   * @route DELETE /api/keys/:id
   * @desc Delete an API key
   * @access Private (requires API key)
   */
  router.delete('/:id', authenticateApiKey(db), async (req, res) => {
    try {
      const keyId = req.params.id;
      
      // Get the API key to check ownership
      const apiKey = db.prepare(`
        SELECT * FROM api_keys WHERE id = ?
      `).get(keyId);
      
      if (!apiKey) {
        return res.status(404).json({ error: "API key not found" });
      }
      
      // Verify the requesting user has permission to delete this key
      if (!req.apiKeyUser.isDefault && req.apiKeyUser.id !== apiKey.user_id) {
        return res.status(403).json({ error: "You don't have permission to delete this API key" });
      }
      
      // Delete the API key
      db.prepare(`
        DELETE FROM api_keys WHERE id = ?
      `).run(keyId);
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting API key:', error);
      return res.status(500).json({ error: 'Failed to delete API key' });
    }
  });
  
  /**
   * @route POST /api/keys/verify
   * @desc Verify an API key
   * @access Public
   */
  router.post('/verify', async (req, res) => {
    try {
      const { apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ error: "API key is required" });
      }
      
      // Check if it's the default API key from environment variables
      const defaultApiKey = process.env.DEFAULT_API_KEY;
      if (apiKey === defaultApiKey) {
        return res.status(200).json({
          valid: true,
          user: {
            id: 'system',
            name: 'System'
          }
        });
      }
      
      // Look up API key in database
      const apiKeyRecord = db.prepare(`
        SELECT * FROM api_keys WHERE api_key = ?
      `).get(apiKey);
      
      if (!apiKeyRecord) {
        return res.status(200).json({ valid: false });
      }
      
      // Check if API key is expired
      if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
        return res.status(200).json({ valid: false, expired: true });
      }
      
      // Update last used timestamp
      db.prepare(`
        UPDATE api_keys
        SET last_used_at = ?
        WHERE api_key = ?
      `).run(new Date().toISOString(), apiKey);
      
      return res.status(200).json({
        valid: true,
        user: {
          id: apiKeyRecord.user_id,
          name: apiKeyRecord.name || 'API User'
        }
      });
    } catch (error) {
      console.error('Error verifying API key:', error);
      return res.status(500).json({ error: 'Failed to verify API key' });
    }
  });
  
  return router;
};
