
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HtmlMessageProps {
  content: string;
  className?: string;
}

const HtmlMessage: React.FC<HtmlMessageProps> = ({ content, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simple HTML sanitization - remove dangerous elements
  const sanitizeHtml = (html: string) => {
    // Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove dangerous attributes
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
    
    // Remove iframe, object, embed tags
    sanitized = sanitized.replace(/<(iframe|object|embed)[^>]*>.*?<\/\1>/gi, '');
    
    return sanitized;
  };

  // Check if content is long (more than 500 characters or multiple headings)
  const isLongContent = content.length > 500 || (content.match(/<h[1-6][^>]*>/gi) || []).length > 1;
  
  // For long content, show only first part when collapsed
  const getDisplayContent = () => {
    if (!isLongContent || isExpanded) {
      return sanitizeHtml(content);
    }
    
    // Find a good breaking point - first paragraph or first 300 chars
    const firstParagraphEnd = content.indexOf('</p>');
    if (firstParagraphEnd > 0 && firstParagraphEnd < 400) {
      return sanitizeHtml(content.substring(0, firstParagraphEnd + 4)) + '...';
    }
    
    return sanitizeHtml(content.substring(0, 300)) + '...';
  };

  return (
    <div className={`html-message-container ${className}`}>
      <div 
        className="html-content prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
      />
      
      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Ver mais
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default HtmlMessage;
