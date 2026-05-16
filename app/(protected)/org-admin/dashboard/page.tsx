'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Users, ExternalLink } from 'lucide-react'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATION } from '@/gql/queries'

export default function OrgAdminDashboardPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const { data } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const org = data?.organization
  const canUseErp = (user?.roles ?? []).some((r) => r !== 'ORG_ADMIN')

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Organization overview</h1>
        <p className="text-sm text-slate-600 mt-1">Tenant details and quick actions.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-1">Your organization</h2>
        {!orgId ? (
          <p className="text-sm text-amber-700">No organization is assigned to this account.</p>
        ) : org ? (
          <dl className="mt-4 grid gap-2 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">{org.name}</dd>
            </div>
            {org.code ? (
              <div>
                <dt className="text-slate-500">Code</dt>
                <dd className="font-mono">{org.code}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="capitalize">{org.status}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-500 mt-2">Loading organization…</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-teal-600 hover:bg-teal-700 gap-1">
          <Link href="/org-admin/users" className="inline-flex items-center">
            <Users className="h-4 w-4" />
            Manage users
          </Link>
        </Button>
        {canUseErp ? (
          <Button asChild variant="outline" className="gap-1">
            <Link href="/dashboard" className="inline-flex items-center">
              <ExternalLink className="h-4 w-4" />
              Open ERP dashboard
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
