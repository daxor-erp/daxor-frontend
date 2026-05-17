'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS, GET_USERS } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Search, Users, UserCheck, UserMinus, ShieldCheck } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'

const STATUS_TONE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  suspended: 'bg-rose-50 text-rose-700 border-rose-200',
  deleted: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminUsersPage() {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
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
  const total = data?.usersByOrganization?.total ?? users.length

  const stats = useMemo(() => {
    const active = users.filter((u) => String(u.status).toLowerCase() === 'active').length
    const pending = users.filter((u) => String(u.status).toLowerCase() === 'pending').length
    const orgAdmins = users.filter((u) => (u.roles ?? []).includes('ORG_ADMIN')).length
    return { total: users.length, active, pending, orgAdmins }
  }, [users])

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Users"
        description="Browse users by tenant organization. Use the org admin console for full edit/permission management."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Users in org" value={stats.total} icon={Users} tone="brand" />
        <StatTile label="Active" value={stats.active} icon={UserCheck} tone="emerald" />
        <StatTile label="Pending" value={stats.pending} icon={UserMinus} tone="warn" />
        <StatTile label="Org admins" value={stats.orgAdmins} icon={ShieldCheck} tone="violet" />
      </div>

      <SectionCard
        title="Users"
        description={selectedOrgId ? `${total} users in selected organization` : 'Pick an organization to view its users'}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="rounded-lg border border-border bg-secondary/40 py-1.5 px-3 text-xs outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">— select organization —</option>
              {orgs.map((o: any) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users…"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-56"
              />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {!selectedOrgId ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Select an organization above to load its users.</div>
        ) : loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No users yet in this organization.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Roles</th>
                  <th className="px-3 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const ini = ((u.firstName?.[0] ?? '') + (u.lastName?.[0] ?? '')).toUpperCase() || 'U'
                  const s = String(u.status || '').toLowerCase()
                  return (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-grad-brand text-white grid place-items-center font-semibold text-xs">
                            {ini}
                          </div>
                          <span className="font-medium">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{u.email}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(u.roles ?? []).slice(0, 3).map((r: string) => (
                            <span key={r} className="inline-flex items-center rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-medium">
                              {r}
                            </span>
                          ))}
                          {(u.roles ?? []).length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                            STATUS_TONE[s] || STATUS_TONE.inactive,
                          )}
                        >
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  tone: 'brand' | 'emerald' | 'warn' | 'rose' | 'violet'
}) {
  const toneCls: Record<string, string> = {
    brand: 'bg-primary-soft text-primary',
    emerald: 'bg-emerald-50 text-emerald-600',
    warn: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className={cn('rounded-lg p-2.5', toneCls[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  )
}
