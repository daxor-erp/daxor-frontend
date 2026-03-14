'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { canAccessRoute } from '@/lib/rbac/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  userRoles?: string[]
  requiredRoute: string
  fallbackUrl?: string
}

export function ProtectedRoute({ 
  children, 
  userRoles, 
  requiredRoute,
  fallbackUrl = '/unauthorized' 
}: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    if (!canAccessRoute(userRoles, requiredRoute)) {
      router.push(fallbackUrl)
    }
  }, [userRoles, requiredRoute, fallbackUrl, router])

  if (!canAccessRoute(userRoles, requiredRoute)) {
    return null
  }

  return <>{children}</>
}
