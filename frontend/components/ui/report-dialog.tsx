"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Flag } from 'lucide-react'
import { useReports } from '@/context/ReportContext'

interface ReportDialogProps {
  contentType: 'question' | 'answer' | 'user'
  contentId: string
  triggerClassName?: string
}

const reportReasons = [
  { value: 'spam', label: 'Spam or unwanted content' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'misinformation', label: 'False or misleading information' },
  { value: 'offensive', label: 'Offensive or hateful content' },
  { value: 'other', label: 'Other' }
]

export function ReportDialog({ contentType, contentId, triggerClassName }: ReportDialogProps) {
  const { submitReport, loading } = useReports()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleSubmit = async () => {
    setError('')
    
    if (!reason) {
      setError('Please select a reason for reporting')
      return
    }

    console.log('Submitting report:', { contentType, contentId, reason, description }) // Debug log

    const result = await submitReport({
      contentType,
      contentId,
      reason,
      description: description.trim() || undefined
    })

    console.log('Report result:', result) // Debug log

    if (result.success) {
      setSuccess(true)
      setReason('')
      setDescription('')
      setTimeout(() => {
        handleClose(false)
      }, 2000)
    } else {
      setError(result.error || 'Failed to submit report')
    }
  }

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form when closing
      setReason('')
      setDescription('')
      setError('')
      setSuccess(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setReason('')
    setDescription('')
    setError('')
    setSuccess(false)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={triggerClassName || "text-[#7D8590] hover:text-red-400 hover:bg-red-500/10"}
        onClick={handleTriggerClick}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <Flag className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={handleClose}>
      
      <DialogContent 
        className="bg-[#161B22] border-[#21262D] text-[#C9D1D9]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-[#C9D1D9] flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-400" />
            Report {contentType}
          </DialogTitle>
          <DialogDescription className="text-[#7D8590]">
            Help us maintain a safe and helpful community. Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Flag className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-green-400 font-medium">Report submitted successfully!</p>
            <p className="text-[#7D8590] text-sm mt-1">Thank you for helping keep our community safe.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
                Reason for reporting *
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9]">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent className="bg-[#161B22] border-[#21262D]">
                  {reportReasons.map((reasonOption) => (
                    <SelectItem 
                      key={reasonOption.value} 
                      value={reasonOption.value}
                      className="text-[#C9D1D9] hover:bg-[#21262D]"
                    >
                      {reasonOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
                Additional details (optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any additional context that might help us understand the issue..."
                className="bg-[#0D1117] border-[#30363D] text-[#C9D1D9] placeholder:text-[#7D8590] focus:border-teal-400 min-h-[100px]"
                maxLength={500}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
              <p className="text-xs text-[#7D8590] mt-1">{description.length}/500 characters</p>
            </div>
          </div>
        )}

        {!success && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-[#30363D] text-[#C9D1D9] hover:bg-[#21262D]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !reason}
              className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
