"use client"

import React, { useEffect, useRef, useState } from 'react'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link,
  Underline,
  Quote,
  Code
} from 'lucide-react'
import 'quill/dist/quill.snow.css'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function QuillEditor({ value, onChange, placeholder = "Enter text...", className }: QuillEditorProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && toolbarRef.current && editorRef.current && !quillRef.current) {
      // Dynamic import to avoid SSR issues
      import('quill').then((QuillModule) => {
        const Quill = QuillModule.default

        // Create the editor with custom toolbar
        const editor = new Quill(editorRef.current!, {
          theme: 'snow',
          modules: {
            toolbar: {
              container: toolbarRef.current,
              handlers: {
                'link': function(this: any, value: boolean) {
                  if (value) {
                    const url = prompt('Enter the URL:')
                    if (url) {
                      const quill = this.quill || editor
                      quill.format('link', url)
                    }
                  } else {
                    const quill = this.quill || editor
                    quill.format('link', false)
                  }
                }
              }
            },
            history: {
              delay: 1000,
              maxStack: 100,
              userOnly: false
            }
          },
          formats: [
            'bold', 'italic', 'underline', 'strike', 
            'blockquote', 'code-block', 'code',
            'list', 'link'
          ],
          placeholder: placeholder,
        })

        // Set initial content
        if (value) {
          editor.root.innerHTML = value
        }

        // Listen for content changes
        editor.on('text-change', (delta, oldDelta, source) => {
          if (source === 'user') {
            const html = editor.root.innerHTML
            onChange(html)
          }
        })

        quillRef.current = editor
      })
    }
  }, [isClient, placeholder])

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  if (!isClient) {
    return (
      <div className={className}>
        <div className="bg-[#0D1117] border border-[#30363D] rounded-t-lg p-3">
          <div className="flex flex-wrap items-center gap-1">
            <div className="h-8 w-8 bg-[#21262D] rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-[#21262D] rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-[#21262D] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="min-h-32 bg-[#0D1117] border-[#30363D] border-t-0 rounded-b-lg p-3">
          <div className="text-[#7D8590]">{placeholder}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Custom Toolbar */}
      <div 
        ref={toolbarRef}
        className="bg-[#0D1117] border border-[#30363D] rounded-t-lg p-3 flex flex-wrap items-center gap-1"
      >
        <button className="ql-bold h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        <button className="ql-italic h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        <button className="ql-underline h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Underline">
          <Underline className="h-4 w-4" />
        </button>
        <button className="ql-strike h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </button>
        <button className="ql-code h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Inline Code">
          <Code className="h-4 w-4" />
        </button>
        <button className="ql-list h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" value="ordered" title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </button>
        <button className="ql-list h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" value="bullet" title="Bullet List">
          <List className="h-4 w-4" />
        </button>
        <button className="ql-blockquote h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Quote">
          <Quote className="h-4 w-4" />
        </button>
        <button className="ql-link h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] rounded flex items-center justify-center transition-colors" title="Link">
          <Link className="h-4 w-4" />
        </button>
      </div>

      {/* Quill Editor Container */}
      <div 
        ref={editorRef}
        className="quill-editor-dark"
      />

      <style jsx global>{`
        .quill-editor-dark .ql-container {
          border: 1px solid #30363D;
          border-top: none;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          background-color: #0D1117;
          font-family: inherit;
        }
        
        .quill-editor-dark .ql-editor {
          color: #C9D1D9;
          background-color: #0D1117;
          min-height: 8rem;
          padding: 0.75rem;
          border: none;
          outline: none;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .quill-editor-dark .ql-editor.ql-blank::before {
          color: #7D8590;
          font-style: normal;
          left: 0.75rem;
          right: 0.75rem;
        }
        
        .quill-editor-dark .ql-editor:focus {
          outline: none;
        }
        
        .quill-editor-dark .ql-container:focus-within {
          border-color: #14b8a6;
        }
        
        .quill-editor-dark .ql-editor p {
          margin: 0;
          padding: 0;
        }
        
        .quill-editor-dark .ql-editor strong {
          font-weight: 600;
          color: #C9D1D9;
        }
        
        .quill-editor-dark .ql-editor em {
          font-style: italic;
          color: #C9D1D9;
        }
        
        .quill-editor-dark .ql-editor u {
          text-decoration: underline;
          color: #C9D1D9;
        }
        
        .quill-editor-dark .ql-editor s {
          text-decoration: line-through;
          color: #C9D1D9;
        }
        
        .quill-editor-dark .ql-editor code {
          background-color: #21262D;
          color: #F79009;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
        }
        
        .quill-editor-dark .ql-editor blockquote {
          border-left: 4px solid #30363D;
          margin: 0;
          padding-left: 1rem;
          color: #7D8590;
        }
        
        .quill-editor-dark .ql-editor ul,
        .quill-editor-dark .ql-editor ol {
          padding-left: 1.5rem;
          margin: 0;
        }
        
        .quill-editor-dark .ql-editor li {
          margin-bottom: 0.25rem;
          color: #C9D1D9;
        }
        
        .quill-editor-dark .ql-editor a {
          color: #58a6ff;
          text-decoration: underline;
        }
        
        .quill-editor-dark .ql-editor a:hover {
          color: #79c0ff;
        }
        
        .quill-editor-dark .ql-toolbar {
          display: none;
        }
        
        .quill-editor-dark .ql-tooltip {
          background-color: #161B22;
          border: 1px solid #30363D;
          color: #C9D1D9;
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
        
        .quill-editor-dark .ql-tooltip input {
          background-color: #0D1117;
          border: 1px solid #30363D;
          color: #C9D1D9;
          border-radius: 0.25rem;
          padding: 0.25rem;
        }
        
        .quill-editor-dark .ql-tooltip a {
          color: #58a6ff;
        }
        
        .quill-editor-dark .ql-tooltip .ql-preview {
          color: #C9D1D9;
        }
        
        .quill-editor-dark .ql-tooltip .ql-action,
        .quill-editor-dark .ql-tooltip .ql-remove {
          color: #58a6ff;
        }
        
        .quill-editor-dark .ql-tooltip .ql-action:hover,
        .quill-editor-dark .ql-tooltip .ql-remove:hover {
          color: #79c0ff;
        }
      `}</style>
    </div>
  )
}