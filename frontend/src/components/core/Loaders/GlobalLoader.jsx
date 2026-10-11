import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Initializing CoreDev Academy...",
  "Loading Courses...",
  "Preparing Dashboard...",
  "Loading Profile...",
  "Connecting Database...",
  "Syncing Progress...",
  "Almost Ready...",
  "Welcome to CoreDev Academy..."
];

const LOADING_TEXT_DURATION = 2200;

const particleVariants = {
  initial: { y: 0, opacity: 0, scale: 0 },
  animate: (i) => ({
    y: -80 - (i * 7) % 40,
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 1, 0.5],
    transition: {
      duration: 2.5 + (i % 5) * 0.4,
      delay: (i * 0.12) % 1.2,
      repeat: Infinity,
      ease: "easeOut"
    }
  }),
  exit: { opacity: 0, scale: 0, y: 20, transition: { duration: 0.3 } }
};

const ringVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 4, repeat: Infinity, ease: "linear" }
  }
};

const ringVariantsReverse = {
  animate: {
    rotate: -360,
    transition: { duration: 5.5, repeat: Infinity, ease: "linear" }
  }
};

const shimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 2, repeat: Infinity, ease: "linear" }
  }
};

const dotVariants = (i) => ({
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 0.9,
      delay: i * 0.15,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});

const progressVariants = {
  initial: { width: "0%" },
  animate: {
    width: "100%",
    transition: { duration: 8, ease: "easeInOut" }
  }
};

export function LogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <filter id="glowMark">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g style={{ transformOrigin: "50% 50%" }} filter="url(#glowMark)">
        <path
          d="M 35 25 L 10 50 L 35 75"
          fill="none"
          stroke="#9333EA"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 60 15 L 40 85"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 65 25 L 90 50 L 65 75"
          fill="none"
          stroke="#10B981"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function GlobalLoader({ message, isExiting }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(message || messages[0]);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 70 + (i % 3) * 18;
      arr.push({
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.4,
        size: 4 + (i % 4) * 2,
        color: i % 3 === 0 ? "#A855F7" : i % 3 === 1 ? "#38BDF8" : "#34D399",
        delay: (i * 0.1) % 1.5
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, LOADING_TEXT_DURATION);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    if (!message) {
      setDisplayMessage(messages[messageIndex]);
    }
  }, [messageIndex, message]);

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, rgba(30,27,75,0.98) 0%, rgba(15,23,42,0.995) 50%, rgba(2,6,23,1) 100%)",
            backdropFilter: "blur(24px)"
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)`,
              backgroundSize: "48px 48px"
            }}
          />
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full opacity-25 blur-[100px]"
            style={{ background: "radial-gradient(circle, #0284C7 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[380px] h-[380px] rounded-full opacity-20 blur-[90px]"
            style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)", transform: "translate(-50%, -50%)" }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            <div className="relative mb-10" style={{ width: 200, height: 200 }}>
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    custom={p.id}
                    variants={particleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute rounded-full"
                    style={{
                      left: `calc(50% + ${p.x}px)`,
                      top: `calc(50% + ${p.y}px)`,
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                      marginLeft: -p.size / 2,
                      marginTop: -p.size / 2
                    }}
                  />
                ))}
              </AnimatePresence>

              <motion.div
                className="absolute inset-0 rounded-full"
                variants={ringVariants}
                animate="animate"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, #A855F7 60deg, transparent 120deg, #38BDF8 180deg, transparent 240deg, #34D399 300deg, transparent 360deg)`,
                  mask: "radial-gradient(circle, transparent 58%, black 58%, black 62%, transparent 62%)",
                  WebkitMask: "radial-gradient(circle, transparent 58%, black 58%, black 62%, transparent 62%)",
                  filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))"
                }}
              />
              <motion.div
                className="absolute inset-2 rounded-full"
                variants={ringVariantsReverse}
                animate="animate"
                style={{
                  background: `conic-gradient(from 180deg, transparent 0deg, #0EA5E9 70deg, transparent 140deg, #9333EA 210deg, transparent 280deg, #10B981 350deg, transparent 360deg)`,
                  mask: "radial-gradient(circle, transparent 62%, black 62%, black 66%, transparent 66%)",
                  WebkitMask: "radial-gradient(circle, transparent 62%, black 62%, black 66%, transparent 66%)",
                  filter: "drop-shadow(0 0 6px rgba(56,189,248,0.6))"
                }}
              />

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div
                  className="rounded-3xl flex items-center justify-center"
                  style={{
                    width: 120,
                    height: 120,
                    background: "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.15), rgba(56,189,248,0.1) 50%, rgba(16,185,129,0.08))",
                    boxShadow: "0 0 60px rgba(168,85,247,0.35), 0 0 100px rgba(56,189,248,0.25), inset 0 0 40px rgba(168,85,247,0.1)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(168,85,247,0.3)"
                  }}
                >
                  <svg width="72" height="72" viewBox="0 0 100 100">
                    <defs>
                      <filter id="glowLoader">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <g style={{ transformOrigin: "50% 50%" }} filter="url(#glowLoader)">
                      <motion.path
                        d="M 35 25 L 10 50 L 35 75"
                        fill="none"
                        stroke="#9333EA"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                      />
                      <motion.path
                        d="M 60 15 L 40 85"
                        fill="none"
                        stroke="#0EA5E9"
                        strokeWidth="12"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.25, duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                      />
                      <motion.path
                        d="M 65 25 L 90 50 L 65 75"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                      />
                    </g>
                  </svg>
                </div>
              </motion.div>
            </div>

            <div className="relative w-[320px] mb-8">
              <div
                className="w-full h-[6px] rounded-full overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)"
                }}
              >
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: "linear-gradient(90deg, #7C3AED 0%, #A855F7 25%, #0EA5E9 50%, #38BDF8 75%, #10B981 100%)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.7), 0 0 30px rgba(56,189,248,0.4)"
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)"
                    }}
                  />
                </motion.div>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  variants={dotVariants(i)}
                  animate="animate"
                  className="w-3.5 h-3.5 rounded-full"
                  style={{
                    background: i === 0 ? "#A855F7" : i === 1 ? "#38BDF8" : "#34D399",
                    boxShadow: `0 0 16px ${i === 0 ? "#A855F7" : i === 1 ? "#38BDF8" : "#34D399"}`
                  }}
                />
              ))}
            </div>

            <motion.div
              key={displayMessage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <p
                className="text-base font-semibold tracking-wide"
                style={{
                  background: "linear-gradient(90deg, #E9D5FF 0%, #BAE6FD 50%, #A7F3D0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 30px rgba(168,85,247,0.3)"
                }}
              >
                {displayMessage}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageLoader({ isLoading, message, children }) {
  const [exiting, setExiting] = useState(false);
  const [showChildren, setShowChildren] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      setExiting(true);
      const timer = setTimeout(() => {
        setShowChildren(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setExiting(false);
      setShowChildren(false);
    }
  }, [isLoading]);

  return (
    <>
      {(isLoading || exiting) && <GlobalLoader message={message} isExiting={exiting && !isLoading} />}
      {showChildren && children}
    </>
  );
}
