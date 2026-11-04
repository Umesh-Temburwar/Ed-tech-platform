import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition-colors duration-150 ${className}`}
      {...props}
    />
  );
}
