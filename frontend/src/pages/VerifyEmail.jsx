import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelopeOpenText, FaRedoAlt, FaArrowLeft } from "react-icons/fa";
import { resendSignupConfirmation } from "../services/operations/authAPI";

function VerifyEmail() {
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData?.email) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleResend = () => {
    dispatch(resendSignupConfirmation(signupData?.email));
  };

  const email = signupData?.email ?? "";

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
            <FaEnvelopeOpenText className="text-lg" />
          </div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">
            Confirm your email
          </h1>
          <p className="mt-2 text-muted text-xs leading-relaxed">
            We sent a verification link to{" "}
            <span className="text-text font-semibold">{email}</span>. Please open it
            to activate your account, then proceed to sign in.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleResend}
            className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Resend confirmation email</span>
                <FaRedoAlt className="text-xs" />
              </>
            )}
          </button>

          <Link
            to="/login"
            className="w-full btn-secondary flex items-center justify-center py-2.5 rounded-lg text-sm font-medium"
          >
            Go to Sign In
          </Link>

          <Link
            to="/signup"
            className="flex items-center justify-center gap-1.5 text-muted hover:text-text font-medium text-xs transition-colors pt-2"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Signup</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
