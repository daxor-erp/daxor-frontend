import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  Activity,
  Settings,
  Zap,
  Megaphone,
  Package,
  type LucideIcon,
} from 'lucide-react'

export const ADMIN_ACCENT = '#378ADD'

export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

/** Platform admin navigation — shared by layout sidebar and welcome apps grid. */
export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { href: '/admin/sub-tenants', label: 'Sub-tenants', icon: Building },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/notifications', label: 'Send notification', icon: Megaphone },
  { href: '/admin/audit-log', label: 'Audit log', icon: Activity },
  { href: '/admin/api-tester', label: 'API tester', icon: Zap },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export const ADMIN_APP_ACCENTS = [
  '#378ADD',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
]

export function isAdminWelcomePath(pathname: string): boolean {
  return pathname === '/admin/welcome' || pathname.startsWith('/admin/welcome/')
}
