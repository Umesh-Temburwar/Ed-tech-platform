import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { sendPasswordRecoveryEmail } from "../../services/operations/authAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const validateEmail = (value) => {
    return String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const ok = await dispatch(sendPasswordRecoveryEmail(email));
    if (ok) setSent(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-xl border border-border shadow-sm">
        {!sent ? (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-cyan-500/10 text-[#00B4D8] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,180,216,0.1)]">
                <i className="fas fa-key text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Reset Password
              </h1>
              <p className="mt-2 text-slate-400 text-sm font-medium leading-relaxed">
                Supabase will email you a secure link. Open it, then choose a new
                password on the next screen.
              </p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="name@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send reset link{" "}
                    <i className="fas fa-paper-plane text-sm group-hover:-translate-y-0.5 transition-transform"></i>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-cyan-500/10 text-[#00B4D8] rounded-full flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(0,180,216,0.15)] border border-cyan-500/20">
              <i className="fas fa-envelope text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Check your email
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              If an account exists for{" "}
              <span className="text-white font-bold">{email}</span>, Supabase sent
              a reset link to that address.
            </p>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center btn-primary py-4 text-lg font-bold gap-2"
            >
              Back to Login
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-[#00B4D8] font-bold text-sm transition-all group"
          >
            <i className="fas fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>{" "}
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
