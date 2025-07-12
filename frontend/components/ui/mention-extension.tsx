"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Mention from '@tiptap/extension-mention'
import { PluginKey } from '@tiptap/pm/state'
import tippy, { Instance as TippyInstance } from 'tippy.js'

interface MentionListProps {
  items: Array<{ id: string; username: string }>
  command: (item: { id: string; username: string }) => void
  selectedIndex: number
}

const MentionList = ({ items, command, selectedIndex }: MentionListProps) => {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg shadow-lg py-2 max-h-48 overflow-y-auto">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={item.id}
            className={`flex items-center w-full px-3 py-2 text-left hover:bg-[#21262D] text-[#C9D1D9] transition-colors ${
              selectedIndex === index ? 'bg-[#21262D]' : ''
            }`}
            onClick={() => command(item)}
          >
            <div className="w-8 h-8 bg-[#30363D] rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium">
                {item.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>@{item.username}</span>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-[#7D8590]">
          Type at least 2 characters and wait 2 seconds...
        </div>
      )}
    </div>
  )
}

export const createMentionExtension = (searchUsers: (query: string) => Promise<any[]>) => {
  // Debounce function to limit API calls
  let searchTimeout: NodeJS.Timeout | null = null
  
  const debouncedSearch = (query: string): Promise<any[]> => {
    return new Promise((resolve) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      
      searchTimeout = setTimeout(async () => {
        try {
          console.log('Debounced search executing for:', query)
          const users = await searchUsers(query)
          console.log('Found users:', users)
          resolve(users)
        } catch (error) {
          console.error('Error searching users:', error)
          resolve([])
        }
      }, 2000) // 2 second delay
    })
  }

  return Mention.configure({
    HTMLAttributes: {
      class: 'text-blue-400 font-medium bg-blue-500/20 px-1 rounded',
    },
    suggestion: {
      items: async ({ query }: { query: string }) => {
        if (query.length < 2) return []
        
        console.log('Mention triggered for query:', query)
        const users = await debouncedSearch(query)
        
        return users.map(user => ({
          id: user._id,
          username: user.username
        }))
      },

      render: () => {
        let reactRenderer: ReactRenderer
        let popup: TippyInstance[]

        return {
          onStart: (props: any) => {
            reactRenderer = new ReactRenderer(MentionList, {
              props,
              editor: props.editor,
            })

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: reactRenderer.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            })
          },

          onUpdate(props: any) {
            reactRenderer.updateProps(props)

            if (popup?.[0]) {
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            }
          },

          onKeyDown(props: any) {
            if (props.event.key === 'Escape') {
              popup?.[0]?.hide()
              return true
            }

            return (reactRenderer.ref as any)?.onKeyDown?.(props)
          },

          onExit() {
            popup?.[0]?.destroy()
            reactRenderer.destroy()
          },
        }
      },
    },
  })
}
