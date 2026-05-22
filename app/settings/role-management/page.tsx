"use client"

import { useState, useCallback, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Plus, Save, X, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { RoleCard } from "./components/role-card"
import { PermissionConfig } from "./components/permission-config"
import { RoleFormDialog } from "./components/role-form-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Role,
  RoleFormData,
  RolePermission,
  RoleStatus,
  mockRoles,
  mockPermissions,
} from "./types"

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(mockRoles[0]?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<RoleStatus | "All">("All")
  const [editedPermissions, setEditedPermissions] = useState<RolePermission[] | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)

  const canEdit = true // TODO: Check user permissions

  // 根据搜索关键词和状态筛选角色
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      // 状态筛选
      if (statusFilter !== "All" && role.status !== statusFilter) {
        return false
      }
      
      // 搜索筛选
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }, [roles, searchQuery, statusFilter])

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || null
  }, [roles, selectedRoleId])

  const currentPermissions = useMemo(() => {
    return editedPermissions !== null
      ? editedPermissions
      : selectedRole?.permissions || []
  }, [editedPermissions, selectedRole])

  const hasChanges = useMemo(() => {
    if (!selectedRole || editedPermissions === null) return false
    const original = JSON.stringify(selectedRole.permissions.sort((a, b) => a.permissionId.localeCompare(b.permissionId)))
    const current = JSON.stringify(editedPermissions.sort((a, b) => a.permissionId.localeCompare(b.permissionId)))
    return original !== current
  }, [selectedRole, editedPermissions])

  const handleSelectRole = useCallback((roleId: string) => {
    setSelectedRoleId(roleId)
    setEditedPermissions(null)
  }, [])

  const handleAddRole = useCallback(() => {
    setEditingRole(null)
    setIsFormDialogOpen(true)
  }, [])

  const handleEditRole = useCallback((role: Role) => {
    setEditingRole(role)
    setIsFormDialogOpen(true)
  }, [])

  const handleDeleteRole = useCallback((role: Role) => {
    setDeletingRole(role)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!deletingRole) return
    setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id))
    if (selectedRoleId === deletingRole.id) {
      const remaining = roles.filter((r) => r.id !== deletingRole.id)
      setSelectedRoleId(remaining[0]?.id || "")
    }
    setIsDeleteDialogOpen(false)
    setDeletingRole(null)
    toast.success(`Role "${deletingRole.name}" deleted successfully`)
  }, [deletingRole, selectedRoleId, roles])

  const handleFormSubmit = useCallback(
    (formData: RoleFormData) => {
      if (editingRole) {
        setRoles((prev) =>
          prev.map((r) =>
            r.id === editingRole.id
              ? { ...r, name: formData.name, description: formData.description, status: formData.status }
              : r
          )
        )
        toast.success("Role updated successfully")
      } else {
        const newRole: Role = {
          id: String(Date.now()),
          name: formData.name,
          description: formData.description,
          userCount: 0,
          status: formData.status,
          permissions: [],
          createdAt: new Date().toISOString().split("T")[0],
        }
        setRoles((prev) => [...prev, newRole])
        setSelectedRoleId(newRole.id)
        toast.success("Role created successfully")
      }
    },
    [editingRole]
  )

  const handlePermissionsChange = useCallback((permissions: RolePermission[]) => {
    setEditedPermissions(permissions)
  }, [])

  const handleSavePermissions = useCallback(() => {
    if (!selectedRole || editedPermissions === null) return
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id ? { ...r, permissions: editedPermissions } : r
      )
    )
    setEditedPermissions(null)
    toast.success("Permissions saved successfully")
  }, [selectedRole, editedPermissions])

  const handleCancelChanges = useCallback(() => {
    setEditedPermissions(null)
    toast.info("Changes discarded")
  }, [])

  return (
    <MainLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col p-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Role Management</h1>
          {canEdit && (
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          )}
        </div>

        <Card className="flex-1 flex flex-col min-h-0 !py-0">
          <CardContent className="flex-1 flex p-0 min-h-0">
            {/* 左侧：角色列表 */}
            <div className="w-[320px] flex flex-col shrink-0">
              {/* 搜索框和状态筛选 */}
              <div className="px-6 pt-6 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as RoleStatus | "All")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <RoleCard
                        key={role.id}
                        role={role}
                        isSelected={role.id === selectedRoleId}
                        canEdit={canEdit}
                        onSelect={() => handleSelectRole(role.id)}
                        onEdit={(e) => {
                          e.stopPropagation()
                          handleEditRole(role)
                        }}
                        onDelete={(e) => {
                          e.stopPropagation()
                          handleDeleteRole(role)
                        }}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No roles found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <Separator orientation="vertical" className="h-auto" />

            {/* 右侧：权限配置 */}
            <div className="flex-1 flex flex-col min-w-0">
              {selectedRole ? (
                <>
                  {/* 权限配置头部 */}
                  <div className="pb-4 border-b shrink-0 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-medium">Permission Configuration</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure permissions for{" "}
                          <span className="font-medium text-foreground">
                            {selectedRole.name}
                          </span>
                        </p>
                        {selectedRole.isSystem && (
                          <p className="text-sm text-amber-600 mt-1">
                            Super Administrator permissions cannot be modified
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {hasChanges && canEdit && !selectedRole.isSystem && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelChanges}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={handleSavePermissions} size="sm">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 权限配置内容 */}
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <PermissionConfig
                      permissions={mockPermissions}
                      rolePermissions={currentPermissions}
                      onChange={handlePermissionsChange}
                      readOnly={!canEdit || selectedRole.isSystem}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Select a role to configure permissions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <RoleFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        role={editingRole}
        onSubmit={handleFormSubmit}
      />

      {deletingRole && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Confirm Delete"
          description={`Are you sure you want to delete the role "${deletingRole.name}"? This action cannot be undone.`}
          type="destructive"
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          children={
            deletingRole.userCount > 0 && (
              <div className="p-3 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive">
                  Warning: This role is currently assigned to {deletingRole.userCount} user{deletingRole.userCount > 1 ? 's' : ''}.
                  Deleting this role will remove it from all assigned users.
                </p>
              </div>
            )
          }
        />
      )}
    </MainLayout>
  )
}
