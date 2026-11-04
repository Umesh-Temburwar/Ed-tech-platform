import React from "react";

const Button = React.memo(function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: "bg-hot text-white hover:bg-[#e5482a] border border-transparent shadow-sm",
    secondary: "bg-surface-2 text-text border border-border hover:bg-surface",
    ghost: "bg-transparent text-text hover:bg-surface-2 border border-transparent",
    danger: "bg-danger text-white hover:bg-[#e03131] border border-transparent",
    accent: "bg-accent text-white hover:opacity-90 border border-transparent",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-5 py-2.5 text-sm"
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
