import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps
  extends Omit<
    React.HTMLProps<HTMLDivElement>,
    'dangerouslySetInnerHTML' | 'children'
  > {
  html: string;
}

export const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({
  html,
  ...props
}) => {
  const cleanHtml = React.useMemo(() => DOMPurify.sanitize(html), []);

  return (
    <div
      {...props}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: cleanHtml,
      }}
    />
  );
};
