"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Role, RoleFormData, RoleStatus } from "../types"

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSubmit: (formData: RoleFormData) => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
}: RoleFormDialogProps) {
  const isEditing = !!role
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    status: "Active",
  })

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        status: role.status,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        status: "Active",
      })
    }
  }, [role, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        status: "Active",
      })
    }
    onOpenChange(open)
  }

  const handleStatusChange = (status: RoleStatus) => {
    setFormData((prev) => ({ ...prev, status }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Add Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Role Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter role name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter role description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={(e) => handleStatusChange(e.target.value as RoleStatus)}
                  className="w-4 h-4 text-primary border-input focus:ring-primary"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={(e) => handleStatusChange(e.target.value as RoleStatus)}
                  className="w-4 h-4 text-primary border-input focus:ring-primary"
                />
                <span className="text-sm">Inactive</span>
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
