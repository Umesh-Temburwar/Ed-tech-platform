/**
 * Security Headers Middleware
 * Injects essential defense-in-depth HTTP headers to guard against common web vulnerabilities
 */

function securityHeaders(req, res, next) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Guard against clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Cross-site scripting filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Disable browser caching for sensitive API responses
  if (req.path.startsWith('/api/v1/auth') || req.path.startsWith('/api/v1/payment')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
}

module.exports = securityHeaders;
