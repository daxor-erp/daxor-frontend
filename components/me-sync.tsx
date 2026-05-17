'use client'

import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { ME } from '@/gql/queries'

/** Keeps AuthContext user in sync with server (modulePermissions, etc.). */
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
      modulePermissions: me.modulePermissions ?? [],
      dashboardPreferences: me.dashboardPreferences ?? null,
    })
  }, [data?.me, mergeUser])

  return null
}
