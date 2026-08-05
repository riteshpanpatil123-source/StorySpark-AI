import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse rounded-lg bg-slate-200 dark:bg-dark-700/80',
          className
        )
      )}
    />
  );
};
