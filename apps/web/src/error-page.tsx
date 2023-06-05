import React from 'react';
import { useRouteError } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();

  const message = React.useMemo(() => {
    if (typeof error !== 'object') return null;
    if (error && 'statusText' in error && typeof error.statusText === 'string')
      return error.statusText;
    if (error && 'message' in error && typeof error.message === 'string')
      return error.message;
    return null;
  }, [error]);

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {message && (
        <p>
          <i>{message}</i>
        </p>
      )}
    </div>
  );
};
