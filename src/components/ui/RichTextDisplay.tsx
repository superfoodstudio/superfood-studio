'use client';

import { useMemo } from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
  'span', 'div', 'img',
]);
const ALLOWED_ATTR = new Set(['href', 'target', 'rel', 'src', 'alt', 'class', 'style']);

function sanitizeHtml(html: string): string {
  if (typeof document === 'undefined') {
    // SSR fallback: strip all tags
    return html.replace(/<[^>]*>/g, '');
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  function walk(node: Node): void {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tag)) {
          // Replace disallowed element with its text content
          const text = document.createTextNode(el.textContent || '');
          node.replaceChild(text, el);
          continue;
        }

        // Remove disallowed attributes
        for (const attr of Array.from(el.attributes)) {
          if (!ALLOWED_ATTR.has(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          }
        }

        // Sanitize href to prevent javascript: URLs
        if (el.hasAttribute('href')) {
          const href = el.getAttribute('href') || '';
          if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href.trim())) {
            el.removeAttribute('href');
          }
        }

        // Sanitize src to prevent javascript: URLs
        if (el.hasAttribute('src')) {
          const src = el.getAttribute('src') || '';
          if (!/^(https?:\/\/|\/|data:image\/)/i.test(src.trim())) {
            el.removeAttribute('src');
          }
        }

        walk(el);
      }
    }
  }

  walk(doc.body);
  return doc.body.innerHTML;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    return sanitizeHtml(content);
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
