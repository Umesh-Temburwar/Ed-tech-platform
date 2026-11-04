import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-center select-none focus:outline-none cursor-pointer" 
      aria-label="CoreDev Academy home"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative shrink-0">
        <svg
          width={32}
          height={32}
          viewBox="0 0 100 100"
          className="transition-transform duration-200"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        >
          {/* Left Bracket */}
          <path
            d="M 35 25 L 12 50 L 35 75"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Slash */}
          <path
            d="M 58 18 L 42 82"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          {/* Right Bracket */}
          <path
            d="M 65 25 L 88 50 L 65 75"
            fill="none"
            stroke="var(--hot)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col ml-2.5 leading-none">
        <div className="flex items-center tracking-tight">
          <span className="text-base font-extrabold text-text tracking-tight">
            CORE
          </span>
          <span className="text-base font-extrabold text-accent tracking-tight">
            DEV
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.2em] text-muted uppercase mt-0.5">
          ACADEMY
        </span>
      </div>
    </div>
  );
}

export default React.memo(Logo);
