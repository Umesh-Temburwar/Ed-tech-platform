import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RouteTransitionBar
 * Top progress indicator that animates across the viewport during page redirect/navigation
 */
export default function RouteTransitionBar() {
  const location = useLocation();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {animating && (
        <motion.div
          key="transition-bar"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.15, delay: 0.25 },
          }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-accent z-[9999] pointer-events-none shadow-[0_0_8px_var(--accent)]"
        />
      )}
    </AnimatePresence>
  );
}

