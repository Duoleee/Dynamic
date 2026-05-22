"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw } from "lucide-react"
import { useState } from "react"

interface RevokeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fru: string
  onConfirm: (notes: string) => void
}

export function RevokeDialog({
  open,
  onOpenChange,
  fru,
  onConfirm,
}: RevokeDialogProps) {
  const [notes, setNotes] = useState("")

  const handleConfirm = () => {
    onConfirm(notes)
    setNotes("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setNotes("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RotateCcw className="h-5 w-5 text-orange-500" />
            Revoke Resolution?
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-muted-foreground">
            Are you sure you want to revoke the resolution for this conflict? The status will be set back to &quot;Revoked&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">
              Notes (Optional)
            </label>
            <Textarea
              placeholder="Reason for revoking..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Revoke
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
