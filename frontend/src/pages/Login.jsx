/**
 * Login Page — Role-based OAuth + Email/Password Authentication
 * Redesigned with clean, crisp, human-crafted design system
 */
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaArrowRight, FaArrowLeft, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaGoogle, FaGithub 
} from "react-icons/fa";
import { login } from "../services/operations/authAPI";
import { OAUTH_ROLE_KEY, signInWithGoogle, signInWithGitHub } from "../services/operations/googleAuthAPI";
import RoleSelector from "../components/auth/RoleSelector";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const Login = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const customRedirect = location.state?.from || null;

  const handleRoleSelect = (role) => setSelectedRole(role);

  const handleContinue = () => {
    if (!selectedRole) return;
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem(OAUTH_ROLE_KEY, selectedRole);
    if (customRedirect) {
      sessionStorage.setItem("intended_redirect", customRedirect);
    }
    dispatch(login(formData.email, formData.password, navigate, selectedRole, customRedirect));
  };

  const handleOAuth = async (provider) => {
    try {
      setOauthLoading(provider);
      sessionStorage.setItem(OAUTH_ROLE_KEY, selectedRole);
      if (customRedirect) {
        sessionStorage.setItem("intended_redirect", customRedirect);
      }
      if (provider === "google") {
        await signInWithGoogle();
      } else if (provider === "github") {
        await signInWithGitHub();
      }
    } catch (err) {
      console.error(`OAuth login failed:`, err);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="h-1 bg-surface-2 border-b border-border">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Role Selection */}
              {step === 1 && (
                <motion.div key="step1" {...fadeUp}>
                  <div className="text-center mb-6">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-2 border border-border text-[11px] font-semibold text-muted mb-3">
                      Step 1 of 2
                    </span>
                    <h1 className="text-2xl font-bold text-text tracking-tight">
                      Sign in to your account
                    </h1>
                    <p className="mt-1 text-muted text-xs">
                      Choose your role to access your dedicated workspace
                    </p>
                  </div>

                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelect={handleRoleSelect}
                    disabled={false}
                  />

                  <button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                    className={`mt-6 w-full py-2.5 px-4 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors ${
                      selectedRole
                        ? "btn-primary w-full"
                        : "bg-surface-2 text-muted cursor-not-allowed border border-border"
                    }`}
                  >
                    Continue as {selectedRole ?? "…"}
                    <FaArrowRight className="text-[10px]" />
                  </button>

                  <p className="mt-5 text-center text-muted text-xs">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-accent font-semibold hover:underline">
                      Sign up
                    </Link>
                  </p>
                </motion.div>
              )}

              {/* STEP 2: Auth Form */}
              {step === 2 && (
                <motion.div key="step2" {...fadeUp}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                    <button
                      onClick={handleBack}
                      className="w-7 h-7 rounded-md border border-border bg-surface-2 flex items-center justify-center text-muted hover:text-text transition-colors"
                      aria-label="Go back"
                    >
                      <FaArrowLeft className="text-xs" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                          Step 2 of 2
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 border border-border text-accent">
                          {selectedRole}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-text mt-0.5">
                        Enter your credentials
                      </h2>
                    </div>
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                          <FaEnvelope className="text-xs" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={loading}
                          placeholder="name@example.com"
                          className="input pl-9"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-text">
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-xs font-medium text-accent hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                          <FaLock className="text-xs" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={loading}
                          placeholder="••••••••"
                          className="input pl-9 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-2.5 mt-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign in as {selectedRole}
                          <FaArrowRight className="text-xs" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 text-[11px] font-medium text-muted bg-surface">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuth("google")}
                      disabled={oauthLoading !== null}
                      className="btn-secondary py-2 px-3 text-xs"
                    >
                      {oauthLoading === "google" ? (
                        <div className="w-3.5 h-3.5 border-2 border-text/30 border-t-text rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaGoogle className="text-xs" />
                          Google
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuth("github")}
                      disabled={oauthLoading !== null}
                      className="btn-secondary py-2 px-3 text-xs"
                    >
                      {oauthLoading === "github" ? (
                        <div className="w-3.5 h-3.5 border-2 border-text/30 border-t-text rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaGithub className="text-xs" />
                          GitHub
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-6 text-center text-muted text-xs">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-accent font-semibold hover:underline">
                      Create account
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
