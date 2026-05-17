'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ASSETS } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Button } from '@/components/ui/button'
import { Boxes, ArrowRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

export default function AssetIssuePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const { data, loading } = useQuery(GET_ASSETS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const assets: any[] = data?.assets ?? []

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Asset Issue to Employee"
        description="Track company assets handed to employees — laptops, phones, ID cards, tools."
        actions={
          <Link
            href="/hr/masters/asset-name-list"
            className="inline-flex items-center gap-1.5 rounded-lg bg-grad-brand text-white px-3 py-2 text-sm font-semibold hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Manage asset catalog
          </Link>
        }
      />

      <SectionCard
        title="Issued assets"
        description={`${assets.length} record${assets.length === 1 ? '' : 's'}`}
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : assets.length === 0 ? (
          <div className="p-10 text-center">
            <Boxes className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No assets issued yet</p>
            <p className="text-xs text-muted-foreground mb-3">
              First, set up your asset catalog, then track issuance from each employee&apos;s record.
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/hr/masters/asset-name-list" className="inline-flex items-center gap-1 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary">
                Asset catalog <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/hr/masters/employee-master" className="inline-flex items-center gap-1 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary">
                Employee master <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 100).map((a: any) => (
                  <tr key={a.id ?? a._id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-medium">{a.name ?? a.assetName ?? '—'}</td>
                    <td className="px-3 py-3 text-muted-foreground">{a.description || '—'}</td>
                    <td className="px-3 py-3 text-muted-foreground">{a.type || a.category || '—'}</td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        String(a.status).toUpperCase() === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200',
                      )}>{a.status ?? 'ACTIVE'}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{a.createdAt ? formatDate(a.createdAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
