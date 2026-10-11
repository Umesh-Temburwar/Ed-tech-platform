import React from 'react';
import { componentVariants } from '../../theme';

const Badge = React.memo(function Badge({
  children,
  variant = 'neutral',
  size = 'medium',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  dot = false,
  ...props
}) {
  // Defensive coding: Ensure children exists
  const content = children || '';
  
  // Size variants
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base',
  };
  
  // Get variant classes with fallback
  const variantClasses = componentVariants?.badge?.[variant] || componentVariants.badge.neutral;
  
  // Base classes
  const baseClasses = [
    'inline-flex items-center',
    'font-medium rounded-full',
    'transition-colors duration-200',
    sizeClasses[size] || sizeClasses.medium,
    variantClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <span className={baseClasses} {...props}>
      {/* Dot indicator */}
      {dot && (
        <span className={`w-2 h-2 rounded-full mr-2 ${
          variant === 'primary' ? 'bg-yellow-400' :
          variant === 'secondary' ? 'bg-blue-400' :
          variant === 'success' ? 'bg-green-400' :
          variant === 'warning' ? 'bg-orange-400' :
          variant === 'error' ? 'bg-red-400' :
          'bg-richblack-400'
        }`} />
      )}
      
      {/* Left Icon */}
      {Icon && iconPosition === 'left' && (
        <Icon className={`w-3 h-3 ${content ? 'mr-1' : ''}`} />
      )}
      
      {/* Content */}
      {content && <span>{content}</span>}
      
      {/* Right Icon */}
      {Icon && iconPosition === 'right' && (
        <Icon className={`w-3 h-3 ${content ? 'ml-1' : ''}`} />
      )}
    </span>
  );
});

export default Badge;