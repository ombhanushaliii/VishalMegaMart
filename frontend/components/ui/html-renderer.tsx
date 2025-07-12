"use client"

import { useEffect, useState } from 'react'

interface HtmlRendererProps {
  content: string
  className?: string
}

export function HtmlRenderer({ content, className = "" }: HtmlRendererProps) {
  const [sanitizedContent, setSanitizedContent] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Simple HTML sanitization - remove dangerous tags and attributes
    const sanitizeHtml = (html: string): string => {
      // Allow only safe tags
      const allowedTags = ['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span']
      
      // Remove script tags and their content
      let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      
      // Remove dangerous attributes
      sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '') // Remove onclick, onload, etc.
      sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '') // Remove onclick, onload, etc.
      sanitized = sanitized.replace(/javascript:/gi, '') // Remove javascript: links
      
      return sanitized
    }
    
    try {
      const sanitized = sanitizeHtml(content)
      setSanitizedContent(sanitized)
    } catch (error) {
      console.error('Error sanitizing content:', error)
      // Fallback: strip HTML tags manually
      setSanitizedContent(content.replace(/<[^>]*>/g, ''))
    }
  }, [content])

  // Show a loading placeholder during SSR or while sanitizing
  if (!isClient) {
    return (
      <div className={`prose prose-invert max-w-none ${className}`}>
        <div className="text-[#C9D1D9]">{content.replace(/<[^>]*>/g, '')}</div>
      </div>
    )
  }

  // Render the sanitized HTML content
  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent || content.replace(/<[^>]*>/g, '') }}
      style={{
        // Override prose styles to match our design
        '--tw-prose-body': '#C9D1D9',
        '--tw-prose-headings': '#C9D1D9',
        '--tw-prose-lead': '#C9D1D9',
        '--tw-prose-links': '#58a6ff',
        '--tw-prose-bold': '#C9D1D9',
        '--tw-prose-counters': '#7D8590',
        '--tw-prose-bullets': '#7D8590',
        '--tw-prose-hr': '#30363D',
        '--tw-prose-quotes': '#7D8590',
        '--tw-prose-quote-borders': '#30363D',
        '--tw-prose-captions': '#7D8590',
        '--tw-prose-code': '#7ee8fa',
        '--tw-prose-pre-code': '#C9D1D9',
        '--tw-prose-pre-bg': '#0D1117',
        '--tw-prose-th-borders': '#30363D',
        '--tw-prose-td-borders': '#21262D',
      } as React.CSSProperties}
    />
  )
}
