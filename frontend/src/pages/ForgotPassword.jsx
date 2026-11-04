/**
 * ForgotPassword — /forgot-password
 *
 * Sends a real Supabase password recovery email.
 * Supabase emails the user a link → clicking it opens /update-password
 * where they set their new password via supabase.auth.updateUser().
 *
 * No fake OTP — uses production Supabase resetPasswordForEmail().
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaKey,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaFolder,
  FaShieldAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { sendPasswordRecoveryEmail } from "../services/operations/authAPI";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

// ── Component ─────────────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    const ok = await dispatch(sendPasswordRecoveryEmail(email));
    if (ok) setSent(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-canvas px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Enter email ──────────────────────────────── */}
              {!sent && (
                <motion.div key="form" {...fadeUp} className="space-y-6">
                  {/* Icon */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-surface-2 text-accent rounded-xl flex items-center justify-center mx-auto mb-4 border border-border">
                      <FaKey className="text-lg" />
                    </div>
                    <h1 className="text-2xl font-semibold text-text tracking-tight">
                      Reset Password
                    </h1>
                    <p className="mt-1 text-muted text-sm leading-relaxed">
                      Enter your email address and we'll send a secure password reset link.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          placeholder="name@example.com"
                          className="input-field pl-8"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !isValidEmail(email)}
                      className="w-full btn-primary py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <FaPaperPlane className="text-xs" />
                        </>
                      )}
                    </button>
                  </form>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-muted hover:text-text font-medium text-xs transition-colors"
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Back to sign in</span>
                  </Link>
                </motion.div>
              )}

              {/* ── STEP 2: Email sent success ───────────────────────── */}
              {sent && (
                <motion.div key="sent" {...fadeUp} className="text-center space-y-5">
                  <div className="w-14 h-14 bg-success/10 border border-success/30 rounded-full flex items-center justify-center mx-auto">
                    <FaCheckCircle className="text-success text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-text mb-1">Check Your Email</h2>
                    <p className="text-muted text-xs leading-relaxed">
                      We've dispatched a recovery link to{" "}
                      <span className="text-text font-semibold">{email}</span>.
                      Click the link to create your new password.
                    </p>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-2 border border-border">
                      <FaClock className="text-muted text-xs mt-0.5" />
                      <p className="text-xs text-muted">
                        Link expires in <span className="text-text font-medium">1 hour</span>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-2 border border-border">
                      <FaFolder className="text-muted text-xs mt-0.5" />
                      <p className="text-xs text-muted">
                        Check spam or junk folder if not visible in primary inbox.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setSent(false)}
                      className="w-full btn-secondary py-2 rounded-lg font-medium text-xs"
                    >
                      Use a different email
                    </button>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 text-muted hover:text-text font-medium text-xs transition-colors py-1"
                    >
                      <FaArrowLeft className="text-xs" />
                      <span>Back to sign in</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-muted text-[11px] mt-4 flex items-center justify-center gap-1.5">
          <FaShieldAlt className="text-muted text-xs" />
          <span>Secured with Supabase Authentication</span>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;