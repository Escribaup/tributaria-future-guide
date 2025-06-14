
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
      
      <style jsx>{`
        .html-content {
          line-height: 1.6;
        }
        
        .html-content h1, .html-content h2, .html-content h3 {
          color: #1e40af;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .html-content h1 {
          font-size: 1.25rem;
        }
        
        .html-content h2 {
          font-size: 1.125rem;
        }
        
        .html-content h3 {
          font-size: 1rem;
        }
        
        .html-content p {
          margin-bottom: 0.75rem;
          color: #374151;
        }
        
        .html-content ul, .html-content ol {
          margin: 0.5rem 0;
          padding-left: 1.25rem;
        }
        
        .html-content li {
          margin-bottom: 0.25rem;
          color: #374151;
        }
        
        .html-content strong {
          font-weight: 600;
          color: #1f2937;
        }
        
        .html-content em {
          font-style: italic;
          color: #6b7280;
        }
        
        .html-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .html-content a:hover {
          color: #1d4ed8;
        }
        
        .html-content footer {
          margin-top: 1rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .html-content small {
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default HtmlMessage;
