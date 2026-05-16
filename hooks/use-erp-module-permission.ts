'use client'

import { useAuth } from '@/contexts/AuthContext'
import { bypassesModuleAcl, effectiveModulePermission } from '@/lib/erp-module-access'
import type { ModulePermissionRow } from '@/lib/erp-module-access'

export function useErpModulePermission(moduleKey: string): {
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canView: boolean
  bypass: boolean
  isRestricted: boolean
} {
  const { user } = useAuth()
  const roles = user?.roles
  const rows = user?.modulePermissions as ModulePermissionRow[] | undefined

  if (bypassesModuleAcl(roles)) {
    return {
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canView: true,
      bypass: true,
      isRestricted: false,
    }
  }

  const perm = effectiveModulePermission(moduleKey, rows ?? null)
  const isRestricted = (rows?.length ?? 0) > 0

  return { ...perm, bypass: false, isRestricted }
}
