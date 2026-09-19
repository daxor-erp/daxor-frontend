'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModulePastEntriesFab } from '@/components/module-past-entries-fab'
import { AiPane } from '@/components/ai-pane/AiPane'
import { MeSync } from '@/components/me-sync'
import { ModuleWorkspaceChrome } from '@/components/welcome/module-workspace-chrome'
import { cn } from '@/lib/utils'
import { canViewPath } from '@/lib/erp-module-access'
import { canViewPathWithPackage } from '@/lib/package-module-access'
import { useAiPane } from '@/contexts/AiPaneContext'
import { isWelcomePath } from '@/lib/welcome-apps'

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
        router.replace(isOrgAdmin ? '/org-admin/dashboard' : '/welcome')
      }
      return
    }
    if (pathname.startsWith('/org-admin')) {
      if (!isOrgAdmin && !isPlatform) {
        router.replace('/welcome')
      }
    }
  }, [hydrated, user, pathname, router])
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const [hydrated, setHydrated] = useState(false)
  const { isOpen: aiOpen } = useAiPane()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/login')
  }, [hydrated, isAuthenticated, router])

  useRoleRedirects(user, hydrated)

  useEffect(() => {
    if (!hydrated || !user) return
    const path = pathname ?? ''
    if (path.startsWith('/admin') || path.startsWith('/org-admin') || isWelcomePath(path)) return
    if (!canViewPath(path, user.modulePermissions, user.roles)) {
      router.replace('/welcome')
      return
    }
    if (!canViewPathWithPackage(path, user.packageEnabledModules, user.roles)) {
      router.replace('/welcome')
    }
  }, [hydrated, user, pathname, router])

  if (!hydrated || !isAuthenticated) return null

  const hideMainChrome =
    pathname.startsWith('/admin') || pathname.startsWith('/org-admin')

  if (hideMainChrome) {
    return (
      <div className="flex h-screen bg-white">
        <MeSync />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">{children}</main>
      </div>
    )
  }

  // Welcome / apps launcher — white canvas, no sidebar, profile top-right
  if (isWelcomePath(pathname)) {
    return (
      <div className="min-h-screen bg-white">
        <MeSync />
        {children}
      </div>
    )
  }

  // Module workspace — header tabs for sub-options, content below
  return (
    <div className="relative h-screen bg-white">
      <MeSync />
      <ModuleWorkspaceChrome>
        <div
          className={cn(
            'relative min-h-full bg-white transition-[padding] duration-300 ease-in-out',
            aiOpen && 'pr-80',
          )}
        >
          {children}
          <ModulePastEntriesFab />
        </div>
      </ModuleWorkspaceChrome>
      <AiPane />
    </div>
  )
}
