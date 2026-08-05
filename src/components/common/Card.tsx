import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'outline';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = true,
  className,
  ...props
}) => {
  const variants = {
    glass: 'glass-card',
    solid: 'bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-800 shadow-sm',
    outline: 'bg-transparent border border-slate-200 dark:border-slate-800',
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3 } : undefined}
      transition={{ duration: 0.2 }}
      className={twMerge(
        clsx(
          'rounded-xl p-5 overflow-hidden',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
