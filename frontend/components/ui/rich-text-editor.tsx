"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import { common, createLowlight } from 'lowlight'
import { createMentionExtension } from './mention-extension'
import { useNotifications } from '@/context/NotificationContext'
import { Button } from './button'
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Code2,
  Undo,
  Redo
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Create lowlight instance
const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string
  onUpdate: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({ 
  content, 
  onUpdate, 
  placeholder = "Start typing...",
  className,
  minHeight = "200px"
}: RichTextEditorProps) {
  const { searchUsers } = useNotifications()
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-teal-400 underline hover:text-teal-300',
        },
      }),
      createMentionExtension(searchUsers),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none focus:outline-none',
          'text-[#C9D1D9] leading-relaxed',
          '[&_code]:bg-[#21262D] [&_code]:text-teal-400 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm',
          '[&_pre]:bg-[#0D1117] [&_pre]:border [&_pre]:border-[#30363D] [&_pre]:rounded-lg [&_pre]:p-4',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-[#30363D] [&_blockquote]:pl-4 [&_blockquote]:italic',
          '[&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4',
          '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#C9D1D9]',
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#C9D1D9]',
          '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#C9D1D9]',
          '[&_strong]:font-bold [&_strong]:text-[#C9D1D9]',
          '[&_em]:italic',
          '[&_a]:text-teal-400 [&_a]:underline hover:[&_a]:text-teal-300',
          className
        ),
        style: `min-height: ${minHeight}`,
      },
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-[#30363D] rounded-lg bg-[#0D1117] focus-within:border-teal-400 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#30363D]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bold') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('italic') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('code') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-[#30363D] mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bulletList') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('orderedList') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('blockquote') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('codeBlock') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <Code2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('link') 
              ? "bg-teal-500/20 text-teal-400" 
              : "text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D]"
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-[#30363D] mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] disabled:opacity-50"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0 text-[#7D8590] hover:text-[#C9D1D9] hover:bg-[#21262D] disabled:opacity-50"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}