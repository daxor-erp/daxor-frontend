'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Building2, LayoutDashboard, CheckSquare, Users, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/org-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/org-admin/users', label: 'Users', icon: Users },
  { href: '/org-admin/roles-permissions', label: 'Roles & permissions', icon: Shield },
  { href: '/org-admin/approvals', label: 'Approvals', icon: CheckSquare },
]

export default function OrgAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-600 p-2 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Tenant</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">Organization admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-teal-50 text-teal-900 font-medium border border-teal-100'
                    : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-teal-700 opacity-90" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          Signed in as{' '}
          <span className="font-medium text-slate-800">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b bg-white px-6 py-3 flex items-center justify-end shrink-0 z-10">
          <Button variant="outline" size="sm" onClick={() => logout()} className="gap-1">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
