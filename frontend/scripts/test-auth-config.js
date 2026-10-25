/**
 * SUPABASE AUTHENTICATION CONFIGURATION TEST
 * Run this in frontend context or paste into browser developer console to diagnose auth issues
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("SUPABASE AUTH CONFIGURATION DIAGNOSTIC");
console.log("═══════════════════════════════════════════════════════════════");

// 1. CHECK ENVIRONMENT VARIABLES
console.log("\n1️⃣ ENVIRONMENT VARIABLES:");
const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("   REACT_APP_SUPABASE_URL:", url ? "✅ SET" : "❌ MISSING");
console.log("   REACT_APP_SUPABASE_ANON_KEY:", key ? "✅ SET" : "❌ MISSING");

if (url) console.log("   URL value:", url);
if (key) console.log("   Key preview:", key.substring(0, 30) + "...");

// 2. CHECK SUPABASE CLIENT
console.log("\n2️⃣ SUPABASE CLIENT:");
try {
  const { supabase } = require("../src/config/supabaseClient");
  console.log("   ✅ Supabase client imported successfully");
  console.log("   Client object:", typeof supabase);
} catch (e) {
  console.error("   ❌ Error importing supabase client:", e.message);
}

// 3. TEST JWT FORMAT
console.log("\n3️⃣ JWT TOKEN FORMAT:");
if (key) {
  const parts = key.split(".");
  console.log("   JWT parts:", parts.length, parts.length === 3 ? "✅ VALID" : "❌ INVALID");
  
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      console.log("   JWT Payload:", payload);
      console.log("   - iss (issuer):", payload.iss);
      console.log("   - role:", payload.role);
      console.log("   - exp (expires):", new Date(payload.exp * 1000).toLocaleString());
    } catch (e) {
      console.error("   ❌ Could not decode JWT:", e.message);
    }
  }
}

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("DIAGNOSTIC SCRIPT READY");
console.log("═══════════════════════════════════════════════════════════════");
