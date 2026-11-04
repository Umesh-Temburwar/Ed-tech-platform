import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { supabase } from "../config/supabaseClient";
import {
  upsertOAuthProfile,
  getDashboardPath,
  OAUTH_ROLE_KEY,
} from "../services/operations/googleAuthAPI";
import { refreshAuthStateInStore } from "../services/syncSupabaseSession";
import { ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus]    = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, sess) => {
              if (cancelled) return;
              if (event === "SIGNED_IN" && sess) {
                listener.subscription.unsubscribe();
                await finalize(sess);
              } else if (event === "SIGNED_OUT") {
                listener.subscription.unsubscribe();
                throw new Error("OAuth sign-in was cancelled or denied.");
              }
            }
          );
          return;
        }

        await finalize(session);
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(err.message || "Authentication failed. Please try again.");
        toast.error("Sign-in failed. Redirecting…");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      }
    }

    async function finalize(session) {
      if (cancelled) return;
      const accountType = await upsertOAuthProfile(session.user);
      await refreshAuthStateInStore(dispatch);

      setRoleName(accountType);
      setStatus("success");
      toast.success(`Welcome! Signed in as ${accountType}`);

      const intended = sessionStorage.getItem("intended_redirect");
      sessionStorage.removeItem("intended_redirect");
      const dest = intended || getDashboardPath(accountType);
      setTimeout(() => navigate(dest, { replace: true }), 1000);
    }

    handleCallback();
    return () => { cancelled = true; };
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-text px-4">
      <div className="text-center max-w-sm w-full bg-surface border border-border rounded-xl p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent mb-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>

              <h2 className="text-base font-bold text-text mb-1">Authenticating Credentials</h2>
              <p className="text-xs text-muted">Establishing secure Supabase session…</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h2 className="text-base font-bold text-text mb-1">Signed in Successfully</h2>
              {roleName && (
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-muted mb-2">
                  Role: {roleName}
                </span>
              )}
              <p className="text-xs text-muted mt-1">Redirecting to your study console…</p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h2 className="text-base font-bold text-text mb-1">
                Authentication Failed
              </h2>
              <p className="text-danger text-xs mb-3">{errorMsg}</p>
              <p className="text-muted text-[11px]">Returning to login…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OAuthCallback;
