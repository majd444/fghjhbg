/**
 * API Tracking Routes
 * 
 * These routes handle tracking events from the embedded chatbot
 * for analytics and billing purposes.
 */
const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

module.exports = (db) => {
  /**
   * @route POST /api/track
   * @desc Track chatbot events
   * @access Private (requires API key)
   */
  router.post('/', authenticateApiKey, async (req, res) => {
    try {
      const { event, data } = req.body;
      
      if (!event || !data || !data.agentId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Extract data
      const {
        agentId,
        userId,
        visitorId,
        url,
        referrer,
        timestamp = new Date().toISOString(),
        ...otherData
      } = data;
      
      // Insert event into database
      const stmt = db.prepare(`
        INSERT INTO events (
          event_type,
          agent_id,
          user_id,
          visitor_id,
          url,
          referrer,
          timestamp,
          data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        event,
        agentId,
        userId,
        visitorId || userId,
        url || null,
        referrer || null,
        timestamp,
        JSON.stringify(otherData)
      );
      
      // If this is a message event, update API usage
      if (event === 'message_sent' && otherData.count) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Check if we have a record for today
        const usageRecord = db.prepare(`
          SELECT * FROM api_usage 
          WHERE user_id = ? 
          AND agent_id = ? 
          AND date = ?
        `).get(userId, agentId, today);
        
        if (usageRecord) {
          // Update existing record
          db.prepare(`
            UPDATE api_usage
            SET request_count = request_count + 1
            WHERE user_id = ?
            AND agent_id = ?
            AND date = ?
          `).run(userId, agentId, today);
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
            '/api/embed/chat/enhanced',
            today,
            1,
            0 // We'll update tokens separately when we get that data
          );
        }
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking event:', error);
      return res.status(500).json({ error: 'Failed to track event' });
    }
  });
  
  /**
   * @route GET /api/track/events
   * @desc Get tracked events for a user
   * @access Private (requires API key)
   */
  router.get('/events', authenticateApiKey, async (req, res) => {
    try {
      const { userId, agentId, eventType, startDate, endDate, limit = 100 } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      // Build query
      let query = `SELECT * FROM events WHERE user_id = ?`;
      const params = [userId];
      
      if (agentId) {
        query += ` AND agent_id = ?`;
        params.push(agentId);
      }
      
      if (eventType) {
        query += ` AND event_type = ?`;
        params.push(eventType);
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
      
      const events = db.prepare(query).all(...params);
      
      // Parse JSON data field
      const formattedEvents = events.map(event => ({
        ...event,
        data: JSON.parse(event.data || '{}')
      }));
      
      return res.status(200).json({ events: formattedEvents });
    } catch (error) {
      console.error('Error retrieving events:', error);
      return res.status(500).json({ error: 'Failed to retrieve events' });
    }
  });
  
  /**
   * @route GET /api/track/usage/summary
   * @desc Get API usage summary for a user
   * @access Private (requires API key)
   */
  router.get('/usage/summary', authenticateApiKey, async (req, res) => {
    try {
      const { userId, startDate, endDate } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      // Build query
      let query = `
        SELECT 
          agent_id,
          plugin_id,
          SUM(request_count) as total_requests,
          SUM(tokens_used) as total_tokens
        FROM api_usage 
        WHERE user_id = ?
      `;
      const params = [userId];
      
      if (startDate) {
        query += ` AND date >= ?`;
        params.push(startDate);
      }
      
      if (endDate) {
        query += ` AND date <= ?`;
        params.push(endDate);
      }
      
      query += ` GROUP BY agent_id, plugin_id`;
      
      const usage = db.prepare(query).all(...params);
      
      return res.status(200).json({ usage });
    } catch (error) {
      console.error('Error retrieving usage summary:', error);
      return res.status(500).json({ error: 'Failed to retrieve usage summary' });
    }
  });
  
  return router;
};
