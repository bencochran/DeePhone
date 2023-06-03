import React from 'react';

export interface PageProps {
  title: string | React.ReactNode;
}

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ title, children }) => {
  return (
    <div className='mx-4 sm:mx-8 my-6'>
      <div className='mb-4'>
        {typeof title === 'string' ? (
          <h2 className='text-slate-900 dark:text-slate-300 font-medium text-3xl mb-4'>
            {title}
          </h2>
        ) : ( title )}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,378px)] gap-2'>
        {children}
      </div>
    </div>
  );
};
