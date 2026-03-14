'use client'

import { hasPermission } from '@/lib/rbac/permissions'

interface CanProps {
  userRoles?: string[]
  resource: string
  action: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Can({ userRoles, resource, action, children, fallback = null }: CanProps) {
  if (!hasPermission(userRoles, resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
