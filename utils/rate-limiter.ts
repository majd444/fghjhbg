/**
 * A simple in-memory rate limiter implementation
 * 
 * In a production environment, you would use Redis or a similar distributed cache
 * to share rate limiting state across multiple instances of your application.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipLimits: Map<string, RateLimitRecord> = new Map();
const MAX_REQUESTS_PER_WINDOW = 60;
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute

/**
 * Simple rate limiter that tracks requests by IP address
 * 
 * @param ip The IP address to rate limit
 * @returns Object containing whether the request is allowed and rate limit information
 */
export function rateLimit(ip: string) {
  const now = Date.now();
  const record = ipLimits.get(ip) || { count: 0, resetAt: now + WINDOW_SIZE_MS };
  
  // Reset counter if window has expired
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_SIZE_MS;
  }
  
  // Increment counter
  record.count += 1;
  ipLimits.set(ip, record);
  
  // Check if rate limit exceeded
  const isAllowed = record.count <= MAX_REQUESTS_PER_WINDOW;
  const remainingRequests = Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count);
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
  
  return {
    isAllowed,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining: remainingRequests,
    resetIn: resetInSeconds
  };
}

/**
 * Cleanup old rate limit records to prevent memory leaks
 * This should be called periodically, e.g., by a cron job
 */
export function cleanupRateLimiter() {
  const now = Date.now();
  
  for (const [ip, record] of ipLimits.entries()) {
    if (now > record.resetAt + (WINDOW_SIZE_MS * 2)) {
      ipLimits.delete(ip);
    }
  }
}

// Set up automatic cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimiter, 60 * 60 * 1000);
}
