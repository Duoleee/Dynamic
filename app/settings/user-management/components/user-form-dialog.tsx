"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, UserFormData, UserRole, UserStatus } from "../types"
import { roleLabels, statusLabels } from "../types"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSubmit: (formData: UserFormData) => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    userName: "",
    account: "",
    email: "",
    systemRole: "user",
    status: "enabled",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName,
        account: user.account,
        email: user.email,
        systemRole: user.systemRole,
        status: user.status,
      })
    } else {
      setFormData({
        userName: "",
        account: "",
        email: "",
        systemRole: "user",
        status: "enabled",
      })
    }
    setErrors({})
  }, [user, open])

  // Extract account and userName from email when email changes (only for new users)
  const handleEmailChange = (email: string) => {
    if (!user) {
      const atIndex = email.indexOf('@')
      const prefix = atIndex > 0 ? email.substring(0, atIndex) : email
      setFormData((prev) => ({
        ...prev,
        email,
        account: prefix,
        userName: prefix,
      }))
    } else {
      setFormData((prev) => ({ ...prev, email }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.account.trim()) {
      newErrors.account = "Account is required"
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.account)) {
      newErrors.account = "Account can only contain letters, numbers, underscores and hyphens"
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "User Name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Email - First */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Account and User Name - Same Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="account">
                Account <span className="text-red-500">*</span>
              </Label>
              <Input
                id="account"
                value={formData.account}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, account: e.target.value }))
                }
                placeholder="Enter account"
                disabled={true}
                className="bg-muted"
              />
              {errors.account && (
                <p className="text-sm text-red-500">{errors.account}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">
                User Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, userName: e.target.value }))
                }
                placeholder="Enter user name"
              />
              {errors.userName && (
                <p className="text-sm text-red-500">{errors.userName}</p>
              )}
            </div>
          </div>

          {/* System Role and Status - Same Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="systemRole">
                System Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.systemRole}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, systemRole: value as UserRole }))
                }
              >
                <SelectTrigger id="systemRole" className="w-full">
                  <SelectValue placeholder="Select system role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">{roleLabels.super_admin}</SelectItem>
                  <SelectItem value="admin">{roleLabels.admin}</SelectItem>
                  <SelectItem value="user">{roleLabels.user}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as UserStatus }))
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">{statusLabels.enabled}</SelectItem>
                  <SelectItem value="disabled">{statusLabels.disabled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{user ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
