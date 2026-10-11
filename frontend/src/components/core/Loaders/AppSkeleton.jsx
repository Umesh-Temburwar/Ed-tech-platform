import React, { useMemo } from "react";
import { motion, AnimatePresence, useCycle } from "framer-motion";

const messages = [
  "Loading content...",
  "Preparing interface...",
  "Almost there...",
];

function AppSkeleton() {
  const [currentMessage, cycleMessage] = useCycle(...messages);

  const skeletonRows = useMemo(() => [0, 1, 2], []);
  const skeletonDots = useMemo(() => [0, 1, 2], []);

  return (
    <motion.div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), #0a0a0f",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div
          className="rounded-3xl p-10 backdrop-blur-xl border"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
                  filter: "blur(2px)",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 180deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6)",
                  filter: "blur(1px)",
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 6,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
              <div
                className="absolute inset-4 rounded-full flex items-center justify-center"
                style={{ background: "#0a0a0f" }}
              >
                <motion.svg
                  width="56"
                  height="56"
                  viewBox="0 0 100 100"
                  style={{ transformOrigin: "50% 50%" }}
                >
                  <defs>
                    <filter id="skeletonGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <motion.path
                    d="M 35 25 L 10 50 L 35 75"
                    fill="none"
                    stroke="#9333EA"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#skeletonGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop",
                      repeatDelay: 0.5,
                    }}
                  />
                  <motion.path
                    d="M 60 15 L 40 85"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="10"
                    strokeLinecap="round"
                    filter="url(#skeletonGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 1.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop",
                      repeatDelay: 0.5,
                    }}
                  />
                  <motion.path
                    d="M 65 25 L 90 50 L 65 75"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#skeletonGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 0.4,
                      duration: 1.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop",
                      repeatDelay: 0.5,
                    }}
                  />
                </motion.svg>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="relative w-full h-2 rounded-full overflow-hidden bg-white/5">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute inset-y-0 w-1/3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                  animate={{ left: ["-33%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </div>

              <div className="space-y-2 pt-2">
                {skeletonRows.map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 rounded-full bg-white/5 overflow-hidden"
                    style={{ width: `${100 - i * 20}%` }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                {skeletonDots.map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        i === 0
                          ? "#06b6d4"
                          : i === 1
                          ? "#8b5cf6"
                          : "#ec4899",
                    }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessage}
                  className="text-sm font-medium text-gray-400 tracking-wide"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    setTimeout(cycleMessage, 1800);
                  }}
                >
                  {currentMessage}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(AppSkeleton);

export const MiniSkeleton = React.memo(function MiniSkeleton() {
  const miniSkeletonDots = useMemo(() => [0, 1, 2], []);
  return (
    <motion.div
      className="inline-flex items-center gap-3 rounded-xl px-4 py-3 backdrop-blur-md border"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #06b6d4)",
            filter: "blur(1px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        />
        <div
          className="absolute inset-[3px] rounded-full flex items-center justify-center"
          style={{ background: "#0a0a0f" }}
        >
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 100 100"
          >
            <motion.path
              d="M 35 25 L 10 50 L 35 75"
              fill="none"
              stroke="#9333EA"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
            />
            <motion.path
              d="M 60 15 L 40 85"
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.15,
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
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
              transition={{
                delay: 0.3,
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
            />
          </motion.svg>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {miniSkeletonDots.map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                i === 0 ? "#06b6d4" : i === 1 ? "#8b5cf6" : "#ec4899",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.12,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});
