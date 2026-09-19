'use client'

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { ME } from '@/gql/queries'

/** Keeps AuthContext user in sync with server (org, roles, modulePermissions, etc.). */
export function MeSync() {
  const { token, mergeUser } = useAuth()
  const { data } = useQuery(ME, {
    skip: !token,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const me = data?.me
    if (!me) return
    mergeUser({
      id: me.id,
      email: me.email,
      firstName: me.firstName,
      lastName: me.lastName,
      roles: me.roles ?? [],
      // Critical for org-scoped lists (dashboard KPIs, etc.). Stale localStorage
      // sessions sometimes lack this even though the JWT / me query has it.
      organizationId: me.organizationId ?? null,
      modulePermissions: me.modulePermissions ?? [],
      packageEnabledModules: me.packageEnabledModules ?? [],
      dashboardPreferences: me.dashboardPreferences ?? null,
    })
  }, [data?.me, mergeUser])

  return null
}
