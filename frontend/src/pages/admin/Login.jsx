import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../config/supabaseClient";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Database,
  Shield,
  Terminal,
  ArrowLeft,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadingTexts = [
    "",
    "Authenticating...",
    "Verifying Permissions...",
    "Loading Dashboard..."
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setLoadingStep(1);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setLoadingStep(0);
        setLoading(false);
        setError("Invalid email or password.");
        return;
      }

      setLoadingStep(2);
      await new Promise((r) => setTimeout(r, 400));

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        await supabase.auth.signOut({ scope: "global" });
        setLoadingStep(0);
        setLoading(false);
        setError("Unable to verify admin access. Contact your system administrator.");
        return;
      }

      const role = String(profile.account_type ?? "").toLowerCase();

      if (role !== "admin") {
        await supabase.auth.signOut({ scope: "global" });
        setLoadingStep(0);
        setLoading(false);
        setError("You are not authorized to access the Admin Panel.");
        toast.error("Unauthorized Access");
        return;
      }

      setLoadingStep(3);
      toast.success("Welcome back, Administrator!");
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 400);

    } catch (err) {
      console.error("[AdminLogin] error:", err);
      setError("An unexpected server error occurred.");
      setLoadingStep(0);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-canvas text-text overflow-hidden">
      {/* LEFT PANEL - Administrative Overview */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-surface border-r border-border">
        {/* Logo area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-semibold text-text tracking-tight block">EdTech Administration</span>
            <span className="text-xs text-muted block">System Control Plane</span>
          </div>
        </div>

        {/* Center content */}
        <div className="max-w-md my-auto py-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-2 border border-border text-xs font-medium text-muted mb-6">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>Secure Admin Environment</span>
          </div>
          <h1 className="text-3xl font-semibold text-text tracking-tight leading-tight mb-4">
            Manage your platform with precision.
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Access user management, course catalog approvals, system telemetry, and platform configurations.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-surface-2 border border-border flex items-center gap-3">
              <div className="p-2 rounded-md bg-surface border border-border text-success">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-text">Database & System Health</div>
                <div className="text-[11px] text-muted">All tables and authentication services operational</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-2 border border-border flex items-center gap-3">
              <div className="p-2 rounded-md bg-surface border border-border text-accent">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-text">Role-Based Access Control</div>
                <div className="text-[11px] text-muted">Supabase Row-Level Security enforced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted">
          <span>&copy; {new Date().getFullYear()} EdTech Platform · All rights reserved.</span>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-semibold text-text">Admin Portal</span>
              <span className="text-xs text-muted block">System Control Plane</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-text mb-1">Administrator Sign In</h2>
            <p className="text-muted text-xs">Enter your administrative credentials to continue</p>
          </div>

          {/* Form Card */}
          <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4"
                >
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                    <p className="text-xs text-danger font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-text mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-9"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-medium text-text">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-9 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-hot cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-muted cursor-pointer">
                  Remember session on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingTexts[loadingStep]}</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to platform homepage</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
