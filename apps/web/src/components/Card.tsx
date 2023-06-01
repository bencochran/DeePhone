import React from 'react';
import { twMerge as cn } from 'tailwind-merge';

export interface CardProps {
  className?: string;
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({ children, className }) => {
  return (
    <div
      className={cn('p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-black dark:text-white h-fit', className)}
    >
      {children}
    </div>
  );
};
