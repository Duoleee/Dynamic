"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "../types"
import { roleLabels, statusLabels, roleBadgeStyles } from "../types"

interface UserTableProps {
  users: User[]
  selectedRows: string[]
  onSelectRow: (userId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTable({
  users,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
}: UserTableProps) {
  const allSelected = users.length > 0 && users.every((user) => selectedRows.includes(user.id))
  const someSelected = users.some((user) => selectedRows.includes(user.id)) && !allSelected

  return (
    <TooltipProvider>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-10 px-4">
                <Checkbox
                  checked={allSelected}
                  data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-32 px-4">User Name</TableHead>
              <TableHead className="w-32 px-4">Account</TableHead>
              <TableHead className="w-48 px-4">Email</TableHead>
              <TableHead className="w-28 px-4">System Role</TableHead>
              <TableHead className="w-24 px-4">Status</TableHead>
              <TableHead className="w-36 px-4">Create Time</TableHead>
              <TableHead className="w-24 px-4 text-right sticky right-0 bg-muted/50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelected = selectedRows.includes(user.id)

                return (
                  <TableRow
                    key={user.id}
                    data-state={isSelected ? "selected" : undefined}
                    className="h-12"
                  >
                    <TableCell className="px-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          onSelectRow(user.id, checked as boolean)
                        }
                        aria-label={`Select ${user.userName}`}
                      />
                    </TableCell>
                    <TableCell className="px-4">
                      <span className="font-medium">{user.userName}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <span className="text-muted-foreground font-mono text-sm">{user.account}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <span className="text-muted-foreground">{user.email}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", roleBadgeStyles[user.systemRole])}
                      >
                        {roleLabels[user.systemRole]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            user.status === "enabled"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          )}
                        />
                        <span className="text-sm">{statusLabels[user.status]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 font-mono text-sm">
                      {user.createTime}
                    </TableCell>
                    <TableCell className="px-4 sticky right-0 bg-card border-l">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(user)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onDelete(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
