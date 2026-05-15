"use client"

import { useState } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Users, Pencil, Trash2 } from "lucide-react"
import { Role } from "../types"

interface RoleCardProps {
  role: Role
  isSelected: boolean
  canEdit: boolean
  onSelect: () => void
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}

export function RoleCard({
  role,
  isSelected,
  canEdit,
  onSelect,
  onEdit,
  onDelete,
}: RoleCardProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <Card
      size="sm"
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md relative !py-0 !gap-0 rounded-lg",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-xl"
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-4 relative">
        {/* Hover 显示操作按钮 */}
        {canEdit && !role.isSystem && showActions && (
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        <div className="flex items-start">
          {/* 内容区域 */}
          <div className="min-w-0 flex-1">
            {/* 角色名称 + 系统标签 + 状态 */}
            <div className="flex items-center gap-2 flex-wrap">
              <TooltipProvider delay={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <CardTitle className="text-sm font-medium !text-base cursor-help">
                      {role.name}
                    </CardTitle>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[250px]">
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-white">{role.description}</p>
                      <p className="text-xs text-white/70">Created: {role.createdAt}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {role.isSystem && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  System
                </Badge>
              )}
              {!role.isSystem && (
                <Badge
                  variant={role.status === 'Active' ? 'default' : 'secondary'}
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4",
                    role.status === 'Active' 
                      ? "bg-green-100 text-green-700 hover:bg-green-100" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {role.status}
                </Badge>
              )}
            </div>

            {/* 用户数量 */}
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{role.userCount} users</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
