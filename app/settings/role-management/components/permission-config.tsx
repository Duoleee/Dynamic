"use client"

import { useState, useCallback, useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronDown } from "lucide-react"
import { Permission, RolePermission } from "../types"

interface PermissionConfigProps {
  permissions: Permission[]
  rolePermissions: RolePermission[]
  onChange: (permissions: RolePermission[]) => void
  readOnly?: boolean
}

interface PermissionNodeProps {
  permission: Permission
  rolePermissions: RolePermission[]
  onToggle: (permissionId: string, enabled: boolean) => void
  level?: number
  readOnly?: boolean
}

// Get all descendant permission IDs (including the permission itself)
function getAllDescendantIds(permission: Permission): string[] {
  const ids: string[] = [permission.id]
  if (permission.children) {
    for (const child of permission.children) {
      ids.push(...getAllDescendantIds(child))
    }
  }
  return ids
}

// Get all permission IDs at a level
function getAllIds(permissions: Permission[]): string[] {
  const ids: string[] = []
  for (const p of permissions) {
    ids.push(...getAllDescendantIds(p))
  }
  return ids
}

// Check if a permission is enabled
function isPermissionEnabled(
  permissionId: string,
  rolePermissions: RolePermission[]
): boolean {
  return rolePermissions.some((p) => p.permissionId === permissionId && p.enabled)
}

// Get checkbox state: 'checked' | 'unchecked'
// Removed indeterminate state - now only returns checked or unchecked
function getCheckboxState(
  permission: Permission,
  rolePermissions: RolePermission[]
): 'checked' | 'unchecked' {
  const allIds = getAllDescendantIds(permission)
  const enabledCount = allIds.filter((id) =>
    isPermissionEnabled(id, rolePermissions)
  ).length

  // Only return checked if ALL children are checked
  if (enabledCount === allIds.length) return 'checked'
  return 'unchecked'
}

function PermissionNode({
  permission,
  rolePermissions,
  onToggle,
  level = 0,
  readOnly = false,
}: PermissionNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const checkboxState = useMemo(
    () => getCheckboxState(permission, rolePermissions),
    [permission, rolePermissions]
  )

  const isEnabled = checkboxState === 'checked'
  const hasChildren = permission.children && permission.children.length > 0

  const handleToggle = (checked: boolean) => {
    if (readOnly) return
    onToggle(permission.id, checked)
  }

  // Level 0: Main category (Workbench, System Management) - purple background when checked
  // Level 1: Sub category (Dashboard, User Management) - white background
  // Level 2: Actions (View, Export) - checkbox tags

  if (level === 0) {
    // Root level - Main categories
    return (
      <div className="mb-4">
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg transition-colors",
            isEnabled ? "bg-primary/10" : "bg-muted/30"
          )}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 p-1 hover:bg-black/5 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <Checkbox
            id={permission.id}
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={readOnly}
          />
          <label
            htmlFor={permission.id}
            className={cn(
              "text-sm font-medium cursor-pointer select-none",
              isEnabled ? "text-primary" : "text-foreground"
            )}
          >
            {permission.name}
          </label>
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-2 space-y-2">
            {permission.children!.map((child) => (
              <PermissionNode
                key={child.id}
                permission={child}
                rolePermissions={rolePermissions}
                onToggle={onToggle}
                level={level + 1}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (level === 1) {
    // Second level - Sub categories
    return (
      <div className="ml-8">
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 p-1 hover:bg-black/5 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <Checkbox
            id={permission.id}
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={readOnly}
          />
          <label
            htmlFor={permission.id}
            className="text-sm cursor-pointer select-none"
          >
            {permission.name}
          </label>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-8 mt-2 flex flex-wrap gap-3">
            {permission.children!.map((child) => (
              <PermissionNode
                key={child.id}
                permission={child}
                rolePermissions={rolePermissions}
                onToggle={onToggle}
                level={level + 1}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Level 2+ - Leaf nodes (checkbox tags)
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors",
        isEnabled
          ? "bg-primary/5 border-primary/20"
          : "bg-background border-border hover:border-muted-foreground/30"
      )}
    >
      <Checkbox
        id={permission.id}
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={readOnly}
        className="shrink-0"
      />
      <label
        htmlFor={permission.id}
        className="text-sm cursor-pointer select-none whitespace-nowrap"
      >
        {permission.name}
      </label>
    </div>
  )
}

export function PermissionConfig({
  permissions,
  rolePermissions,
  onChange,
  readOnly = false,
}: PermissionConfigProps) {
  // Helper to get all descendant IDs including self
  const getAllIdsRecursive = useCallback((permission: Permission): string[] => {
    const ids: string[] = [permission.id]
    if (permission.children) {
      for (const child of permission.children) {
        ids.push(...getAllIdsRecursive(child))
      }
    }
    return ids
  }, [])

  // Helper to find permission by ID in the tree
  const findPermissionById = useCallback(
    (id: string, perms: Permission[] = permissions): Permission | null => {
      for (const p of perms) {
        if (p.id === id) return p
        if (p.children) {
          const found = findPermissionById(id, p.children)
          if (found) return found
        }
      }
      return null
    },
    [permissions]
  )

  const handleToggle = useCallback(
    (permissionId: string, enabled: boolean) => {
      const newPermissions = [...rolePermissions]
      const permission = findPermissionById(permissionId)

      if (!permission) return

      // Get all IDs that need to be updated (the permission and all its descendants)
      const allIdsToUpdate = getAllIdsRecursive(permission)

      // Update all related permissions
      for (const id of allIdsToUpdate) {
        const index = newPermissions.findIndex((p) => p.permissionId === id)
        if (index >= 0) {
          newPermissions[index] = { permissionId: id, enabled }
        } else {
          newPermissions.push({ permissionId: id, enabled })
        }
      }

      onChange(newPermissions)
    },
    [rolePermissions, onChange, findPermissionById, getAllIdsRecursive]
  )

  return (
    <div className="h-full overflow-auto px-6 py-4">
      <div className="space-y-2">
        {permissions.map((permission) => (
          <PermissionNode
            key={permission.id}
            permission={permission}
            rolePermissions={rolePermissions}
            onToggle={handleToggle}
            level={0}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
}
