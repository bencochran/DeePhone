import React from 'react';
import { twMerge as cn } from 'tailwind-merge';

export interface CardProps {
  title?: string;
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({ title, children }) => {
  return (
    <div
      className='p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-black dark:text-white h-fit'
    >
      {title &&
        <h2 className='text-slate-900 dark:text-slate-300 font-medium text-2xl mb-3'>
          {title}
        </h2>
      }
      <div>
        {children}
      </div>
    </div>
  );
};
