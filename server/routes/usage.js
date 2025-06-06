/**
 * API Usage Routes
 * 
 * These routes handle API usage tracking for billing purposes.
 */
const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

module.exports = (db) => {
  /**
   * @route POST /api/usage/track
   * @desc Track API usage for billing
   * @access Private (requires API key)
   */
  router.post('/track', authenticateApiKey(db), async (req, res) => {
    try {
      const { userId, agentId, pluginId, endpoint, tokens } = req.body;
      
      if (!userId || !agentId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we have a record for today
      const usageRecord = db.prepare(`
        SELECT * FROM api_usage 
        WHERE user_id = ? 
        AND agent_id = ? 
        AND plugin_id = ?
        AND endpoint = ?
        AND date = ?
      `).get(userId, agentId, pluginId || 'default', endpoint || 'default', today);
      
      if (usageRecord) {
        // Update existing record
        db.prepare(`
          UPDATE api_usage
          SET request_count = request_count + 1,
              tokens_used = tokens_used + ?
          WHERE user_id = ?
          AND agent_id = ?
          AND plugin_id = ?
          AND endpoint = ?
          AND date = ?
        `).run(
          tokens || 0,
          userId,
          agentId,
          pluginId || 'default',
          endpoint || 'default',
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
          pluginId || 'default',
          endpoint || 'default',
          today,
          1,
          tokens || 0
        );
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking API usage:', error);
      return res.status(500).json({ error: 'Failed to track API usage' });
    }
  });
  
  /**
   * @route GET /api/usage
   * @desc Get API usage for a user
   * @access Private (requires API key)
   */
  router.get('/', authenticateApiKey(db), async (req, res) => {
    try {
      const { userId, startDate, endDate, agentId, pluginId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      // Build query
      let query = `SELECT * FROM api_usage WHERE user_id = ?`;
      const params = [userId];
      
      if (agentId) {
        query += ` AND agent_id = ?`;
        params.push(agentId);
      }
      
      if (pluginId) {
        query += ` AND plugin_id = ?`;
        params.push(pluginId);
      }
      
      if (startDate) {
        query += ` AND date >= ?`;
        params.push(startDate);
      }
      
      if (endDate) {
        query += ` AND date <= ?`;
        params.push(endDate);
      }
      
      query += ` ORDER BY date DESC`;
      
      const usage = db.prepare(query).all(...params);
      
      return res.status(200).json({ usage });
    } catch (error) {
      console.error('Error retrieving API usage:', error);
      return res.status(500).json({ error: 'Failed to retrieve API usage' });
    }
  });
  
  /**
   * @route GET /api/usage/billing
   * @desc Get API usage summary for billing
   * @access Private (requires API key)
   */
  router.get('/billing', authenticateApiKey(db), async (req, res) => {
    try {
      const { userId, month, year } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      // Get the billing period
      const currentDate = new Date();
      const billingYear = year ? parseInt(year) : currentDate.getFullYear();
      const billingMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
      
      // Format dates for the billing period
      const startDate = `${billingYear}-${billingMonth.toString().padStart(2, '0')}-01`;
      
      // Get the last day of the month
      const lastDay = new Date(billingYear, billingMonth, 0).getDate();
      const endDate = `${billingYear}-${billingMonth.toString().padStart(2, '0')}-${lastDay}`;
      
      // Get usage summary
      const usageSummary = db.prepare(`
        SELECT 
          SUM(request_count) as total_requests,
          SUM(tokens_used) as total_tokens,
          COUNT(DISTINCT agent_id) as agents_used,
          COUNT(DISTINCT date) as active_days
        FROM api_usage 
        WHERE user_id = ?
        AND date >= ?
        AND date <= ?
      `).get(userId, startDate, endDate);
      
      // Get usage breakdown by agent
      const agentBreakdown = db.prepare(`
        SELECT 
          agent_id,
          SUM(request_count) as requests,
          SUM(tokens_used) as tokens
        FROM api_usage 
        WHERE user_id = ?
        AND date >= ?
        AND date <= ?
        GROUP BY agent_id
        ORDER BY tokens DESC
      `).all(userId, startDate, endDate);
      
      // Get usage breakdown by plugin
      const pluginBreakdown = db.prepare(`
        SELECT 
          plugin_id,
          SUM(request_count) as requests,
          SUM(tokens_used) as tokens
        FROM api_usage 
        WHERE user_id = ?
        AND date >= ?
        AND date <= ?
        GROUP BY plugin_id
        ORDER BY tokens DESC
      `).all(userId, startDate, endDate);
      
      // Get daily usage
      const dailyUsage = db.prepare(`
        SELECT 
          date,
          SUM(request_count) as requests,
          SUM(tokens_used) as tokens
        FROM api_usage 
        WHERE user_id = ?
        AND date >= ?
        AND date <= ?
        GROUP BY date
        ORDER BY date
      `).all(userId, startDate, endDate);
      
      return res.status(200).json({
        billing_period: {
          start_date: startDate,
          end_date: endDate
        },
        summary: usageSummary,
        agent_breakdown: agentBreakdown,
        plugin_breakdown: pluginBreakdown,
        daily_usage: dailyUsage
      });
    } catch (error) {
      console.error('Error retrieving billing data:', error);
      return res.status(500).json({ error: 'Failed to retrieve billing data' });
    }
  });
  
  return router;
};
