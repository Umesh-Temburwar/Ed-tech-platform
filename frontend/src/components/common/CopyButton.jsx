import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

/**
 * Animated Copy to Clipboard Button
 */
const CopyButton = ({
  text,
  successMessage = "Copied to clipboard!",
  className = "",
  showText = true,
  label = "Copy",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
        copied
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
      } ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <FaCheck className="text-[11px]" /> : <FaCopy className="text-[11px]" />}
      {showText && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
};

export default CopyButton;
