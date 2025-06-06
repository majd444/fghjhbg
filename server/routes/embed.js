/**
 * Embedded Chat Routes
 * 
 * These routes handle interactions with embedded chatbots on websites.
 */
const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

module.exports = (db) => {
  /**
   * @route POST /api/embed/chat
   * @desc Process a chat message from an embedded chatbot
   * @access Private (requires API key)
   */
  router.post('/chat', authenticateApiKey(db), async (req, res) => {
    try {
      const { agentId, userId, visitorId, message, response, tokens } = req.body;
      
      if (!agentId || !userId || !message || !response) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Log the interaction in the plugin_interactions table
      const now = new Date().toISOString();
      
      db.prepare(`
        INSERT INTO plugin_interactions (
          agent_id,
          user_id,
          visitor_id,
          plugin_id,
          message,
          response,
          tokens,
          timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        agentId,
        userId,
        visitorId || userId,
        'html-css-enhanced',
        message,
        response,
        tokens || 0,
        now
      );
      
      // Update API usage if tokens are provided
      if (tokens) {
        // Get today's date in YYYY-MM-DD format
        const today = now.split('T')[0];
        
        // Check if we have a record for today
        const usageRecord = db.prepare(`
          SELECT * FROM api_usage 
          WHERE user_id = ? 
          AND agent_id = ? 
          AND plugin_id = ?
          AND date = ?
        `).get(userId, agentId, 'html-css-enhanced', today);
        
        if (usageRecord) {
          // Update existing record
          db.prepare(`
            UPDATE api_usage
            SET request_count = request_count + 1,
                tokens_used = tokens_used + ?
            WHERE user_id = ?
            AND agent_id = ?
            AND plugin_id = ?
            AND date = ?
          `).run(
            tokens,
            userId,
            agentId,
            'html-css-enhanced',
            today
          );
        } else {
          // Insert new record
          db.prepare(`
            INSERT INTO api_usage (
              user_id,
              agent_id,
              plugin_id,
              endpoint,
              date,
              request_count,
              tokens_used
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            userId,
            agentId,
            'html-css-enhanced',
            '/api/embed/chat',
            today,
            1,
            tokens
          );
        }
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error logging plugin interaction:', error);
      return res.status(500).json({ error: 'Failed to log interaction' });
    }
  });
  
  /**
   * @route GET /api/embed/interactions
   * @desc Get chat interactions for a specific agent or user
   * @access Private (requires API key)
   */
  router.get('/interactions', authenticateApiKey(db), async (req, res) => {
    try {
      const { userId, agentId, visitorId, startDate, endDate, limit = 100 } = req.query;
      
      if (!userId && !agentId) {
        return res.status(400).json({ error: "Either userId or agentId is required" });
      }
      
      // Build query
      let query = `SELECT * FROM plugin_interactions WHERE 1=1`;
      const params = [];
      
      if (userId) {
        query += ` AND user_id = ?`;
        params.push(userId);
      }
      
      if (agentId) {
        query += ` AND agent_id = ?`;
        params.push(agentId);
      }
      
      if (visitorId) {
        query += ` AND visitor_id = ?`;
        params.push(visitorId);
      }
      
      if (startDate) {
        query += ` AND timestamp >= ?`;
        params.push(startDate);
      }
      
      if (endDate) {
        query += ` AND timestamp <= ?`;
        params.push(endDate);
      }
      
      query += ` ORDER BY timestamp DESC LIMIT ?`;
      params.push(parseInt(limit));
      
      const interactions = db.prepare(query).all(...params);
      
      return res.status(200).json({ interactions });
    } catch (error) {
      console.error('Error retrieving interactions:', error);
      return res.status(500).json({ error: 'Failed to retrieve interactions' });
    }
  });
  
  /**
   * @route GET /api/embed/code
   * @desc Get embed code for a chatbot
   * @access Private (requires API key)
   */
  router.get('/code', authenticateApiKey(db), async (req, res) => {
    try {
      const { agentId, userId, primaryColor, position, title, autoOpen } = req.query;
      
      if (!agentId || !userId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Generate embed code
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      const embedCode = `
<!-- Chatbot Widget -->
<script 
  src="${appUrl}/api/embed/enhanced-chatbot.js" 
  data-agent-id="${agentId}" 
  data-user-id="${userId}"
  ${primaryColor ? `data-primary-color="${primaryColor}"` : ''}
  ${position ? `data-position="${position}"` : ''}
  ${title ? `data-title="${title}"` : ''}
  ${autoOpen ? `data-auto-open="${autoOpen}"` : ''}
></script>
<!-- End Chatbot Widget -->
      `.trim();
      
      return res.status(200).json({ embedCode });
    } catch (error) {
      console.error('Error generating embed code:', error);
      return res.status(500).json({ error: 'Failed to generate embed code' });
    }
  });
  
  return router;
};
