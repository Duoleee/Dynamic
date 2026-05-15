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
import { useState } from "react"

interface RevokeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lenovoPpn: string
  substitutePpn: string
  onConfirm: (notes: string) => void
}

export function RevokeDialog({
  open,
  onOpenChange,
  lenovoPpn,
  substitutePpn,
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
          <DialogTitle className="text-xl">
            Revoke Confirmation
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-muted-foreground">
            Are you sure you want to revoke this substitution relationship?
            <br />
            The status will be changed to &quot;Revoked&quot; and the revocation time will be recorded.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Information Card */}
          <div className="bg-muted/50 rounded-lg px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Lenovo PPN:</span>
              <span className="text-sm font-medium font-mono">{lenovoPpn}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Substitute PPN:</span>
              <span className="text-sm font-medium font-mono">{substitutePpn}</span>
            </div>
          </div>

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
          >
            Revoke
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
