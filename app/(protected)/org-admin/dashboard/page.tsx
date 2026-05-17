'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboardPreferences } from '@/hooks/use-dashboard-preferences'
import {
  GET_ORGANIZATION,
  GET_USERS,
  MY_PENDING_APPROVAL_REQUESTS,
} from '@/gql/queries'
import {
  Building2,
  Users,
  ShieldCheck,
  ExternalLink,
  ClipboardCheck,
  ArrowUpRight,
  CheckCircle2,
  UserPlus,
  ListChecks,
  Sparkles,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { SectionCard, PageHeader } from '@/components/dashboard/section-card'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

export default function OrgAdminDashboardPage() {
  const { user } = useAuth()
  const prefs = useDashboardPreferences('orgAdmin')
  const orgId = user?.organizationId ?? ''
  const skip = !orgId

  const { data: orgData, loading: orgLoading } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
  })
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 200, search: null },
    skip,
    fetchPolicy: 'cache-and-network',
  })
  const { data: approvalsData } = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  })

  const org = orgData?.organization
  const users: any[] = usersData?.usersByOrganization?.users ?? []
  const total = usersData?.usersByOrganization?.total ?? users.length
  const active = users.filter((u: any) => String(u.status).toUpperCase() === 'ACTIVE').length
  const pending = users.filter((u: any) => String(u.status).toUpperCase() === 'PENDING').length
  const approvals = approvalsData?.myPendingApprovalRequests ?? []

  const canUseErp = (user?.roles ?? []).some((r) => r !== 'ORG_ADMIN')
  const moduleApprovers = org?.moduleApprovers ?? []

  const initials = ((org?.name || 'X X').split(' ').map((p: string) => p[0]).join('') || 'X').slice(0, 2).toUpperCase()

  const spanClassFor = (span: 1 | 2 | 3 | undefined): string => {
    if (span === 3) return 'lg:col-span-3'
    if (span === 2) return 'lg:col-span-2'
    return ''
  }

  const kpiCards: Record<string, React.ReactNode> = {
    'kpi-users': (
      <StatCard
        label="Users"
        value={total}
        hint={`${active} active`}
        icon={<Users className="h-5 w-5" />}
        tone="brand"
        loading={usersLoading}
      />
    ),
    'kpi-pending-users': (
      <StatCard
        label="Pending users"
        value={pending}
        hint="Awaiting activation"
        icon={<UserPlus className="h-5 w-5" />}
        tone="warn"
        loading={usersLoading}
      />
    ),
    'kpi-module-approvers': (
      <StatCard
        label="Module approvers"
        value={moduleApprovers.length}
        hint="Configured"
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="violet"
        loading={orgLoading}
      />
    ),
    'kpi-pending-approvals': (
      <StatCard
        label="Pending approvals"
        value={approvals.length}
        hint="In your inbox"
        icon={<ClipboardCheck className="h-5 w-5" />}
        tone={approvals.length ? 'rose' : 'emerald'}
      />
    ),
  }

  const renderSection = (id: string, spanClass: string): React.ReactNode => {
    switch (id) {
      case 'section-org-profile':
        return (
          <SectionCard
            className={spanClass}
            title="Organization profile"
            description="Tenant details"
            action={
              <Link href="/org-admin/users" className="text-xs font-medium text-primary hover:underline">
                Edit users
              </Link>
            }
          >
            {orgLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : org ? (
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-xl bg-grad-accent text-white grid place-items-center font-bold text-lg uppercase shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 space-y-1.5">
                  <p className="text-base font-semibold leading-tight">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.email || 'No email set'} {org.phone ? ` · ${org.phone}` : ''}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {org.code && (
                      <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-mono">
                        {org.code}
                      </span>
                    )}
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        String(org.status).toUpperCase() === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200',
                      )}
                    >
                      {org.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Organization not found.</p>
            )}
          </SectionCard>
        )
      case 'section-recent-users':
        return (
          <SectionCard
            className={spanClass}
            title="Recent users"
            description={`${total} total`}
            action={
              <Link href="/org-admin/users" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
            bodyClassName="p-0"
          >
            {usersLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No users yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Email</th>
                      <th className="px-3 py-3 font-medium">Roles</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 6).map((u: any) => {
                      const ini = ((u.firstName?.[0] ?? '') + (u.lastName?.[0] ?? '')).toUpperCase() || 'U'
                      return (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-grad-brand text-white grid place-items-center font-semibold text-xs">
                                {ini}
                              </div>
                              <span className="font-medium">
                                {u.firstName} {u.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-muted-foreground">{u.email}</td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-1">
                              {(u.roles ?? []).slice(0, 2).map((r: string) => (
                                <span key={r} className="inline-flex items-center rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-medium">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                                String(u.status).toUpperCase() === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200',
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
        )
      case 'section-approvals-inbox':
        return (
          <SectionCard
            className={spanClass}
            title="Approvals in your inbox"
            description="Requests awaiting your decision"
          >
            {approvals.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">All caught up</p>
                <p className="text-xs text-muted-foreground">No approval requests pending.</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {approvals.slice(0, 5).map((a: any) => (
                  <li key={a.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{a.title ?? 'Approval request'}</p>
                      <span className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
                        Pending
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{a.moduleKey ?? '—'}</span>
                      {a.createdAt && <span>{formatDate(a.createdAt)}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        )
      case 'section-quick-links':
        return (
          <SectionCard className={spanClass} title="Quick links" description="Common tasks">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Users', href: '/org-admin/users', icon: Users, tone: 'brand' },
                { label: 'Roles', href: '/org-admin/roles-permissions', icon: ShieldCheck, tone: 'violet' },
                { label: 'Approvals', href: '/org-admin/approvals', icon: ListChecks, tone: 'warn' },
                { label: 'Open ERP', href: '/dashboard', icon: Sparkles, tone: 'emerald' },
              ].map((l) => {
                const Icon = l.icon
                const toneMap: Record<string, string> = {
                  brand: 'bg-primary-soft text-primary',
                  violet: 'bg-violet-50 text-violet-600',
                  warn: 'bg-amber-50 text-amber-600',
                  emerald: 'bg-emerald-50 text-emerald-600',
                }
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group flex flex-col items-start gap-1.5 rounded-xl border bg-card p-3 hover:elev-2 transition-all hover:-translate-y-0.5"
                  >
                    <div className={cn('rounded-lg p-2', toneMap[l.tone])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium">{l.label}</span>
                  </Link>
                )
              })}
            </div>
          </SectionCard>
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-grad-tenant-hero text-white elev-2">
        <div className="absolute inset-0 bg-dotgrid opacity-[0.1]" />
        <div
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-45 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, hsl(168 90% 50%), transparent)' }}
        />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              <Building2 className="h-3 w-3" />
              Tenant administration
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight">
              {org?.name ? org.name : 'Your organization'}
            </h1>
            <p className="mt-1.5 text-sm text-white/85">
              Manage users, roles, and approvals for your team.
            </p>
            {org?.code && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-white/80">
                <span className="rounded bg-white/15 border border-white/20 px-2 py-0.5 font-mono">{org.code}</span>
                <span className="capitalize">{String(org.status || '').toLowerCase()}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/org-admin/users"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Manage users
            </Link>
            {canUseErp && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Open ERP
              </Link>
            )}
          </div>
        </div>
      </div>

      <PageHeader
        title="Tenant overview"
        description="Snapshot of users, roles, and pending approvals."
      />

      {!orgId ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No organization is assigned to this account.
        </div>
      ) : null}

      {prefs.visibleWidgets('kpi').length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {prefs.visibleWidgets('kpi').map((w) => (
            <Fragment key={w.id}>{kpiCards[w.id]}</Fragment>
          ))}
        </div>
      )}

      {prefs.visibleWidgets('section').length > 0 && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {prefs.visibleWidgets('section').map((w) => (
            <Fragment key={w.id}>{renderSection(w.id, spanClassFor(w.colSpan))}</Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
