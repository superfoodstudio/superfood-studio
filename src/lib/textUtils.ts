/**
 * Strips HTML tags from text and returns clean plain text
 * @param html - HTML string to strip
 * @param maxLength - Optional maximum length to truncate to
 * @returns Clean plain text string
 */
export function stripHtml(html: string, maxLength?: number): string {
  if (!html) return '';
  
  // Remove HTML tags
  const stripped = html.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Clean up extra whitespace
  const cleaned = decoded.replace(/\s+/g, ' ').trim();
  
  // Truncate if maxLength is provided
  if (maxLength && cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength).trim() + '...';
  }
  
  return cleaned;
}

/**
 * Gets a preview of text content, stripping HTML and truncating
 * @param html - HTML string to preview
 * @param length - Length to truncate to (default: 150)
 * @returns Preview text string
 */
export function getTextPreview(html: string, length = 150): string {
  return stripHtml(html, length);
}