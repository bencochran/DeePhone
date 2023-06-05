import React from 'react';
import { twMerge as cn } from 'tailwind-merge';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => (
  <div
    className={cn(
      'animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full',
      size === 'sm' && 'w-4 h-4',
      size === 'lg' && 'w-8 h-8',
      className
    )}
    role='status'
    aria-label='loading'
  >
    <span className='sr-only'>Loading…</span>
  </div>
);
