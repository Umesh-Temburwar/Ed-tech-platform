/**
 * System Health & Diagnostics Route
 * Provides runtime information, memory consumption, uptime, and database status
 */
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseAdmin');

router.get('/', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatency = 0;

  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('courses').select('id', { count: 'exact', head: true }).limit(1);
    dbLatency = Date.now() - dbStart;
    if (error) {
      dbStatus = 'degraded';
    }
  } catch (err) {
    dbStatus = 'unreachable';
  }

  const memoryUsage = process.memoryUsage();

  return res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      },
    },
    responseTimeMs: Date.now() - startTime,
  });
});

module.exports = router;
