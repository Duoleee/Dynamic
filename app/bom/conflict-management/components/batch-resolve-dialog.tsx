"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface BatchResolveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fruList: string[]
  onConfirm: () => void
}

export function BatchResolveDialog({
  open,
  onOpenChange,
  fruList,
  onConfirm,
}: BatchResolveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Confirm Batch Resolve
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to resolve the following {fruList.length} conflict(s)?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="max-h-32 overflow-y-auto rounded-md bg-muted p-3">
            <ul className="space-y-1">
              {fruList.map((fru) => (
                <li key={fru} className="text-sm font-medium font-mono">
                  {fru}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
