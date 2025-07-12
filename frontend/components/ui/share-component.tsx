"use client"

import { useState, useEffect } from 'react'
import React from 'react'
import { Share2, Copy, Check, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface ShareComponentProps {
  questionId: string
  title: string
  description?: string
  trigger?: React.ReactNode
}

export function ShareComponent({ questionId, title, description, trigger }: ShareComponentProps) {
  const [shareLink, setShareLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const generateShareLink = async () => {
    setLoading(true)
    try {
      // Always generate the frontend URL for the question
      const frontendUrl = window.location.origin
      const questionUrl = `${frontendUrl}/questions/${questionId}`
      setShareLink(questionUrl)
      
      // Optional: Call backend to log the share if needed
      try {
        await fetch(`https://vishalmegamart.onrender.com/api/v1/questions/${questionId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
      } catch (error) {
        console.log('Share tracking failed:', error)
      }
    } catch (error) {
      console.error('Failed to generate share link:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate link when dialog opens
  useEffect(() => {
    if (open && !shareLink) {
      generateShareLink()
    }
  }, [open, shareLink])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "The question link has been copied to your clipboard.",
      })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive"
      })
    }
  }

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(shareLink)
    const text = encodeURIComponent(`Check out this question: ${title}`)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#7D8590] hover:text-[#C9D1D9]"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-[#161B22] border-[#30363D] text-[#C9D1D9] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-teal-400" />
            Share Question
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 text-[#C9D1D9]">{title}</h3>
            {description && (
              <p className="text-sm text-[#7D8590] line-clamp-2">
                {description.length > 100 ? `${description.substring(0, 100)}...` : description}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                placeholder={loading ? "Generating link..." : "Share link will appear here"}
                className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] flex-1"
              />
              <Button
                onClick={copyToClipboard}
                disabled={!shareLink || loading}
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            {copied && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Link copied to clipboard!
              </p>
            )}
            
            {!shareLink && !loading && (
              <Button
                onClick={generateShareLink}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Link className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>
            )}
          </div>
          
          {shareLink && (
            <div className="space-y-3">
              <div className="text-sm text-[#7D8590]">Share on social media:</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('twitter')}
                  className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D]"
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('facebook')}
                  className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D]"
                >
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('linkedin')}
                  className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D]"
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('whatsapp')}
                  className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D]"
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
