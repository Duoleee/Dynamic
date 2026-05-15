"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import { ReactNode } from "react"

export type ConfirmType = "default" | "destructive" | "warning"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  type?: ConfirmType
  icon?: ReactNode
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm",
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  type = "default",
  icon,
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) return icon
    switch (type) {
      case "destructive":
        return <Trash2 className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return null
    }
  }

  const getConfirmVariant = () => {
    switch (type) {
      case "destructive":
        return "destructive" as const
      default:
        return "default" as const
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="pt-2">{description}</DialogDescription>
          )}
        </DialogHeader>
        {children && <div className="py-4">{children}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button variant={getConfirmVariant()} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
