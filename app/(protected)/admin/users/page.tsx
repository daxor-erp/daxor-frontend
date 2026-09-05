'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS, GET_USERS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, DateCell } from '@/components/ui/erp-shared'
import { Users, UserCheck, UserMinus, ShieldCheck } from 'lucide-react'

export default function AdminUsersPage() {
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [search, setSearch] = useState('')

  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { fetchPolicy: 'cache-and-network' })
  const orgs = orgsData?.organizations ?? []

  useEffect(() => {
    if (!selectedOrgId && orgs.length) setSelectedOrgId(orgs[0].id)
  }, [orgs, selectedOrgId])

  const { data, loading } = useQuery(GET_USERS, {
    variables: { organizationId: selectedOrgId, page: 1, limit: 200, search: search || null },
    skip: !selectedOrgId,
    fetchPolicy: 'cache-and-network',
  })

  const users: any[] = data?.usersByOrganization?.users ?? []

  const stats = useMemo(() => {
    const active = users.filter((u) => String(u.status).toLowerCase() === 'active').length
    const pending = users.filter((u) => String(u.status).toLowerCase() === 'pending').length
    const orgAdmins = users.filter((u) => (u.roles ?? []).includes('ORG_ADMIN')).length
    return { total: users.length, active, pending, orgAdmins }
  }, [users])

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_v, r) => (
        <span className="text-sm font-medium">
          {r.firstName} {r.lastName}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span>,
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (v) => (
        <div className="flex flex-wrap gap-1">
          {(v ?? []).slice(0, 3).map((r: string) => (
            <span key={r} className="inline-flex items-center rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium">
              {r}
            </span>
          ))}
          {(v ?? []).length === 0 && <span className="text-xs text-muted-foreground">—</span>}
        </div>
      ),
    },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Users"
        subtitle="Browse users by tenant organization. Use the org admin console for full edit/permission management."
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Users' }]}
        actions={
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="rounded-lg border border-border bg-card py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">— select organization —</option>
            {orgs.map((o: any) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Users in org" value={stats.total} icon={<Users className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={stats.active} icon={<UserCheck className="h-5 w-5" />} variant="green" />
        <StatCard label="Pending" value={stats.pending} icon={<UserMinus className="h-5 w-5" />} variant="amber" />
        <StatCard label="Org admins" value={stats.orgAdmins} icon={<ShieldCheck className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      <DataTable
        data={users}
        columns={columns}
        loading={loading || !selectedOrgId}
        title="All Users"
        searchable
        searchPlaceholder="Search users…"
        onSearch={setSearch}
        emptyMessage={selectedOrgId ? 'No users yet in this organization.' : 'Select an organization to load users.'}
        pageSize={25}
      />
    </div>
  )
}
