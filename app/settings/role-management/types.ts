export interface Permission {
  id: string
  name: string
  code: string
  children?: Permission[]
}

export interface RolePermission {
  permissionId: string
  enabled: boolean
}

export type RoleStatus = 'Active' | 'Inactive'

export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  isSystem?: boolean
  status: RoleStatus
  permissions: RolePermission[]
  createdAt: string
}

export interface RoleFormData {
  name: string
  description: string
  status: RoleStatus
}

// Mock permissions data - all in English
export const mockPermissions: Permission[] = [
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

// Helper function to get all permission IDs
function getAllPermissionIds(permissions: Permission[]): string[] {
  const ids: string[] = []
  for (const p of permissions) {
    ids.push(p.id)
    if (p.children) {
      ids.push(...getAllPermissionIds(p.children))
    }
  }
  return ids
}

// Mock roles data - updated with specified roles
export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    userCount: 2,
    isSystem: true,
    status: 'Active',
    permissions: getAllPermissionIds(mockPermissions).map(id => ({ permissionId: id, enabled: true })),
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'SPE Manager',
    description: 'Manage FRU BOM and component data',
    userCount: 5,
    isSystem: false,
    status: 'Active',
    permissions: [
      { permissionId: 'p1', enabled: true },
      { permissionId: 'p1-1', enabled: true },
      { permissionId: 'p1-1-1', enabled: true },
      { permissionId: 'p1-1-2', enabled: true },
      { permissionId: 'p1-2', enabled: true },
      { permissionId: 'p1-2-1', enabled: true },
      { permissionId: 'p1-2-2', enabled: true },
      { permissionId: 'p1-3', enabled: true },
      { permissionId: 'p1-3-1', enabled: true },
      { permissionId: 'p1-3-2', enabled: true },
      { permissionId: 'p1-3-3', enabled: true },
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
      { permissionId: 'p2-3', enabled: true },
      { permissionId: 'p2-3-1', enabled: true },
      { permissionId: 'p2-3-2', enabled: true },
      { permissionId: 'p2-3-3', enabled: true },
      { permissionId: 'p2-4', enabled: true },
      { permissionId: 'p2-4-1', enabled: true },
      { permissionId: 'p2-5', enabled: true },
      { permissionId: 'p2-5-1', enabled: true },
      { permissionId: 'p2-5-2', enabled: true }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Procurement Manager',
    description: 'Manage procurement and BOM data',
    userCount: 8,
    status: 'Active',
    permissions: [
      { permissionId: 'p1', enabled: true },
      { permissionId: 'p1-1', enabled: true },
      { permissionId: 'p1-1-1', enabled: true },
      { permissionId: 'p1-1-2', enabled: true },
      { permissionId: 'p1-2', enabled: true },
      { permissionId: 'p1-2-1', enabled: true },
      { permissionId: 'p1-2-2', enabled: true },
      { permissionId: 'p1-3', enabled: true },
      { permissionId: 'p1-3-1', enabled: true },
      { permissionId: 'p1-3-2', enabled: true },
      { permissionId: 'p1-3-3', enabled: true },
      { permissionId: 'p1-4', enabled: true },
      { permissionId: 'p1-4-1', enabled: true },
      { permissionId: 'p1-4-2', enabled: true },
      { permissionId: 'p1-4-3', enabled: true },
      { permissionId: 'p2', enabled: true },
      { permissionId: 'p2-1', enabled: true },
      { permissionId: 'p2-1-1', enabled: true },
      { permissionId: 'p2-2', enabled: true },
      { permissionId: 'p2-2-1', enabled: true },
      { permissionId: 'p2-3', enabled: true },
      { permissionId: 'p2-3-1', enabled: true },
      { permissionId: 'p2-4', enabled: true },
      { permissionId: 'p2-4-1', enabled: true },
      { permissionId: 'p2-5', enabled: true },
      { permissionId: 'p2-5-1', enabled: true }
    ],
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Data Entry Specialist',
    description: 'Data entry and basic view access',
    userCount: 12,
    status: 'Inactive',
    permissions: [
      { permissionId: 'p1', enabled: true },
      { permissionId: 'p1-1', enabled: true },
      { permissionId: 'p1-1-1', enabled: true },
      { permissionId: 'p1-2', enabled: true },
      { permissionId: 'p1-2-1', enabled: true },
      { permissionId: 'p1-3', enabled: true },
      { permissionId: 'p1-3-1', enabled: true },
      { permissionId: 'p1-4', enabled: true },
      { permissionId: 'p1-4-1', enabled: true },
      { permissionId: 'p2', enabled: true },
      { permissionId: 'p2-1', enabled: true },
      { permissionId: 'p2-1-1', enabled: true },
      { permissionId: 'p2-2', enabled: true },
      { permissionId: 'p2-2-1', enabled: true },
      { permissionId: 'p2-3', enabled: true },
      { permissionId: 'p2-3-1', enabled: true },
      { permissionId: 'p2-4', enabled: true },
      { permissionId: 'p2-4-1', enabled: true },
      { permissionId: 'p2-5', enabled: true },
      { permissionId: 'p2-5-1', enabled: true }
    ],
    createdAt: '2024-02-20'
  }
]
