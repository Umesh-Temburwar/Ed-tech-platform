import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaLock, FaLockOpen, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaSyncAlt } from "react-icons/fa";
import { supabase } from "../config/supabaseClient";

function UpdatePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [busy, setBusy] = useState(false);

  const { password, confirmPassword } = formData;

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (!session?.user) {
        toast.error(
          "Open this page from the link in your Supabase password reset email."
        );
      }
      setCheckingSession(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You can sign in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to update password");
    } finally {
      setBusy(false);
    }
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { label: "", color: "bg-surface-3", width: "0%" };
    if (pw.length < 6)
      return { label: "Weak", color: "bg-danger", width: "33%" };
    if (pw.length < 10)
      return { label: "Medium", color: "bg-warning", width: "66%" };
    return { label: "Strong", color: "bg-success", width: "100%" };
  };

  const strength = getPasswordStrength(password);

  if (checkingSession) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-canvas text-muted">
        <div className="w-8 h-8 border-2 border-border border-t-text rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-canvas px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-surface p-6 sm:p-8 rounded-xl shadow-sm border border-border"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-surface-2 text-accent rounded-xl flex items-center justify-center mx-auto mb-4 border border-border">
            <FaLockOpen className="text-lg" />
          </div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">
            Set New Password
          </h1>
          <p className="mt-1 text-muted text-xs font-normal">
            Uses your authenticated Supabase recovery session.
          </p>
        </div>

        <form onSubmit={handleOnSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                <FaLock />
              </span>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="••••••••"
                className="input-field pl-8 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: strength.width }}
                    className={`h-full ${strength.color} transition-all`}
                  />
                </div>
                <p className="text-[10px] mt-0.5 text-muted font-medium">
                  Strength: {strength.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                <FaCheckCircle />
              </span>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="••••••••"
                className="input-field pl-8"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy || !password || password !== confirmPassword}
            className="w-full btn-primary py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {busy ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Save New Password</span>
                <FaSyncAlt className="text-xs" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-muted hover:text-text font-medium text-xs transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default UpdatePassword;
