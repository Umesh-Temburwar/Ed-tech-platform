import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../ui';

/**
 * MotionCard Component
 * Reusable animated card component with Framer Motion hover/tap interactions
 * and pre-configured visual variants.
 */
const MotionCard = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      className = '',
      onClick,
      hoverable = true,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'p-4 rounded-xl border transition-all duration-200 focus:outline-none';

    const variants = {
      default: 'bg-richblack-800 border-richblack-700 text-richblack-5 shadow-sm',
      elevated: 'bg-richblack-800 border-richblack-700 text-richblack-5 shadow-md shadow-black/40',
      flat: 'bg-richblack-800/60 border-richblack-700/50 text-richblack-5',
      gradient: 'bg-gradient-to-br from-yellow-50/10 via-richblack-800 to-richblack-900 border-yellow-50/20 text-white',
      statistics: 'bg-gradient-to-br from-richblack-800 to-richblack-900 border-richblack-700 text-white shadow-lg',
      testimonial: 'bg-richblack-800/80 border-l-4 border-l-yellow-50 border-richblack-700 text-richblack-100',
      course: 'bg-richblack-800 border-richblack-700 hover:border-yellow-50/40 text-richblack-5 shadow-sm',
      student: 'bg-richblack-800 border border-richblack-700 text-richblack-100',
      instructor: 'bg-richblack-800 border-richblack-700 shadow-md text-richblack-5',
      analytics: 'bg-richblack-900 border-richblack-800 shadow-xl text-richblack-5',
    };

    const interactive = hoverable ? 'hover:scale-[1.02] cursor-pointer' : '';

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant] ?? variants['default'], interactive, className)}
        onClick={onClick}
        whileHover={hoverable ? { scale: 1.015 } : {}}
        whileTap={hoverable ? { scale: 0.985 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionCard.displayName = 'MotionCard';

export default MotionCard;
