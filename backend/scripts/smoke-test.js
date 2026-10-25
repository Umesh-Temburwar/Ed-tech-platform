/**
 * Backend Smoke Test
 * Tests basic server availability and core endpoints
 */
const http = require('http');

const PORT = process.env.PORT || 4001;
const BASE_URL = `http://localhost:${PORT}`;

async function runSmokeTests() {
  console.log(`[SMOKE-TEST] Starting smoke tests against ${BASE_URL}...`);

  try {
    const res = await fetch(`${BASE_URL}/`);
    const data = await res.json();
    console.log(`[SMOKE-TEST] Root endpoint status: ${res.status}`, data);

    if (data.success) {
      console.log('✅ Server root check passed');
    } else {
      console.warn('⚠️ Server root returned unexpected response:', data);
    }
  } catch (err) {
    console.error('❌ Server root check failed (make sure backend is running):', err.message);
  }
}

if (require.main === module) {
  runSmokeTests();
}

module.exports = { runSmokeTests };
