"use client"

import { useState, useMemo, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw, Power, PowerOff, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { UserTable } from "./components/user-table"
import { BatchActions } from "@/components/ui/batch-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { UserFormDialog } from "./components/user-form-dialog"
import { User, UserFormData, UserRole, UserStatus, mockUsers } from "./types"
import { roleLabels, statusLabels } from "./types"
import { Input } from "@/components/ui/input"
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

const roleOptions: MultiSelectOption[] = [
  { value: "super_admin", label: roleLabels.super_admin },
  { value: "admin", label: roleLabels.admin },
  { value: "user", label: roleLabels.user },
]

const statusOptions: MultiSelectOption[] = [
  { value: "enabled", label: statusLabels.enabled },
  { value: "disabled", label: statusLabels.disabled },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [selectedStatus, setSelectedStatus] = useState<UserStatus[]>([])
  const [createTimeRange, setCreateTimeRange] = useState<DateRange | undefined>(undefined)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUsers, setDeletingUsers] = useState<User[]>([])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search: User Name and Account
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          user.userName.toLowerCase().includes(query) ||
          user.account.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Filter: Roles
      if (selectedRoles.length > 0 && !selectedRoles.includes(user.systemRole)) {
        return false
      }

      // Filter: Status
      if (selectedStatus.length > 0 && !selectedStatus.includes(user.status)) {
        return false
      }

      // Filter: Create Time Range
      if (createTimeRange?.from) {
        const userDate = new Date(user.createTime)
        const fromDate = new Date(createTimeRange.from)
        fromDate.setHours(0, 0, 0, 0)
        
        if (userDate < fromDate) return false
        
        if (createTimeRange.to) {
          const toDate = new Date(createTimeRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (userDate > toDate) return false
        }
      }

      return true
    })
  }, [users, searchQuery, selectedRoles, selectedStatus, createTimeRange])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredUsers.slice(start, end)
  }, [filteredUsers, currentPage, pageSize])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const handleSelectRow = useCallback((userId: string, selected: boolean) => {
    setSelectedRows((prev) =>
      selected ? [...prev, userId] : prev.filter((id) => id !== userId)
    )
  }, [])

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedRows(selected ? paginatedUsers.map((user) => user.id) : [])
  }, [paginatedUsers])

  const handleResetFilters = useCallback(() => {
    setSearchQuery("")
    setSelectedRoles([])
    setSelectedStatus([])
    setCreateTimeRange(undefined)
    setCurrentPage(1)
  }, [])

  const handleAddUser = useCallback(() => {
    setEditingUser(null)
    setIsFormDialogOpen(true)
  }, [])

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user)
    setIsFormDialogOpen(true)
  }, [])

  const handleDeleteUser = useCallback((user: User) => {
    setDeletingUsers([user])
    setIsDeleteDialogOpen(true)
  }, [])

  const handleBatchDelete = useCallback(() => {
    const usersToDelete = users.filter((user) => selectedRows.includes(user.id))
    setDeletingUsers(usersToDelete)
    setIsDeleteDialogOpen(true)
  }, [users, selectedRows])

  const handleConfirmDelete = useCallback(() => {
    const deletingIds = deletingUsers.map((user) => user.id)
    setUsers((prev) => prev.filter((user) => !deletingIds.includes(user.id)))
    setSelectedRows((prev) => prev.filter((id) => !deletingIds.includes(id)))
    setIsDeleteDialogOpen(false)
    setDeletingUsers([])
    toast.success(`Successfully deleted ${deletingIds.length} user(s)`)
  }, [deletingUsers])

  const handleFormSubmit = useCallback(
    (formData: UserFormData) => {
      if (editingUser) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id
              ? {
                  ...user,
                  userName: formData.userName,
                  account: formData.account,
                  email: formData.email,
                  systemRole: formData.systemRole,
                  status: formData.status,
                }
              : user
          )
        )
        toast.success("User updated successfully")
      } else {
        const newUser: User = {
          id: String(Date.now()),
          userName: formData.userName,
          account: formData.account,
          email: formData.email,
          systemRole: formData.systemRole,
          status: formData.status,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        }
        setUsers((prev) => [newUser, ...prev])
        toast.success("User created successfully")
      }
    },
    [editingUser]
  )

  const handleBatchEnable = useCallback(() => {
    setUsers((prev) =>
      prev.map((user) =>
        selectedRows.includes(user.id) ? { ...user, status: "enabled" as const } : user
      )
    )
    toast.success(`Successfully enabled ${selectedRows.length} user(s)`)
  }, [selectedRows])

  const handleBatchDisable = useCallback(() => {
    setUsers((prev) =>
      prev.map((user) =>
        selectedRows.includes(user.id) ? { ...user, status: "disabled" as const } : user
      )
    )
    toast.success(`Successfully disabled ${selectedRows.length} user(s)`)
  }, [selectedRows])

  // Check if any filter is active
  const hasActiveFilters = searchQuery || 
    selectedRoles.length > 0 || 
    selectedStatus.length > 0 || 
    createTimeRange?.from

  return (
    <MainLayout>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">User Management</h1>
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filter Panel */}
        <div>
          <div className="flex items-start gap-3">
            {/* Default Filters - Always Visible */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search - User Name and Account */}
              <Input
                placeholder="Search User Name or Account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />

              {/* Role - MultiSelect */}
              <MultiSelect
                options={roleOptions}
                selected={selectedRoles}
                onChange={(values) => setSelectedRoles(values as UserRole[])}
                placeholder="Roles"
                showSearch={false}
              />

              {/* Status - MultiSelect */}
              <MultiSelect
                options={statusOptions}
                selected={selectedStatus}
                onChange={(values) => setSelectedStatus(values as UserStatus[])}
                placeholder="Status"
                showSearch={false}
              />

              {/* Create Time - Date Range Picker */}
              <DateRangePicker
                value={createTimeRange}
                onChange={setCreateTimeRange}
                placeholder="Create Time"
              />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetFilters}
                className="h-10 w-10 shrink-0 text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <BatchActions
          selectedCount={selectedRows.length}
          label="selected"
          className="pb-4"
          actions={[
            {
              key: "enable",
              label: "Enable",
              icon: <Power className="h-3.5 w-3.5 mr-1.5" />,
              onClick: handleBatchEnable,
            },
            {
              key: "disable",
              label: "Disable",
              icon: <PowerOff className="h-3.5 w-3.5 mr-1.5" />,
              onClick: handleBatchDisable,
            },
            {
              key: "delete",
              label: "Delete",
              icon: <Trash2 className="h-3.5 w-3.5 mr-1.5" />,
              onClick: handleBatchDelete,
              variant: "outline",
              className: "text-red-600 hover:text-red-700 hover:bg-red-50",
            },
          ]}
        />

        <UserTable
          users={paginatedUsers}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} records in total
          </div>
          <div className="flex items-center gap-4">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-8 px-2 rounded-md border border-input bg-transparent text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm px-2">
                Page {currentPage} of {totalPages || 1}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UserFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        user={editingUser}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirm Delete"
        description="Are you sure you want to delete the following user(s)? This action cannot be undone."
        type="destructive"
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        children={
          <div className="max-h-32 overflow-y-auto rounded-md bg-muted p-3">
            <ul className="space-y-1">
              {deletingUsers.map((user) => (
                <li key={user.id} className="text-sm font-medium">
                  {user.userName}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </MainLayout>
  )
}
