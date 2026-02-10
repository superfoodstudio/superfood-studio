'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    if (typeof window === 'undefined') {
      // SSR fallback: strip all tags
      return content.replace(/<[^>]*>/g, '');
    }
    return DOMPurify.sanitize(content);
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={className}
      style={{
        lineHeight: '1.6',
        wordBreak: 'break-word'
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
