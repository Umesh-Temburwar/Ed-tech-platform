import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT INITIALIZATION WITH KEY ROTATION HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

// 1. INVALIDATION: Only clear stale sessions when there is a confirmed invalid
//    session error — NOT on every page load. Clearing on every load was the
//    root cause of the "logout on refresh" bug because it wiped the Supabase
//    sb-*-auth-token key before the session could be restored.
function clearInvalidSupabaseSession() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    sessionStorage.clear();
  } catch (err) {
  }
}

// 2. READ ENVIRONMENT VARIABLES
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 3. VALIDATE ENVIRONMENT VARIABLES

if (!supabaseUrl) {
  throw new Error(
    "REACT_APP_SUPABASE_URL is missing. Check frontend/.env and restart dev server."
  );
}

if (supabaseUrl.includes("your-project-id") || supabaseUrl.includes("your-project")) {
  throw new Error(
    "REACT_APP_SUPABASE_URL is still a placeholder. Update frontend/.env with your real URL."
  );
}

if (!supabaseKey) {
  throw new Error(
    "REACT_APP_SUPABASE_ANON_KEY is missing. Check frontend/.env and restart dev server."
  );
}

if (supabaseKey.includes("your-anon") || supabaseKey.includes("your-key")) {
  throw new Error(
    "REACT_APP_SUPABASE_ANON_KEY is still a placeholder. Update frontend/.env with your real key."
  );
}

// 4. VALIDATE KEY FORMAT (should be JWT)
if (!supabaseKey.includes(".")) {
  throw new Error(
    "REACT_APP_SUPABASE_ANON_KEY is not a valid JWT token. Check frontend/.env."
  );
}

// 5. LOG SUCCESSFUL VALIDATION

// Decode JWT to verify it matches the project
try {
  const parts = supabaseKey.split(".");
  if (parts.length === 3) {
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.ref !== "bjfwdidbkbmlhowzuklk") {
    }
  }
} catch (e) {
}

// 6. CREATE SUPABASE CLIENT

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Persist session in localStorage so it survives page refreshes
    persistSession: true,
    // Automatically refresh the JWT before it expires
    autoRefreshToken: true,
    // Read the session from the URL hash after OAuth redirect
    detectSessionInUrl: true,
    // Use implicit flow (compatible with CRA)
    flowType: "implicit",
  },
});

// 7. TEST INITIAL SESSION

supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    // Only clear if the session is explicitly invalid (key rotation, etc.)
    if (error.message && (error.message.includes("invalid") || error.message.includes("expired"))) {
      clearInvalidSupabaseSession();
    }
  } else if (session) {
  } else {
  }
}).catch((err) => {
});
