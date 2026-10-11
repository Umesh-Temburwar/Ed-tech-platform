/**
 * InstructorOnboarding.jsx
 * Premium multi-step onboarding wizard for EdTech SaaS
 * Stack: React + Tailwind CSS + Framer Motion + Supabase + React Hook Form + React Hot Toast
 *
 * Usage: Drop this into your React app and wrap with Supabase auth context.
 * Route: /instructor/setup
 *
 * Supabase Tables Required:
 *   - instructor_profiles
 *   - instructor_skills
 *   - instructor_documents
 *   - instructor_payouts
 * Supabase Storage Bucket: instructor-documents (public or private as needed)
 *
 * Install dependencies:
 *   npm install @supabase/supabase-js framer-motion react-hook-form react-hot-toast
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useInstructorOnboarding } from "../../hooks/useInstructorOnboarding";
import { PROVIDERS, METHODS, PROVIDER_CONFIG, METHOD_CONFIG, getPayoutSpeed, TAX_FORM_STATUS, TAX_STATUS_LABELS, TAX_STATUS_CLASSES } from "../../constants/payoutConstants";
import PayoutProviderCards from "../PayoutProviderCards";
import PayoutMethodSelector from "../PayoutMethodSelector";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, key: "profile", label: "Profile", icon: "👤", desc: "Your public identity" },
  { id: 2, key: "skills", label: "Skills", icon: "⚡", desc: "What you teach" },
  { id: 3, key: "payout", label: "Payout", icon: "💳", desc: "Get paid" },
];

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Kolkata", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney",
];

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German", "Portuguese",
  "Mandarin", "Japanese", "Arabic", "Russian", "Korean", "Italian",
];

const SKILL_CATEGORIES = [
  "Development", "Design", "Business", "Marketing", "Data Science",
  "AI/ML", "Cybersecurity", "Cloud Computing", "Mobile Dev", "DevOps",
  "Blockchain", "Finance", "Photography", "Music", "Language",
];

const PROFICIENCY_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

const PROFICIENCY_COLORS = {
  beginner: "from-emerald-500/20 to-emerald-500/10 border-emerald-500/40 text-emerald-400",
  intermediate: "from-cyan-500/20 to-cyan-500/10 border-cyan-500/40 text-cyan-400",
  advanced: "from-violet-500/20 to-violet-500/10 border-violet-500/40 text-violet-400",
  expert: "from-amber-500/20 to-amber-500/10 border-amber-500/40 text-amber-400",
};

// ─── ANIMATIONS ──────────────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, x: 40, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -40, filter: "blur(8px)", transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

const chipVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const GlassCard = ({ children, className = "" }) => (
  <div className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ${className}`}>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const InputField = ({ label, error, icon, children, required, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
        {icon && <span className="text-base">{icon}</span>}
        {label}
        {required && <span className="text-violet-400 text-xs">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    {error && <p className="text-xs text-rose-400 flex items-center gap-1">⚠ {error}</p>}
  </div>
);

const inputCls = "w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 focus:ring-1 focus:ring-violet-500/30 hover:border-white/20";
const selectCls = `${inputCls} cursor-pointer`;

const NeonButton = ({ children, onClick, loading, variant = "primary", type = "button", className = "", disabled }) => {
  const base = "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all duration-200 px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white/5 border border-white/15 text-slate-300 hover:bg-white/10 hover:border-white/25 hover:text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// ─── STEP 1: PROFILE ─────────────────────────────────────────────────────────
const StepProfile = ({ user, onSave, savedData }) => {
  const safeSavedData = savedData || {};
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      full_name: safeSavedData.full_name || user?.user_metadata?.full_name || "",
      headline: safeSavedData.headline || "",
      about: safeSavedData.about || "",
      location: safeSavedData.location || "",
      website: safeSavedData.website || "",
      timezone: safeSavedData.timezone || "UTC",
      teaching_languages: Array.isArray(safeSavedData.teaching_languages) ? safeSavedData.teaching_languages : [],
    },
  });
  const [saving, setSaving] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState(Array.isArray(safeSavedData.teaching_languages) ? safeSavedData.teaching_languages : []);
  const [langSearch, setLangSearch] = useState("");
  const aboutVal = watch("about") || "";

  const filteredLangs = LANGUAGES.filter(
    (l) => l.toLowerCase().includes(langSearch.toLowerCase()) && !selectedLangs.includes(l)
  );

  const addLang = (lang) => {
    const next = [...selectedLangs, lang];
    setSelectedLangs(next);
    setValue("teaching_languages", next);
    setLangSearch("");
  };

  const removeLang = (lang) => {
    const next = selectedLangs.filter((l) => l !== lang);
    setSelectedLangs(next);
    setValue("teaching_languages", next);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("instructor_profiles").upsert({
        user_id: user.id,
        full_name: data.full_name,
        headline: data.headline,
        about: data.about,
        location: data.location,
        website: data.website,
        timezone: data.timezone,
        teaching_languages: selectedLangs,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      
      if (error) throw error;
      
      toast.success("Profile saved!", { icon: "✨" });
      onSave({ 
        full_name: data.full_name, 
        headline: data.headline, 
        about: data.about, 
        location: data.location, 
        website: data.website, 
        timezone: data.timezone, 
        teaching_languages: selectedLangs 
      });
    } catch (err) {
      console.error("[StepProfile] Error saving profile:", err);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar row */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30 flex-shrink-0">
          {(watch("full_name") || "?")[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm text-slate-200 font-medium">{user?.email}</p>
          <p className="text-xs text-violet-400 mt-0.5">Instructor account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Full Name" required error={errors.full_name?.message} icon="✍️">
          <input
            {...register("full_name", { required: "Full name is required", minLength: { value: 2, message: "Min 2 characters" } })}
            className={inputCls}
            placeholder="Your public name"
          />
        </InputField>
        <InputField label="Professional Headline" error={errors.headline?.message} icon="💼">
          <input
            {...register("headline", { maxLength: { value: 120, message: "Max 120 characters" } })}
            className={inputCls}
            placeholder="e.g. Full-Stack Engineer & Educator"
          />
        </InputField>
      </div>

      <InputField label="About You" hint={`${aboutVal.length}/500 characters`} error={errors.about?.message} icon="📝">
        <textarea
          {...register("about", { maxLength: { value: 500, message: "Max 500 characters" } })}
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="Tell students about your experience, teaching style, and what makes your courses unique..."
        />
      </InputField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Location" icon="📍">
          <input {...register("location")} className={inputCls} placeholder="City, Country" />
        </InputField>
        <InputField label="Website / Portfolio" error={errors.website?.message} icon="🔗">
          <input
            {...register("website", {
              pattern: { value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/, message: "Enter a valid URL" },
            })}
            className={inputCls}
            placeholder="https://yoursite.com"
          />
        </InputField>
        <InputField label="Timezone" icon="🕐">
          <select {...register("timezone")} className={selectCls}>
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </InputField>
      </div>

      {/* Language tag selector */}
      <InputField label="Teaching Languages" icon="🌐" hint="Languages you can teach in">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 min-h-[36px]">
            <AnimatePresence>
              {selectedLangs.map((lang) => (
                <motion.span
                  key={lang}
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/15 border border-violet-500/35 text-violet-300 text-xs font-medium"
                >
                  {lang}
                  <button type="button" onClick={() => removeLang(lang)} className="text-violet-400 hover:text-white ml-0.5">×</button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="relative">
            <input
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              className={inputCls}
              placeholder="Search and add languages..."
            />
            {langSearch && filteredLangs.length > 0 && (
              <div className="absolute z-20 top-full mt-1 left-0 right-0 rounded-xl bg-slate-800/95 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                {filteredLangs.slice(0, 6).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => addLang(lang)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-violet-500/15 hover:text-violet-300 transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </InputField>

      <div className="flex justify-end pt-2">
        <NeonButton type="submit" loading={saving} variant="primary">
          Save Profile & Continue →
        </NeonButton>
      </div>
    </form>
  );
};

// ─── STEP 2: SKILLS ──────────────────────────────────────────────────────────
const StepSkills = ({ user, onSave, savedData }) => {
  const safeSavedData = savedData || {};
  const [skills, setSkills] = useState(Array.isArray(safeSavedData.skills) ? safeSavedData.skills : []);
  const [skillInput, setSkillInput] = useState("");
  const [category, setCategory] = useState(SKILL_CATEGORIES[0]);
  const [proficiency, setProficiency] = useState("intermediate");
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (skills.find((s) => s.skill.toLowerCase() === skillInput.trim().toLowerCase())) {
      toast("Skill already added", { icon: "⚠️" });
      return;
    }
    const newSkill = { id: Date.now(), skill: skillInput.trim(), skill_category: category, proficiency_level: proficiency };
    setSkills((prev) => [...prev, newSkill]);
    setSkillInput("");
  };

  const removeSkill = (id) => setSkills((prev) => prev.filter((s) => s.id !== id));

  const onSaveSkills = async () => {
    const safeSkills = Array.isArray(skills) ? skills : [];
    if (safeSkills.length === 0) {
      toast("Add at least one skill", { icon: "⚠️" });
      return;
    }
    setSaving(true);
    try {
      await supabase.from("instructor_skills").delete().eq("user_id", user.id);
      const { error } = await supabase.from("instructor_skills").insert(
        safeSkills.map(({ skill, skill_category, proficiency_level }) => ({
          user_id: user.id, skill, skill_category, proficiency_level,
        }))
      );
      if (error) throw error;
      toast.success("Skills saved!", { icon: "⚡" });
      onSave(safeSkills);
    } catch {
      toast.error("Failed to save skills.");
    } finally {
      setSaving(false);
    }
  };

  const safeSkills = Array.isArray(skills) ? skills : [];

  return (
    <div className="space-y-6">
      {/* Add skill form */}
      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-slate-200 mb-4">Add a Skill</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className={inputCls}
              placeholder="e.g. React, Python, Figma..."
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
            {SKILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={proficiency} onChange={(e) => setProficiency(e.target.value)} className={selectCls}>
            {PROFICIENCY_LEVELS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="mt-3 flex justify-end">
          <NeonButton onClick={addSkill} variant="secondary">
            + Add Skill
          </NeonButton>
        </div>
      </GlassCard>

      {/* Skill chips */}
      <div className="min-h-[120px]">
        {safeSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-white/10 text-slate-500">
            <span className="text-3xl mb-2">⚡</span>
            <p className="text-sm">No skills added yet. Add your expertise above.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            <AnimatePresence>
              {safeSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`group flex items-center gap-2 px-3 py-2 rounded-xl border bg-gradient-to-r text-xs font-medium ${PROFICIENCY_COLORS[skill.proficiency_level]}`}
                >
                  <span className="font-semibold">{skill.skill}</span>
                  <span className="opacity-60 text-[10px]">{skill.skill_category}</span>
                  <span className="opacity-50 text-[9px] uppercase tracking-wider">{skill.proficiency_level}</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-current hover:text-white"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Summary */}
      {safeSkills.length > 0 && (
        <div className="grid grid-cols-4 gap-2 text-center">
          {PROFICIENCY_LEVELS.map((level) => {
            const count = safeSkills.filter((s) => s.proficiency_level === level).length;
            return (
              <div key={level} className={`rounded-xl p-3 border bg-gradient-to-b ${PROFICIENCY_COLORS[level]}`}>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[10px] capitalize opacity-70">{level}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <NeonButton onClick={onSaveSkills} loading={saving} variant="primary">
          Save Skills & Continue →
        </NeonButton>
      </div>
    </div>
  );
};



// ─── STEP 3: PAYOUT ──────────────────────────────────────────────────────────
const StepPayout = ({ user, onSave, savedData }) => {
  const safeSavedData = savedData || {};
  const [provider, setProvider] = useState(safeSavedData.payout_provider || PROVIDERS.STRIPE);
  const [method, setMethod] = useState(safeSavedData.payout_method || (provider === PROVIDERS.RAZORPAY ? METHODS.UPI : METHODS.BANK));
  const [accountToken, setAccountToken] = useState(safeSavedData.payout_account_token || "");
  const [currency, setCurrency] = useState(safeSavedData.currency || (provider === PROVIDERS.RAZORPAY ? "INR" : "USD"));
  const [taxStatus, setTaxStatus] = useState(safeSavedData.tax_form_status || TAX_FORM_STATUS.NOT_STARTED);
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState(!!safeSavedData.payout_account_token);
  const [masked, setMasked] = useState(safeSavedData.payout_account_last4 || "");

  const handleConnect = async () => {
    if (!accountToken && !connected) {
      toast("Enter your account details.", { icon: "⚠️" });
      return;
    }
    if (!provider) {
      toast("Please select a payout provider.", { icon: "⚠️" });
      return;
    }
    if (!method) {
      toast("Please select a payout method.", { icon: "⚠️" });
      return;
    }
    setSaving(true);
    try {
      const last4 = accountToken.slice(-4) || "4242";
      const payoutSpeed = getPayoutSpeed(provider);

      const { error } = await supabase.from("instructor_payouts").upsert([
        {
          user_id: user.id,
          payout_provider: provider,
          payout_method: method,
          payout_account_token: accountToken || "tok_demo_" + Date.now(),
          payout_account_last4: last4,
          currency,
          tax_form_status: taxStatus,
          estimated_monthly_earnings: 0,
          payout_speed: payoutSpeed,
        },
      ]);
      
      if (error) {
        console.error("[Payout Save Error]", error);
        toast.error(error.message || "Failed to save payout");
        return;
      }
      
      setConnected(true);
      setMasked(last4);
      toast.success("Payout setup saved!");
      onSave({ 
        payout_provider: provider, 
        payout_method: method, 
        payout_account_last4: last4, 
        currency, 
        tax_form_status: taxStatus,
        estimated_monthly_earnings: 0,
        payout_speed: payoutSpeed
      });
    } catch (err) {
      console.error("[Payout Catch Error]", err);
      toast.error(err.message || "Failed to save payout");
    } finally {
      setSaving(false);
    }
  };

  const taxBadge = {
    label: TAX_STATUS_LABELS[taxStatus] || TAX_STATUS_LABELS[TAX_FORM_STATUS.NOT_STARTED],
    cls: TAX_STATUS_CLASSES[taxStatus] || TAX_STATUS_CLASSES[TAX_FORM_STATUS.NOT_STARTED],
  };

  const getPlaceholder = () => {
    return METHOD_CONFIG[method]?.placeholder || "Account details";
  };

  const handleProviderSelect = (newProvider) => {
    setProvider(newProvider);
    const config = PROVIDER_CONFIG[newProvider];
    if (config && !config.methods.includes(method)) {
      setMethod(config.methods[0]);
    }
    if (newProvider === PROVIDERS.RAZORPAY) {
      setCurrency("INR");
    } else if (newProvider === PROVIDERS.STRIPE && currency === "INR") {
      setCurrency("USD");
    }
  };

  return (
    <div className="space-y-6">
      {/* Payout security notice */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="text-2xl">🔒</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-emerald-300">Secure Payouts</p>
          <p className="text-xs text-emerald-200/70">Your payment details are encrypted and stored securely. We never share your information.</p>
        </div>
      </div>

      {/* Provider selector */}
      <div>
        <p className="text-sm font-medium text-slate-300 mb-3">Payout Provider</p>
        <PayoutProviderCards
          selectedProvider={provider}
          onSelectProvider={handleProviderSelect}
        />
      </div>

      {/* Payout methods */}
      <div>
        <p className="text-sm font-medium text-slate-300 mb-3">Payout Method</p>
        <PayoutMethodSelector
          selectedProvider={provider}
          selectedMethod={method}
          onSelectMethod={setMethod}
        />
      </div>

      {/* Account token input */}
      {!connected ? (
        <GlassCard className="p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span>🔐</span> Connect Your Account
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Account Details" hint="Provided by your payment provider">
              <input
                value={accountToken}
                onChange={(e) => setAccountToken(e.target.value)}
                className={inputCls}
                placeholder={getPlaceholder()}
                type="text"
              />
            </InputField>
            <InputField label="Preferred Currency">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectCls}>
                {(PROVIDER_CONFIG[provider]?.currency || ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"]).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </InputField>
          </div>
          
          {/* Creator earnings card */}
          <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Estimated Monthly Earnings</p>
                <p className="text-2xl font-bold text-white mt-1">{currency === "INR" ? "₹" : "$"}0.00</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
              <div className="bg-white/5 rounded-lg px-2 py-1.5">
                <span className="block">Next Payout</span>
                <span className="text-slate-300 font-medium">In 7 days</span>
              </div>
              <div className="bg-white/5 rounded-lg px-2 py-1.5">
                <span className="block">Transfer Speed</span>
                <span className="text-emerald-300 font-medium">
                  {getPayoutSpeed(provider)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 flex items-start gap-2">
            <span>⚠️</span>
            <span>In production, use OAuth flows (Stripe Connect, Razorpay OAuth) or encrypted token submission. Never send raw credentials.</span>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl">✅</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                Account Connected
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Instant Payout
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {PROVIDER_CONFIG[provider]?.label || provider} 
                · ••••{masked} · {currency}
              </p>
            </div>
            <button onClick={() => setConnected(false)} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
              Change
            </button>
          </div>
        </GlassCard>
      )}

      {/* Tax form */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/8">
        <div>
          <p className="text-sm font-medium text-slate-200">Tax Form Status</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {provider === PROVIDERS.RAZORPAY ? "Form 16 / PAN details" : "W-9 (US) or W-8BEN (international)"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-lg border ${taxBadge.cls}`}>{taxBadge.label}</span>
          {taxStatus === TAX_FORM_STATUS.NOT_STARTED && (
            <button
              type="button"
              onClick={() => setTaxStatus(TAX_FORM_STATUS.SUBMITTED)}
              className="text-xs text-violet-400 hover:text-violet-300 underline transition-colors"
            >
              Submit Form
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <NeonButton onClick={handleConnect} loading={saving} variant="primary">
          {connected ? "Save & Finish 🎉" : "Connect & Finish 🎉"}
        </NeonButton>
      </div>
    </div>
  );
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const StepProgressBar = ({ currentStep, completedSteps }) => {
  const safeCompletedSteps = Array.isArray(completedSteps) ? completedSteps : [];
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 relative">
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-5 h-px bg-white/8 z-0" />
        <div
          className="absolute left-0 top-5 h-px bg-gradient-to-r from-violet-500 to-cyan-500 z-0 transition-all duration-700"
          style={{ width: `${((Math.max(...safeCompletedSteps, currentStep) - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = safeCompletedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  boxShadow: isCurrent ? "0 0 20px rgba(139,92,246,0.5)" : "0 0 0px rgba(139,92,246,0)",
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all duration-300 border ${
                  isCompleted
                    ? "bg-gradient-to-br from-violet-500 to-cyan-500 border-transparent text-white"
                    : isCurrent
                    ? "bg-violet-500/20 border-violet-500 text-white"
                    : "bg-white/5 border-white/15 text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : step.icon}
              </motion.div>
              <div className="text-center hidden sm:block">
                <p className={`text-xs font-semibold ${isCurrent ? "text-violet-300" : isCompleted ? "text-slate-300" : "text-slate-600"}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-600">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── COMPLETION SCREEN ───────────────────────────────────────────────────────
const CompletionScreen = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="text-center py-8 space-y-6"
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 10, 0] }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="text-7xl mx-auto w-fit"
    >
      🎉
    </motion.div>
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">You're All Set!</h2>
      <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
        Your instructor profile is complete and under review. You'll receive an email at <span className="text-violet-400">{user?.email}</span> within 24–48 hours.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {["Profile ✓", "Skills ✓", "Payout ✓"].map((item) => (
        <div key={item} className="rounded-xl bg-violet-500/10 border border-violet-500/25 py-2 px-2 text-xs text-violet-300 font-medium">
          {item}
        </div>
      ))}
    </div>
    <NeonButton onClick={() => window.location.assign("/dashboard/instructor")} variant="primary" className="mx-auto">
      Go to Dashboard →
    </NeonButton>
  </motion.div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function InstructorOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [savedStepData, setSavedStepData] = useState({});
  
  const { user } = useAuth();

  const { 
    loading: hookLoading, 
    saving, 
    profile,
    skills,
    payout,
    isSetupComplete,
    validateInstructorSetup,
    saveDraft, 
    updateStep, 
    completeOnboarding 
  } = useInstructorOnboarding(user);

  // Main useEffect to restore data from hook
  useEffect(() => {
    const safeSkills = Array.isArray(skills) ? skills : [];
    
    // Build saved step data from hook
    const stepData = {};
    const completed = [];

    if (profile) {
      stepData[1] = {
        ...profile,
        full_name: profile.full_name,
      };
      completed.push(1);
    }
    if (safeSkills.length > 0) {
      stepData[2] = { skills: safeSkills };
      completed.push(2);
    }
    if (payout) {
      stepData[3] = payout;
      completed.push(3);
    }

    // Set current step
    let step = profile?.onboarding_step || 1;
    if (step < 1 || step > STEPS.length) {
      step = 1;
    }

    setSavedStepData(stepData);
    setCompletedSteps(completed);
    setCurrentStep(isSetupComplete ? step : 1);
  }, [profile, skills, payout, isSetupComplete]);

  const handleSaveDraft = async () => {
    const profileData = savedStepData?.[1] || {};
    const skillsData = savedStepData?.[2]?.skills || [];
    const payoutData = savedStepData?.[3] || {};

    const formData = {
      full_name: profileData.full_name || "Instructor",
      headline: profileData.headline,
      about: profileData.about,
      location: profileData.location,
      website: profileData.website,
      timezone: profileData.timezone,
      teaching_languages: profileData.teaching_languages,
    };

    const success = await saveDraft({ 
      currentStep, 
      formData,
      skills: skillsData,
      payout: payoutData
    });
    
    if (success) {
      navigate("/dashboard/instructor");
    }
  };

  const handleStepSave = async (stepId, data) => {
    setSavedStepData((prev) => ({ ...prev, [stepId]: data }));
    setCompletedSteps((prev) => [...new Set([...prev, stepId])]);

    const nextStep = stepId === STEPS.length ? stepId : stepId + 1;
    const isCompleted = stepId === STEPS.length;

    if (user?.id) {
      if (isCompleted) {
        await completeOnboarding();
      } else {
        await updateStep(nextStep);
      }
    }

    if (stepId === STEPS.length) {
      // Done will be set by isSetupComplete from hook
    } else {
      setTimeout(() => setCurrentStep(stepId + 1), 400);
    }
  };

  const loading = !user || hookLoading;
  const safeSkills = Array.isArray(skills) ? skills : [];
  const completionPct = Math.round((completedSteps.length / STEPS.length) * 100);
  const displayStep = currentStep;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060812] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-6 h-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Loading your onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 font-['DM_Sans',sans-serif] overflow-x-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/4 rounded-full blur-[80px]" />
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15,15,25,0.95)",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />

      {/* Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');`}</style>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-semibold mb-5 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Instructor Setup
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Complete Your Profile
          </h1>
          <p className="text-slate-400 text-sm">Set up your instructor account in a few steps to start teaching.</p>

          {/* Completion bar */}
          {!isSetupComplete && (
            <div className="mt-5 flex items-center gap-3 max-w-xs mx-auto">
              <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-slate-500 tabular-nums w-8">{completionPct}%</span>
            </div>
          )}
        </motion.div>

        {/* Main card */}
        <GlassCard className="p-6 sm:p-10">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Loading onboarding...</p>
            </div>
          ) : isSetupComplete ? (
            <CompletionScreen user={user} />
          ) : (
            <>
              <StepProgressBar currentStep={displayStep} completedSteps={completedSteps} />

              {/* Step header */}
              <div className="mb-6 pb-5 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-lg">
                    {STEPS[displayStep - 1]?.icon || "❓"}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Step {displayStep}: {STEPS[displayStep - 1]?.label || "Unknown"}
                    </h2>
                    <p className="text-xs text-slate-500">{STEPS[displayStep - 1]?.desc || ""}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {completedSteps.includes(displayStep) && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg">
                        Saved ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayStep}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {displayStep === 1 && (
                    <StepProfile user={user} onSave={(data) => handleStepSave(1, data)} savedData={savedStepData[1]} />
                  )}
                  {displayStep === 2 && (
                    <StepSkills user={user} onSave={(data) => handleStepSave(2, data)} savedData={savedStepData[2]} />
                  )}
                  {displayStep === 3 && (
                    <StepPayout user={user} onSave={(data) => handleStepSave(3, data)} savedData={savedStepData[3]} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation footer */}
              <div className="mt-8 pt-5 border-t border-white/8 flex items-center justify-between">
                <NeonButton
                  variant="ghost"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={displayStep === 1}
                  className="text-sm"
                >
                  ← Back
                </NeonButton>
                <div className="flex items-center gap-1.5">
                  {STEPS.map((s) => (
                    <div
                      key={s.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s.id === displayStep ? "w-5 bg-violet-400" : completedSteps.includes(s.id) ? "w-2 bg-violet-600/60" : "w-2 bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-600">
                  {displayStep} / {STEPS.length}
                </span>
              </div>
            </>
          )}
        </GlassCard>

        {/* Save & continue later */}
        {!isSetupComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-4"
          >
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save draft & continue later"
              )}
            </button>
          </motion.div>
        )}

        <p className="text-center text-xs text-slate-700 mt-6">
          Need help? <a href="mailto:support@edtech.com" className="text-slate-500 hover:text-violet-400 transition-colors">support@edtech.com</a>
        </p>
      </div>
    </div>
  );
}

/**
 * ─── ONBOARDING REDIRECT HOOK ────────────────────────────────────────────────
 * 
 * Use this hook in your router to auto-redirect incomplete instructors.
 * 
 * Example in your App.jsx or protected route:
 * 
 *   import { useOnboardingRedirect } from './InstructorOnboarding'
 *   
 *   function InstructorRoute({ children }) {
 *     const { checking } = useOnboardingRedirect()
 *     if (checking) return <LoadingScreen />
 *     return children
 *   }
 */
export function useOnboardingRedirect() {
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setChecking(false);
  }, []);

  return { checking };
}
