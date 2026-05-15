export type UserRole = 'super_admin' | 'admin' | 'user'
export type UserStatus = 'enabled' | 'disabled'

export interface User {
  id: string
  userName: string
  account: string
  email: string
  systemRole: UserRole
  status: UserStatus
  createTime: string
}

export interface UserFilters {
  searchQuery: string
  selectedRoles: UserRole[]
  selectedStatus: UserStatus[]
  createTimeRange: { from?: Date; to?: Date } | null
}

export interface UserFormData {
  userName: string
  account: string
  email: string
  systemRole: UserRole
  status: UserStatus
}

export const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'User'
}

export const statusLabels: Record<UserStatus, string> = {
  enabled: 'Enabled',
  disabled: 'Disabled'
}

export const roleBadgeStyles: Record<UserRole, string> = {
  super_admin: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  admin: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  user: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
}

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    userName: 'John Smith',
    account: 'john.smith',
    email: 'john.smith@lenovo.com',
    systemRole: 'super_admin',
    status: 'enabled',
    createTime: '2024-01-15 09:30:00'
  },
  {
    id: '2',
    userName: 'Sarah Johnson',
    account: 'sarah.johnson',
    email: 'sarah.johnson@lenovo.com',
    systemRole: 'admin',
    status: 'enabled',
    createTime: '2024-02-20 14:15:00'
  },
  {
    id: '3',
    userName: 'Michael Chen',
    account: 'michael.chen',
    email: 'michael.chen@lenovo.com',
    systemRole: 'user',
    status: 'enabled',
    createTime: '2024-03-10 11:00:00'
  },
  {
    id: '4',
    userName: 'Emily Davis',
    account: 'emily.davis',
    email: 'emily.davis@lenovo.com',
    systemRole: 'user',
    status: 'disabled',
    createTime: '2024-03-25 16:45:00'
  },
  {
    id: '5',
    userName: 'Robert Wilson',
    account: 'robert.wilson',
    email: 'robert.wilson@lenovo.com',
    systemRole: 'admin',
    status: 'enabled',
    createTime: '2024-04-05 08:20:00'
  },
  {
    id: '6',
    userName: 'Lisa Anderson',
    account: 'lisa.anderson',
    email: 'lisa.anderson@lenovo.com',
    systemRole: 'user',
    status: 'enabled',
    createTime: '2024-04-18 13:30:00'
  },
  {
    id: '7',
    userName: 'David Brown',
    account: 'david.brown',
    email: 'david.brown@lenovo.com',
    systemRole: 'user',
    status: 'disabled',
    createTime: '2024-05-02 10:00:00'
  },
  {
    id: '8',
    userName: 'Jennifer Lee',
    account: 'jennifer.lee',
    email: 'jennifer.lee@lenovo.com',
    systemRole: 'admin',
    status: 'enabled',
    createTime: '2024-05-15 15:45:00'
  }
]
