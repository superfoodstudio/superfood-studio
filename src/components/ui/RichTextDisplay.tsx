'use client';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  // If content is empty or null, return nothing
  if (!content) return null;

  // Basic sanitization - remove script tags and dangerous attributes
  const sanitizedContent = content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');

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