'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopNavbar } from '@/components/top-navbar'
import { ErpAppHeader } from '@/components/erp-app-header'
import { ModulePastEntriesFab } from '@/components/module-past-entries-fab'
import { AiPane } from '@/components/ai-pane/AiPane'
import { MeSync } from '@/components/me-sync'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { canViewPath } from '@/lib/erp-module-access'
import { canViewPathWithPackage } from '@/lib/package-module-access'
import { useLayoutPreference } from '@/hooks/use-layout-preference'
import { useAiPane } from '@/contexts/AiPaneContext'

const SIDEBAR_KEY = 'daxor:sidebar:collapsed'

function useRoleRedirects(user: ReturnType<typeof useAuth>['user'], hydrated: boolean) {
  const router = useRouter()
  const pathname = usePathname() ?? ''

  useEffect(() => {
    if (!hydrated || !user) return
    const roles = user.roles ?? []
    const isPlatform = roles.includes('SUPER_ADMIN') || roles.includes('ERP_ADMIN')
    const isOrgAdmin = roles.includes('ORG_ADMIN')

    if (pathname.startsWith('/admin')) {
      if (!isPlatform) {
        router.replace(isOrgAdmin ? '/org-admin/dashboard' : '/dashboard')
      }
      return
    }
    if (pathname.startsWith('/org-admin')) {
      if (!isOrgAdmin && !isPlatform) {
        router.replace('/dashboard')
      }
    }
  }, [hydrated, user, pathname, router])
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const [hydrated, setHydrated] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [layout] = useLayoutPreference()
  const { isOpen: aiOpen } = useAiPane()

  useEffect(() => {
    setHydrated(true)
    try {
      const raw = localStorage.getItem(SIDEBAR_KEY)
      if (raw === '1') setCollapsed(true)
    } catch { /* localStorage unavailable */ }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0')
    } catch { /* localStorage write blocked */ }
  }, [collapsed, hydrated])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/login')
  }, [hydrated, isAuthenticated, router])

  useRoleRedirects(user, hydrated)

  useEffect(() => {
    if (!hydrated || !user) return
    const path = pathname ?? ''
    if (path.startsWith('/admin') || path.startsWith('/org-admin')) return
    if (!canViewPath(path, user.modulePermissions, user.roles)) {
      router.replace('/dashboard')
      return
    }
    if (!canViewPathWithPackage(path, user.packageEnabledModules, user.roles)) {
      router.replace('/dashboard')
    }
  }, [hydrated, user, pathname, router])

  if (!hydrated || !isAuthenticated) return null

  const hideMainChrome =
    pathname.startsWith('/admin') || pathname.startsWith('/org-admin')

  if (hideMainChrome) {
    return (
      <div className="flex h-screen bg-background">
        <MeSync />
        <main className="flex flex-1 min-h-0 min-w-0 flex-col overflow-auto">{children}</main>
      </div>
    )
  }

  // ─── Navbar layout ───────────────────────────────────────────────
  if (layout === 'navbar') {
    return (
      <div className="flex h-screen flex-col bg-background relative overflow-hidden">
        <MeSync />
        <ErpAppHeader onMenuClick={() => setMobileOpen(true)} />
        <div className="hidden md:block">
          <TopNavbar />
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-72 border-none">
            <Sidebar mobile onMobileClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden bg-secondary/30 min-h-0 relative transition-[padding] duration-300 ease-in-out",
          aiOpen && "pr-80"
        )}>
          {children}
          <ModulePastEntriesFab />
        </main>
        <AiPane />
      </div>
    )
  }

  // ─── Sidebar layout (default) ────────────────────────────────────
  return (
    <div className="flex h-screen bg-background">
      <MeSync />
      <div className="hidden lg:block shrink-0">
        <Sidebar collapsed={collapsed} onCollapseToggle={() => setCollapsed((v) => !v)} />
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-none">
          <Sidebar mobile onMobileClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <main className={cn(
        "flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden bg-secondary/30 relative transition-[padding] duration-300 ease-in-out",
        aiOpen && "pr-80"
      )}>
        <ErpAppHeader onMenuClick={() => setMobileOpen(true)} />
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          {children}
          <ModulePastEntriesFab />
        </div>
        <AiPane />
      </main>
    </div>
  )
}
