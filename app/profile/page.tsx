"use client"

import { useState, useRef } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2,
  Camera,
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  Users,
  UserCog,
  Building2,
  ClipboardCheck,
  MessageSquare,
  Check,
  Home,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

// Default banner gradient
const DEFAULT_BANNER = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

// Permission type matching role-management
interface Permission {
  id: string
  name: string
  code: string
  children?: Permission[]
}

// Icon mapping for permissions
const permissionIcons: Record<string, React.ElementType> = {
  'p1': Home,
  'p1-1': LayoutDashboard,
  'p1-2': Bot,
  'p1-3': BookOpen,
  'p1-4': FileText,
  'p2': Settings,
  'p2-1': Users,
  'p2-2': UserCog,
  'p2-3': Building2,
  'p2-4': ClipboardCheck,
  'p2-5': MessageSquare,
}

// Mock permissions data - same as role-management
const mockPermissions: Permission[] = [
  {
    id: 'p1',
    name: 'Workbench',
    code: 'workbench',
    children: [
      {
        id: 'p1-1',
        name: 'Dashboard',
        code: 'dashboard',
        children: [
          { id: 'p1-1-1', name: 'View', code: 'dashboard.view' },
          { id: 'p1-1-2', name: 'Export', code: 'dashboard.export' }
        ]
      },
      {
        id: 'p1-2',
        name: 'Agent Chat',
        code: 'agent_chat',
        children: [
          { id: 'p1-2-1', name: 'Send Message', code: 'agent.send' },
          { id: 'p1-2-2', name: 'View History', code: 'agent.history' },
          { id: 'p1-2-3', name: 'Clear Chat', code: 'agent.clear' }
        ]
      },
      {
        id: 'p1-3',
        name: 'Knowledge Management',
        code: 'knowledge',
        children: [
          { id: 'p1-3-1', name: 'View', code: 'knowledge.view' },
          { id: 'p1-3-2', name: 'Add', code: 'knowledge.add' },
          { id: 'p1-3-3', name: 'Edit', code: 'knowledge.edit' },
          { id: 'p1-3-4', name: 'Delete', code: 'knowledge.delete' }
        ]
      },
      {
        id: 'p1-4',
        name: 'Report Generation',
        code: 'report',
        children: [
          { id: 'p1-4-1', name: 'View', code: 'report.view' },
          { id: 'p1-4-2', name: 'Generate Report', code: 'report.generate' },
          { id: 'p1-4-3', name: 'Export', code: 'report.export' }
        ]
      }
    ]
  },
  {
    id: 'p2',
    name: 'System Management',
    code: 'system',
    children: [
      {
        id: 'p2-1',
        name: 'User Management',
        code: 'user',
        children: [
          { id: 'p2-1-1', name: 'View', code: 'user.view' },
          { id: 'p2-1-2', name: 'Add', code: 'user.add' },
          { id: 'p2-1-3', name: 'Edit', code: 'user.edit' },
          { id: 'p2-1-4', name: 'Delete', code: 'user.delete' },
          { id: 'p2-1-5', name: 'Enable/Disable', code: 'user.toggle' },
          { id: 'p2-1-6', name: 'Batch Operations', code: 'user.batch' }
        ]
      },
      {
        id: 'p2-2',
        name: 'Role Management',
        code: 'role',
        children: [
          { id: 'p2-2-1', name: 'View', code: 'role.view' },
          { id: 'p2-2-2', name: 'Add', code: 'role.add' },
          { id: 'p2-2-3', name: 'Edit', code: 'role.edit' },
          { id: 'p2-2-4', name: 'Delete', code: 'role.delete' },
          { id: 'p2-2-5', name: 'Permission Config', code: 'role.permission' }
        ]
      },
      {
        id: 'p2-3',
        name: 'Organization Management',
        code: 'organization',
        children: [
          { id: 'p2-3-1', name: 'View', code: 'org.view' },
          { id: 'p2-3-2', name: 'Add', code: 'org.add' },
          { id: 'p2-3-3', name: 'Edit', code: 'org.edit' },
          { id: 'p2-3-4', name: 'Delete', code: 'org.delete' }
        ]
      },
      {
        id: 'p2-4',
        name: 'Approval Management',
        code: 'approval',
        children: [
          { id: 'p2-4-1', name: 'View', code: 'approval.view' },
          { id: 'p2-4-2', name: 'Approve', code: 'approval.approve' },
          { id: 'p2-4-3', name: 'Reject', code: 'approval.reject' }
        ]
      },
      {
        id: 'p2-5',
        name: 'Feedback Management',
        code: 'feedback',
        children: [
          { id: 'p2-5-1', name: 'View', code: 'feedback.view' },
          { id: 'p2-5-2', name: 'Reply', code: 'feedback.reply' },
          { id: 'p2-5-3', name: 'Close', code: 'feedback.close' }
        ]
      }
    ]
  }
]

// Mock user data with role-based permissions
const mockUserData = {
  name: "Administrator",
  email: "admin@lenovo.com",
  itcode: "ADMIN001",
  role: "Super Administrator",
  joinDate: "Jan 15, 2024",
  avatar: "",
  banner: "",
  permissions: [
    { permissionId: 'p1', enabled: true },
    { permissionId: 'p1-1', enabled: true },
    { permissionId: 'p1-1-1', enabled: true },
    { permissionId: 'p1-1-2', enabled: true },
    { permissionId: 'p1-2', enabled: true },
    { permissionId: 'p1-2-1', enabled: true },
    { permissionId: 'p1-2-2', enabled: true },
    { permissionId: 'p1-2-3', enabled: true },
    { permissionId: 'p1-3', enabled: true },
    { permissionId: 'p1-3-1', enabled: true },
    { permissionId: 'p1-3-2', enabled: true },
    { permissionId: 'p1-3-3', enabled: true },
    { permissionId: 'p1-3-4', enabled: true },
    { permissionId: 'p1-4', enabled: true },
    { permissionId: 'p1-4-1', enabled: true },
    { permissionId: 'p1-4-2', enabled: true },
    { permissionId: 'p1-4-3', enabled: true },
    { permissionId: 'p2', enabled: true },
    { permissionId: 'p2-1', enabled: true },
    { permissionId: 'p2-1-1', enabled: true },
    { permissionId: 'p2-1-2', enabled: true },
    { permissionId: 'p2-1-3', enabled: true },
    { permissionId: 'p2-1-4', enabled: true },
    { permissionId: 'p2-1-5', enabled: true },
    { permissionId: 'p2-1-6', enabled: true },
    { permissionId: 'p2-2', enabled: true },
    { permissionId: 'p2-2-1', enabled: true },
    { permissionId: 'p2-2-2', enabled: true },
    { permissionId: 'p2-2-3', enabled: true },
    { permissionId: 'p2-2-4', enabled: true },
    { permissionId: 'p2-2-5', enabled: true },
    { permissionId: 'p2-3', enabled: true },
    { permissionId: 'p2-3-1', enabled: true },
    { permissionId: 'p2-3-2', enabled: true },
    { permissionId: 'p2-3-3', enabled: true },
    { permissionId: 'p2-3-4', enabled: true },
    { permissionId: 'p2-4', enabled: true },
    { permissionId: 'p2-4-1', enabled: true },
    { permissionId: 'p2-4-2', enabled: true },
    { permissionId: 'p2-4-3', enabled: true },
    { permissionId: 'p2-5', enabled: true },
    { permissionId: 'p2-5-1', enabled: true },
    { permissionId: 'p2-5-2', enabled: true },
    { permissionId: 'p2-5-3', enabled: true },
  ],
  lastLogin: "2 hours ago",
  status: "active" as const,
}

// Check if permission is enabled
function isPermissionEnabled(permissionId: string, userPermissions: { permissionId: string; enabled: boolean }[]): boolean {
  return userPermissions.some(p => p.permissionId === permissionId && p.enabled)
}

// Permission Module Card Component
function PermissionModuleCard({ 
  module, 
  userPermissions 
}: { 
  module: Permission
  userPermissions: { permissionId: string; enabled: boolean }[]
}) {
  const Icon = permissionIcons[module.id] || CheckCircle2
  const isEnabled = isPermissionEnabled(module.id, userPermissions)
  
  // Filter to only show enabled sub-modules
  const enabledSubModules = module.children?.filter(sub => 
    isPermissionEnabled(sub.id, userPermissions)
  ) || []
  
  if (enabledSubModules.length === 0) return null

  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
      {/* Module Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">{module.name}</span>
      </div>
      
      {/* Sub-modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {enabledSubModules.map(subModule => {
          const subEnabled = isPermissionEnabled(subModule.id, userPermissions)
          const enabledActions = subModule.children?.filter(action => 
            isPermissionEnabled(action.id, userPermissions)
          ) || []
          
          return (
            <div 
              key={subModule.id} 
              className="bg-background rounded-md p-3 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-foreground">{subModule.name}</span>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-1.5">
                {enabledActions.map(action => (
                  <Badge
                    key={action.id}
                    variant="outline"
                    className="px-2 py-0.5 text-[10px] font-normal rounded bg-primary/5 text-primary/80 border-primary/20"
                  >
                    {action.name}
                  </Badge>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Permissions Display Component (Scheme D - Hybrid Mode)
function PermissionsDisplay({ 
  permissions, 
  userPermissions 
}: { 
  permissions: Permission[]
  userPermissions: { permissionId: string; enabled: boolean }[]
}) {
  return (
    <div className="space-y-6">
      {permissions.map(category => {
        const isEnabled = isPermissionEnabled(category.id, userPermissions)
        const CategoryIcon = permissionIcons[category.id] || CheckCircle2
        
        // Skip if category is not enabled
        if (!isEnabled) return null
        
        return (
          <div key={category.id} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-border/30">
              <CategoryIcon className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">{category.name}</h3>
            </div>
            
            {/* Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.children?.map(module => (
                <PermissionModuleCard
                  key={module.id}
                  module={module}
                  userPermissions={userPermissions}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState(mockUserData)
  const [editedData, setEditedData] = useState(mockUserData)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    setUserData(editedData)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData({ ...editedData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData({ ...editedData, banner: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const getAvatarUrl = () => {
    if (isEditing && editedData.avatar) return editedData.avatar
    if (userData.avatar) return userData.avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.itcode}`
  }

  const getBannerStyle = () => {
    const bannerUrl = isEditing ? editedData.banner || userData.banner : userData.banner
    if (bannerUrl) {
      return { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    return { background: DEFAULT_BANNER }
  }

  const InfoField = ({ 
    icon: Icon, 
    label, 
    value, 
    editable = false,
    fieldKey
  }: { 
    icon: React.ElementType
    label: string
    value: string
    editable?: boolean
    fieldKey?: keyof typeof editedData
  }) => (
    <div className="group space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Label>
      {isEditing && editable && fieldKey ? (
        <Input
          value={editedData[fieldKey] as string}
          onChange={(e) => setEditedData({ ...editedData, [fieldKey]: e.target.value })}
          className="h-9 rounded-md transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm font-medium py-1.5",
            editable && "group-hover:text-primary transition-colors duration-200"
          )}>
            {value}
          </p>
          {editable && !isEditing && (
            <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </div>
      )}
    </div>
  )

  return (
    <MainLayout className="p-6 lg:p-8 overflow-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your personal information and account settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline" 
                className="gap-2 h-10 px-4 rounded-lg transition-all duration-200 hover:bg-muted"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleCancel} 
                  variant="outline" 
                  className="gap-2 h-10 px-4 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="gap-2 h-10 px-4 rounded-lg transition-all duration-200"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Profile Card */}
        <Card className="rounded-xl overflow-hidden border-border/50 shadow-sm py-0">
          {/* Profile Banner */}
          <div 
            className="h-40 relative group"
            style={getBannerStyle()}
          >
            {isEditing && (
              <>
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Camera className="h-8 w-8" />
                    <span className="text-sm font-medium">Change Banner</span>
                  </div>
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </>
            )}
          </div>
          
          <CardContent className="px-8">
            <div className="flex flex-col md:flex-row gap-8 -mt-16">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-white">
                    <img 
                      src={getAvatarUrl()} 
                      alt={userData.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      >
                        <Camera className="h-8 w-8 text-white" />
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <div className="text-center">
                  <Badge 
                    variant={userData.status === "active" ? "default" : "secondary"}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      {userData.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </Badge>
                </div>
              </div>

              {/* Info Grid - 4 fields only (removed IT Code and Department) */}
              <div className="flex-1 pt-6 md:pt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoField 
                    icon={User} 
                    label="Full Name" 
                    value={userData.name}
                    editable
                    fieldKey="name"
                  />
                  <InfoField 
                    icon={Mail} 
                    label="Email Address" 
                    value={userData.email}
                    editable
                    fieldKey="email"
                  />
                  <InfoField 
                    icon={Shield} 
                    label="Role" 
                    value={userData.role}
                  />
                  <InfoField 
                    icon={Calendar} 
                    label="Member Since" 
                    value={userData.joinDate}
                  />
                </div>

                {/* Last Login Info */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Last login: <span className="text-foreground font-medium">{userData.lastLogin}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card - Full Width with Hybrid Mode */}
        <Card className="rounded-xl border-border/50 shadow-sm py-0">
          <CardHeader className="px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Permissions</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Your system access and capabilities based on role
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <PermissionsDisplay 
              permissions={mockPermissions} 
              userPermissions={userData.permissions}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
