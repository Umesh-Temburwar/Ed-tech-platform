/**
 * Signup Page — Role-based registration
 *
 * Step 1: Animated role selection cards (Student / Instructor)
 * Step 2: Registration form + Google/GitHub OAuth
 *
 * Role is saved in:
 *  - formData.role (for email signup → profiles.account_type)
 *  - sessionStorage[OAUTH_ROLE_KEY] (for OAuth redirect → OAuthCallback reads it)
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";
import { setSignupData } from "../slices/authSlice";
import { registerWithSupabase } from "../services/operations/authAPI";
import {
  signInWithOAuth,
  OAUTH_ROLE_KEY,
} from "../services/operations/googleAuthAPI";
import RoleSelector from "../components/auth/RoleSelector";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

function getPasswordStrength(pw) {
  if (!pw) return { label: "", color: "bg-surface-3", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "bg-danger", width: "33%" };
  if (pw.length < 10) return { label: "Medium", color: "bg-warning", width: "66%" };
  return { label: "Strong", color: "bg-success", width: "100%" };
}

// ── Component ─────────────────────────────────────────────────────────────────
const Signup = () => {
  const [step, setStep] = useState(1); // 1 = role, 2 = form
  const [selectedRole, setSelectedRole] = useState(null); // "Student" | "Instructor"
  const [formData, setFormData] = useState(initialForm);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [oauthLoading, setOauthLoading] = useState(null); // "google"|"github"|null

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const isAnyLoading = loading || !!oauthLoading;

  // ── Input handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  // ── Role continue ───────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (!selectedRole) return;
    setStep(2);
  };

  // ── OAuth ───────────────────────────────────────────────────────────────────
  const handleOAuth = async (provider) => {
    if (isAnyLoading) return;
    sessionStorage.setItem(OAUTH_ROLE_KEY, selectedRole);
    setOauthLoading(provider);
    try {
      await signInWithOAuth(provider);
    } finally {
      setOauthLoading(null);
    }
  };

  // ── Form validation ─────────────────────────────────────────────────────────
  const validate = () => {
    const { firstName, lastName, email, contactNumber, password, confirmPassword, agreeTerms } = formData;
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email format";
    if (!contactNumber.trim()) e.contactNumber = "Phone number is required";
    else if (!/^\d+$/.test(contactNumber)) e.contactNumber = "Digits only";
    else if (contactNumber.length < 10) e.contactNumber = "At least 10 digits";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreeTerms) e.agreeTerms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Email signup ────────────────────────────────────────────────────────────
  const handleSignup = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(
      setSignupData({
        ...formData,
        accountType: selectedRole,
      })
    );
    dispatch(registerWithSupabase(navigate));
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-canvas px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg"
      >
        {/* Card */}
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-surface-2">
            <div
              className="h-full bg-hot transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Role Selection ──────────────────────────────── */}
              {step === 1 && (
                <motion.div key="step1" {...fadeUp}>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-2 border border-border text-[11px] font-semibold text-muted mb-3">
                      Step 1 of 2 · Account Type
                    </div>
                    <h1 className="text-2xl font-semibold text-text tracking-tight">
                      Join the Platform
                    </h1>
                    <p className="mt-1 text-muted text-sm">
                      Select your primary role to tailor your workspace
                    </p>
                  </div>

                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelect={setSelectedRole}
                    disabled={false}
                  />

                  <button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                    className="mt-6 w-full btn-primary py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Continue as {selectedRole || "..."}</span>
                    <FaArrowRight className="text-xs" />
                  </button>

                  <p className="mt-5 text-center text-muted text-xs">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              )}

              {/* ── STEP 2: Registration Form ───────────────────────────── */}
              {step === 2 && (
                <motion.div key="step2" {...fadeUp}>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => { setStep(1); setErrors({}); }}
                      className="w-8 h-8 rounded-lg border border-border bg-surface-2 flex items-center justify-center text-muted hover:text-text hover:bg-surface-3 transition-colors"
                      aria-label="Back"
                    >
                      <FaArrowLeft className="text-xs" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-muted">
                          Step 2 of 2
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-text border border-border">
                          {selectedRole}
                        </span>
                      </div>
                      <h1 className="text-lg font-semibold text-text">Create your account</h1>
                    </div>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      type="button"
                      onClick={() => handleOAuth("google")}
                      disabled={isAnyLoading}
                      className="btn-secondary flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      {oauthLoading === "google" ? (
                        <div className="w-4 h-4 border-2 border-border border-t-text rounded-full animate-spin" />
                      ) : (
                        <FaGoogle className="text-danger" />
                      )}
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuth("github")}
                      disabled={isAnyLoading}
                      className="btn-secondary flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      {oauthLoading === "github" ? (
                        <div className="w-4 h-4 border-2 border-border border-t-text rounded-full animate-spin" />
                      ) : (
                        <FaGithub />
                      )}
                      <span>GitHub</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-surface px-3 text-[11px] font-medium text-muted">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text mb-1.5">
                          First Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                            <FaUser />
                          </span>
                          <input
                            type="text"
                            name="firstName"
                            placeholder="Ada"
                            value={formData.firstName}
                            error={errors.firstName}
                            onChange={handleChange}
                            disabled={isAnyLoading}
                            className={`input-field pl-8 ${errors.firstName ? "border-danger focus:border-danger" : ""}`}
                          />
                        </div>
                        {errors.firstName && <p className="mt-1 text-[11px] text-danger">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-text mb-1.5">
                          Last Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                            <FaUser />
                          </span>
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Lovelace"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={isAnyLoading}
                            className={`input-field pl-8 ${errors.lastName ? "border-danger focus:border-danger" : ""}`}
                          />
                        </div>
                        {errors.lastName && <p className="mt-1 text-[11px] text-danger">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Email */}
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
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isAnyLoading}
                          className={`input-field pl-8 ${errors.email ? "border-danger focus:border-danger" : ""}`}
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-[11px] text-danger">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-text mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                          <FaPhone />
                        </span>
                        <input
                          type="tel"
                          name="contactNumber"
                          placeholder="10-digit phone number"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          disabled={isAnyLoading}
                          maxLength={15}
                          inputMode="numeric"
                          className={`input-field pl-8 ${errors.contactNumber ? "border-danger focus:border-danger" : ""}`}
                        />
                      </div>
                      {errors.contactNumber && <p className="mt-1 text-[11px] text-danger">{errors.contactNumber}</p>}
                    </div>

                    {/* Password row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                            <FaLock />
                          </span>
                          <input
                            type={showPw ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isAnyLoading}
                            placeholder="••••••••"
                            className={`input-field pl-8 pr-8 ${errors.password ? "border-danger focus:border-danger" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                          >
                            {showPw ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-1.5">
                            <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: strength.width }}
                                className={`h-full ${strength.color} transition-all`}
                              />
                            </div>
                            <p className="text-[10px] mt-0.5 font-medium text-muted">
                              Strength: {strength.label}
                            </p>
                          </div>
                        )}
                        {errors.password && <p className="mt-1 text-[11px] text-danger">{errors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-text mb-1.5">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                            <FaCheckCircle />
                          </span>
                          <input
                            type={showCPw ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isAnyLoading}
                            placeholder="••••••••"
                            className={`input-field pl-8 pr-8 ${errors.confirmPassword ? "border-danger focus:border-danger" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCPw(!showCPw)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                          >
                            {showCPw ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-[11px] text-danger">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-0.5 rounded border-border accent-hot cursor-pointer"
                      />
                      <label htmlFor="agreeTerms" className="text-xs text-muted cursor-pointer leading-relaxed">
                        I agree to the{" "}
                        <Link to="/legal/terms-of-service" className="text-accent hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/legal/privacy-policy" className="text-accent hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {errors.agreeTerms && (
                      <p className="text-[11px] text-danger">{errors.agreeTerms}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isAnyLoading}
                      className="w-full btn-primary py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create {selectedRole} Account</span>
                          <FaArrowRight className="text-xs" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-5 text-center text-muted text-xs">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
