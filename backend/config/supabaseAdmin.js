const { createClient } = require("@supabase/supabase-js");
const ws = require("ws");
require("dotenv").config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.warn(
    "[supabaseAdmin] ⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Admin features will run in fallback mode."
  );
}

// Fallback proxy to prevent runtime crashes if credentials are missing
const dummyFallbackClient = new Proxy({}, {
  get(target, prop) {
    if (prop === 'from') {
      return (table) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error(`Supabase Admin credentials not configured`) }),
        update: () => Promise.resolve({ data: null, error: new Error(`Supabase Admin credentials not configured`) }),
        delete: () => Promise.resolve({ data: null, error: new Error(`Supabase Admin credentials not configured`) }),
      });
    }
    return () => Promise.resolve({ data: null, error: new Error(`Supabase Admin credentials not configured`) });
  }
});

const supabaseAdmin = (url && serviceKey)
  ? createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: {
        transport: ws,
      },
    })
  : dummyFallbackClient;

module.exports = supabaseAdmin;
