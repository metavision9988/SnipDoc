class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 10) { // 10 requests per minute by default
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }

  isAllowed(clientId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, []);
    }

    const clientRequests = this.requests.get(clientId);
    
    // Remove old requests outside the window
    const validRequests = clientRequests.filter(timestamp => timestamp > windowStart);
    this.requests.set(clientId, validRequests);

    // Check if client has exceeded the limit
    if (validRequests.length >= this.maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((validRequests[0] + this.windowMs - now) / 1000)
      };
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(clientId, validRequests);

    return {
      allowed: true,
      remaining: this.maxRequests - validRequests.length
    };
  }

  middleware() {
    return (req, res, next) => {
      const clientId = req.ip || req.connection.remoteAddress || 'unknown';
      const result = this.isAllowed(clientId);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Window', Math.floor(this.windowMs / 1000));

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter);
        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`
        });
      }

      res.setHeader('X-RateLimit-Remaining', result.remaining);
      next();
    };
  }

  // Cleanup old entries periodically
  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [clientId, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      
      if (validTimestamps.length === 0) {
        this.requests.delete(clientId);
      } else {
        this.requests.set(clientId, validTimestamps);
      }
    }
  }

  // Start periodic cleanup
  startCleanup(intervalMs = 300000) { // Clean up every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }

  // Stop periodic cleanup
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

module.exports = RateLimiter;