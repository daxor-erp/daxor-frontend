'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ErpAppHeader } from '@/components/erp-app-header'
import { ModulePastEntriesFab } from '@/components/module-past-entries-fab'
import { MeSync } from '@/components/me-sync'
import { canViewPath } from '@/lib/erp-module-access'

function useRoleRedirects(user: ReturnType<typeof useAuth>['user'], hydrated: boolean) {
  const router = useRouter()
  const pathname = usePathname() ?? ''

  useEffect(() => {
    if (!hydrated || !user) return
    const roles = user.roles ?? []
    const isPlatform = roles.includes('SUPER_ADMIN') || roles.includes('ERP_ADMIN')
    const isOrgAdmin = roles.includes('ORG_ADMIN')

    if (pathname === '/dashboard') {
      if (isPlatform) {
        router.replace('/admin/dashboard')
        return
      }
      const onlyOrgAdmin =
        isOrgAdmin &&
        !isPlatform &&
        roles.length > 0 &&
        roles.every((r) => r === 'ORG_ADMIN')
      if (onlyOrgAdmin) {
        router.replace('/org-admin/dashboard')
        return
      }
    }

    if (pathname.startsWith('/admin')) {
      if (!isPlatform) {
        router.replace(isOrgAdmin ? '/org-admin/dashboard' : '/dashboard')
      }
      return
    }
    if (pathname.startsWith('/org-admin')) {
      if (isPlatform) {
        router.replace('/admin/dashboard')
        return
      }
      if (!isOrgAdmin) {
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
      router.replace('/dashboard')
    }
  }, [hydrated, user, pathname, router])

  if (!hydrated || !isAuthenticated) return null

  const hideMainSidebar =
    pathname.startsWith('/admin') || pathname.startsWith('/org-admin')

  return (
    <div className="flex h-screen bg-gray-50">
      <MeSync />
      {!hideMainSidebar && <Sidebar />}
      <main className={`flex flex-1 min-h-0 min-w-0 flex-col ${hideMainSidebar ? 'overflow-auto' : 'overflow-hidden bg-gray-50'}`}>
        {!hideMainSidebar && <ErpAppHeader />}
        <div className={hideMainSidebar ? '' : 'flex-1 overflow-y-auto min-h-0 relative'}>
          {children}
          {!hideMainSidebar && <ModulePastEntriesFab />}
        </div>
      </main>
    </div>
  )
}
