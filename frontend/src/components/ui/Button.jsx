import { motion } from "framer-motion";
import React from "react";

const Button = React.memo(function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30",
    secondary: "bg-white/[0.04] border border-white/[0.08] text-white",
    ghost: "bg-transparent border border-white/[0.06] text-white hover:bg-white/[0.04]",
    danger: "bg-red-500/10 border border-red-500/30 text-red-400"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-xl font-semibold transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
});

export default Button;
