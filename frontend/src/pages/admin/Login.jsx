import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../config/supabaseClient";
import { toast } from "react-hot-toast";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Database, Shield, Terminal, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("umeshtemburwar7709@gmail.com");
  const [password, setPassword] = useState("IIT@123");
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
    if (!email || !/^\\S+@\\S+\\.\\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
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
      
      // Simulate slight delay for UX text transitions
      await new Promise(r => setTimeout(r, 600));

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
      }, 600);

    } catch (err) {
      console.error("[AdminLogin] error:", err);
      setError("An unexpected server error occurred.");
      setLoadingStep(0);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] font-inter overflow-hidden selection:bg-indigo-500/30">
      
      {/* LEFT PANEL - Branding & Graphics (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 border-r border-white/5">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -20, 0], 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0], 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]"
          />
        </div>

        {/* Logo area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CoreDev Academy</span>
        </motion.div>

        {/* Center illustration content */}
        <div className="relative z-10 max-w-lg mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Secure Admin Environment
            </div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-[1.1] mb-6">
              Manage your platform with precision.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Access comprehensive analytics, user management, and platform configurations through our secure administrative portal.
            </p>
          </motion.div>

          {/* Floating cards animation */}
          <div className="mt-16 relative h-48 w-full" style={{ perspective: "1000px" }}>
             <motion.div 
                initial={{ opacity: 0, x: -20, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute left-0 top-0 w-64 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">System Status</div>
                    <div className="font-semibold text-white">All Systems Operational</div>
                  </div>
                </div>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 20, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute right-4 top-20 w-64 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Active Sessions</div>
                    <div className="font-semibold text-white">24 Administrators</div>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 text-sm text-slate-500 flex justify-between items-center"
        >
          <span>&copy; {new Date().getFullYear()} CoreDev Academy. All rights reserved.</span>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* Mobile abstract shapes */}
        <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-900/20 blur-[80px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="w-full max-w-[440px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <span className="text-2xl font-bold text-white tracking-tight">CoreDev Academy</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-slate-400">Sign in to manage CoreDev Academy</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 sm:text-sm"
                    placeholder="admin@coredevacademy.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all disabled:opacity-70 overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={loadingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {loadingTexts[loadingStep]}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <>
                      Sign in to Admin Panel
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Main Site
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx="true">{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
