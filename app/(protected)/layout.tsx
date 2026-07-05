'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MeSync } from '@/components/me-sync'
import { canViewPath } from '@/lib/erp-module-access'
import { canViewPathWithPackage } from '@/lib/package-module-access'
import { ErpTopHeader } from '@/components/erp-shell/erp-top-header'
import { ErpModuleShell } from '@/components/erp-shell/erp-module-shell'

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
        router.replace(isOrgAdmin ? '/org-admin/dashboard' : '/apps')
      }
      return
    }
    if (pathname.startsWith('/org-admin')) {
      if (!isOrgAdmin && !isPlatform) {
        router.replace('/apps')
      }
    }
  }, [hydrated, user, pathname, router])
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const [hydrated, setHydrated] = useState(false)

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
    if (path.startsWith('/admin') || path.startsWith('/org-admin')) return
    if (!canViewPath(path, user.modulePermissions, user.roles)) {
      router.replace('/apps')
      return
    }
    if (!canViewPathWithPackage(path, user.packageEnabledModules, user.roles)) {
      router.replace('/apps')
    }
  }, [hydrated, user, pathname, router])

  if (!hydrated || !isAuthenticated) return null

  const hideMainChrome =
    pathname.startsWith('/admin') || pathname.startsWith('/org-admin')

  const isAppLauncher = pathname === '/apps'

  if (isAppLauncher) {
    return (
      <div className="flex h-screen flex-col bg-gradient-to-b from-teal-50/70 via-slate-50 to-sky-50/60">
        <MeSync />
        <ErpTopHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    )
  }

  if (hideMainChrome) {
    return (
      <div className="flex h-screen bg-slate-50">
        <MeSync />
        <main className="flex flex-1 min-h-0 min-w-0 flex-col overflow-auto">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <MeSync />
      <ErpModuleShell>{children}</ErpModuleShell>
    </div>
  )
}
