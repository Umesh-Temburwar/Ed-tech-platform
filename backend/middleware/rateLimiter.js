/**
 * In-Memory Sliding Window Rate Limiter Middleware
 * Protects auth and sensitive operations against brute force attacks
 */

/**
 * Creates a rate limiting middleware function
 * @param {Object} options
 * @param {number} [options.windowMs=60000] - Window size in milliseconds
 * @param {number} [options.max=20] - Max requests permitted in the window
 * @param {string} [options.message='Too many requests, please try again later']
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000;
  const max = options.max || 20;
  const message = options.message || 'Too many requests, please try again later';

  const hits = new Map();

  // Periodically purge expired IP records
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(ip);
      }
    }
  }, windowMs);

  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let record = hits.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      hits.set(ip, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}

module.exports = {
  createRateLimiter,
  authRateLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 15, message: 'Too many authentication attempts' }),
  otpRateLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 5, message: 'Too many OTP requests. Please wait 1 minute.' }),
};
