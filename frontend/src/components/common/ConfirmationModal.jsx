import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * Reusable Confirmation Modal
 * Used for confirmations (logout, deletes, resetting progress, etc.)
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  loading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-richblack-800 border border-richblack-700 rounded-2xl p-6 shadow-2xl z-10"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${isDanger ? 'bg-pink-700/20 text-pink-200' : 'bg-yellow-500/20 text-yellow-50'}`}>
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-richblack-5">{title}</h3>
                <p className="text-sm text-richblack-300 mt-1 leading-relaxed">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="text-richblack-400 hover:text-richblack-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-richblack-700 text-richblack-300 hover:bg-richblack-700/50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-md ${
                  isDanger
                    ? 'bg-pink-600 hover:bg-pink-700 disabled:opacity-50'
                    : 'bg-yellow-50 text-richblack-900 font-bold hover:bg-yellow-100 disabled:opacity-50'
                }`}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;