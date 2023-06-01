import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps extends Omit<React.HTMLProps<HTMLDivElement>, 'dangerouslySetInnerHTML' | 'children'> {
  html: string;
}

export const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, ...props }) => {
  const cleanHtml = React.useMemo(() => {
    return DOMPurify.sanitize(html);
  }, []);

  return <div
    {...props}
    dangerouslySetInnerHTML={{
      __html: cleanHtml
    }}
  />;
};
