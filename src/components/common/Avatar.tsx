import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  isOnline,
  className,
}) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={twMerge(
            clsx('rounded-full object-cover border border-slate-200 dark:border-slate-700', sizes[size], className)
          )}
        />
      ) : (
        <div
          className={twMerge(
            clsx(
              'rounded-full bg-gradient-to-tr from-brand-600 to-ai-spark text-white font-semibold flex items-center justify-center border border-white/20 shadow-sm',
              sizes[size],
              className
            )
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={twMerge(
            clsx(
              'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-dark-900',
              isOnline ? 'bg-emerald-500' : 'bg-slate-400',
              size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
            )
          )}
        />
      )}
    </div>
  );
};
