'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ASSETS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, DateCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { Boxes, Plus } from 'lucide-react'

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
  const active = assets.filter((a) => String(a.status).toUpperCase() === 'ACTIVE').length

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Asset',
      sortable: true,
      render: (v, r) => <span className="text-sm font-medium">{v ?? r.assetName ?? '—'}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      width: '120px',
      render: (v, r) => <span className="text-sm text-muted-foreground">{v || r.category || '—'}</span>,
    },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <ErpBadge status={String(v ?? 'ACTIVE')} /> },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Asset Issue to Employee"
        subtitle="Track company assets handed to employees — laptops, phones, ID cards, tools."
        icon={<Boxes className="h-5 w-5" />}
        breadcrumbs={[{ label: 'HR' }, { label: 'Masters' }, { label: 'Asset Issue' }]}
        actions={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/hr/masters/asset-name-list">
              <Plus className="h-4 w-4 mr-1.5" /> Manage asset catalog
            </Link>
          </Button>
        }
      />

      <StatsRow cols={2}>
        <StatCard label="Issued assets" value={assets.length} icon={<Boxes className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={active} icon={<Boxes className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={assets}
        columns={columns}
        loading={loading}
        title="All Issued Assets"
        searchable
        searchPlaceholder="Search assets…"
        emptyMessage="No assets issued yet. Set up the asset catalog first."
        pageSize={25}
      />
    </div>
  )
}
