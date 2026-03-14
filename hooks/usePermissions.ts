'use client'

import { useMemo } from 'react'
import { hasPermission, canAccessRoute } from '@/lib/rbac/permissions'

export function usePermissions(userRoles?: string[]) {
  return useMemo(() => ({
    can: (resource: string, action: string) => hasPermission(userRoles, resource, action),
    canAccess: (route: string) => canAccessRoute(userRoles, route),
    hasRole: (role: string) => userRoles?.includes(role) || false,
    isSuperAdmin: userRoles?.includes('SUPER_ADMIN') || false,
  }), [userRoles])
}
