'use client'

import Link from 'next/link'
import { Fragment, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_ORGANIZATIONS,
  CREATE_ORGANIZATION_WITH_ORG_ADMIN,
} from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Building2,
  Users,
  Plus,
  ExternalLink,
  Search,
  CheckCircle2,
  Activity,
  TrendingUp,
  ServerCog,
  ShieldCheck,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboardPreferences } from '@/hooks/use-dashboard-preferences'
import { StatCard } from '@/components/dashboard/stat-card'
import { SectionCard, PageHeader } from '@/components/dashboard/section-card'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

const STATUS_TONE: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200',
  INACTIVE: 'bg-slate-100 text-slate-700 border-slate-200',
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const prefs = useDashboardPreferences('admin')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)

  const [orgForm, setOrgForm] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    type: '',
  })
  const [adminForm, setAdminForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  })

  const { data, loading, refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 500, search: null },
    fetchPolicy: 'cache-and-network',
  })

  const [runBootstrap, { loading: saving }] = useMutation(
    CREATE_ORGANIZATION_WITH_ORG_ADMIN,
    {
      onCompleted: () => {
        refetch()
        setBanner({ ok: true, text: 'Organization and organization admin created.' })
        setOrgForm({ name: '', code: '', email: '', phone: '', address: '', contactPerson: '', type: '' })
        setAdminForm({ email: '', firstName: '', lastName: '', password: '' })
        setOpen(false)
        setTimeout(() => setBanner(null), 5000)
      },
      onError: (e) => setBanner({ ok: false, text: e.message }),
    },
  )

  const orgs: Array<{ id: string; name: string; code?: string; email?: string; status: string; createdAt?: string }> =
    data?.organizations ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return orgs
    const q = search.toLowerCase()
    return orgs.filter(
      (o) =>
        (o.name || '').toLowerCase().includes(q) ||
        (o.code || '').toLowerCase().includes(q) ||
        (o.email || '').toLowerCase().includes(q),
    )
  }, [orgs, search])

  const stats = useMemo(() => {
    const total = orgs.length
    const active = orgs.filter((o) => String(o.status).toUpperCase() === 'ACTIVE').length
    const pending = orgs.filter((o) => String(o.status).toUpperCase() === 'PENDING').length
    const suspended = orgs.filter((o) => ['SUSPENDED', 'INACTIVE'].includes(String(o.status).toUpperCase())).length
    return { total, active, pending, suspended }
  }, [orgs])

  const orgGrowth = useMemo(() => {
    const now = new Date()
    const buckets: { key: string; label: string; total: number; cumulative: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString(undefined, { month: 'short' }),
        total: 0,
        cumulative: 0,
      })
    }
    const map = new Map(buckets.map((b) => [b.key, b]))
    for (const o of orgs) {
      if (!o.createdAt) continue
      const dt = new Date(o.createdAt)
      const key = `${dt.getFullYear()}-${dt.getMonth()}`
      const b = map.get(key)
      if (b) b.total += 1
    }
    let acc = 0
    for (const b of buckets) {
      acc += b.total
      b.cumulative = acc
    }
    return buckets
  }, [orgs])

  const statusPie = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of orgs) {
      const k = String(o.status || 'INACTIVE').toUpperCase()
      map[k] = (map[k] ?? 0) + 1
    }
    const palette: Record<string, string> = {
      ACTIVE: 'hsl(152 60% 40%)',
      PENDING: 'hsl(38 92% 50%)',
      SUSPENDED: 'hsl(0 70% 60%)',
      INACTIVE: 'hsl(220 9% 60%)',
    }
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: palette[name] ?? 'hsl(158 64% 36%)',
    }))
  }, [orgs])

  const recent = useMemo(
    () =>
      [...orgs]
        .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
        .slice(0, 6),
    [orgs],
  )

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setBanner(null)
    if (!orgForm.name.trim()) {
      setBanner({ ok: false, text: 'Organization name is required.' })
      return
    }
    if (!adminForm.email.trim() || !adminForm.firstName.trim() || !adminForm.lastName.trim()) {
      setBanner({ ok: false, text: 'Organization admin name and email are required.' })
      return
    }
    if (!adminForm.password || adminForm.password.length < 6) {
      setBanner({ ok: false, text: 'Organization admin password must be at least 6 characters.' })
      return
    }
    const organization: Record<string, unknown> = {
      name: orgForm.name.trim(),
      code: orgForm.code.trim() || undefined,
      email: orgForm.email.trim() || undefined,
      phone: orgForm.phone.trim() || undefined,
      address: orgForm.address.trim() || undefined,
    }
    if (orgForm.contactPerson.trim()) organization.contactPerson = orgForm.contactPerson.trim()
    if (orgForm.type.trim()) organization.type = orgForm.type.trim()
    runBootstrap({
      variables: {
        input: {
          organization,
          orgAdmin: {
            email: adminForm.email.trim(),
            firstName: adminForm.firstName.trim(),
            lastName: adminForm.lastName.trim(),
            password: adminForm.password,
          },
        },
      },
    })
  }

  const spanClassFor = (span: 1 | 2 | 3 | undefined): string => {
    if (span === 3) return 'lg:col-span-3'
    if (span === 2) return 'lg:col-span-2'
    return ''
  }

  const kpiCards: Record<string, React.ReactNode> = {
    'kpi-total-orgs': (
      <StatCard
        label="Total organizations"
        value={stats.total}
        hint="All tenants"
        icon={<Building2 className="h-5 w-5" />}
        tone="brand"
        loading={loading}
        spark={orgGrowth.map((b) => b.cumulative)}
      />
    ),
    'kpi-active-orgs': (
      <StatCard
        label="Active"
        value={stats.active}
        hint={`${Math.round(((stats.active || 0) / (stats.total || 1)) * 100)}% of total`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        tone="emerald"
        loading={loading}
      />
    ),
    'kpi-pending-orgs': (
      <StatCard
        label="Pending"
        value={stats.pending}
        hint="Awaiting activation"
        icon={<Activity className="h-5 w-5" />}
        tone="warn"
        loading={loading}
      />
    ),
    'kpi-suspended-orgs': (
      <StatCard
        label="Suspended"
        value={stats.suspended}
        hint="Inactive tenants"
        icon={<ServerCog className="h-5 w-5" />}
        tone="rose"
        loading={loading}
      />
    ),
  }

  const renderSection = (id: string, spanClass: string): React.ReactNode => {
    switch (id) {
      case 'section-org-growth':
        return (
          <SectionCard
            className={spanClass}
            title="Organization growth"
            description="Last 12 months"
            action={
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Cumulative
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  New
                </span>
              </div>
            }
          >
            <div className="h-64 sm:h-72 -mx-2">
              <ResponsiveContainer>
                <AreaChart data={orgGrowth} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(158 64% 36%)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="hsl(158 64% 36%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="newOrg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(168 84% 39%)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="hsl(168 84% 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="label" stroke="hsl(220 9% 46%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(220 9% 46%)" fontSize={11} tickLine={false} axisLine={false} width={32} />
                  <RTooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid hsl(220 13% 91%)',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="cumulative" stroke="hsl(158 64% 36%)" strokeWidth={2.5} fill="url(#cum)" />
                  <Area type="monotone" dataKey="total" stroke="hsl(168 84% 39%)" strokeWidth={2} fill="url(#newOrg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )
      case 'section-status-mix':
        return (
          <SectionCard className={spanClass} title="Status mix" description={`${stats.total} organizations`}>
            {statusPie.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={statusPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="white">
                        {statusPie.map((s) => (
                          <Cell key={s.name} fill={s.color} />
                        ))}
                      </Pie>
                      <RTooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {statusPie.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        <span className="capitalize">{s.name.toLowerCase()}</span>
                      </span>
                      <span className="font-medium tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </SectionCard>
        )
      case 'section-recent-orgs':
        return (
          <SectionCard
            className={spanClass}
            title="Recent organizations"
            description="Latest tenants created"
            action={
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orgs"
                  className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-48"
                />
              </div>
            }
            bodyClassName="p-0"
          >
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {search ? 'No organizations match your search.' : 'No organizations yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="erp-table">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Code</th>
                      <th className="px-3 py-3 font-medium">Email</th>
                      <th className="px-3 py-3 font-medium">Created</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 8).map((o) => (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg grid place-items-center font-semibold text-xs uppercase">
                              {(o.name || '?').slice(0, 2)}
                            </div>
                            <span className="font-medium">{o.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{o.code || '—'}</td>
                        <td className="px-3 py-3 text-xs">{o.email || '—'}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {o.createdAt ? formatDate(o.createdAt) : '—'}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                              STATUS_TONE[String(o.status).toUpperCase()] || STATUS_TONE.INACTIVE,
                            )}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )
      case 'section-new-tenants-bar':
        return (
          <SectionCard className={spanClass} title="New tenants per month" description="Last 12 months">
            <div className="h-64 -mx-2">
              <ResponsiveContainer>
                <BarChart data={orgGrowth} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="label" stroke="hsl(220 9% 46%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(220 9% 46%)" fontSize={11} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
                  <RTooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                  <Bar dataKey="total" fill="hsl(158 64% 36%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )
      case 'section-system-health':
        return (
          <SectionCard
            className={spanClass}
            title="System health"
            description="Platform observability"
            action={
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium uppercase">
                <CheckCircle2 className="h-3 w-3" /> Healthy
              </span>
            }
          >
            <ul className="space-y-3">
              {[
                { label: 'API', value: 'Operational', tone: 'emerald' as const },
                { label: 'GraphQL gateway', value: 'Operational', tone: 'emerald' as const },
                { label: 'Database (MongoDB)', value: 'Operational', tone: 'emerald' as const },
                { label: 'Background jobs', value: 'Not configured', tone: 'warn' as const },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between">
                  <span className="text-sm">{row.label}</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                      row.tone === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', row.tone === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        )
      case 'section-recently-active':
        return (
          <SectionCard className={spanClass} title="Recently active" description="Top organizations">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {recent.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-grad-violet text-white grid place-items-center font-semibold text-xs uppercase shrink-0">
                        {(o.name || '?').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{o.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{o.email || o.code || '—'}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        STATUS_TONE[String(o.status).toUpperCase()] || STATUS_TONE.INACTIVE,
                      )}
                    >
                      {o.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        )
      case 'section-quick-links':
        return (
          <SectionCard className={spanClass} title="Quick links" description="Common admin tasks">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Organizations', href: '/admin/organizations', icon: Building2, tone: 'brand' },
                { label: 'Users', href: '/admin/users', icon: Users, tone: 'sky' },
                { label: 'Activity', href: '/admin/activity', icon: Activity, tone: 'emerald' },
                { label: 'Settings', href: '/admin/settings', icon: ServerCog, tone: 'violet' },
                { label: 'Modules', href: '/admin/dashboard', icon: Layers, tone: 'warn' },
                { label: 'Open ERP', href: '/dashboard', icon: Sparkles, tone: 'rose' },
              ].map((l) => {
                const Icon = l.icon
                const toneMap: Record<string, string> = {
                  brand: 'bg-primary-soft text-primary',
                  sky: 'bg-sky-50 text-sky-600',
                  emerald: 'bg-emerald-50 text-emerald-600',
                  violet: 'bg-violet-50 text-violet-600',
                  rose: 'bg-rose-50 text-rose-600',
                  warn: 'bg-amber-50 text-amber-600',
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
      case 'section-adoption-trend':
        return (
          <SectionCard className={spanClass} title="Adoption trend" description="Top tone showing momentum across the platform">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Monthly growth
                </div>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {orgGrowth[orgGrowth.length - 1]?.total ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">new organizations this month</p>
              </div>
              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Active rate
                </div>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {Math.round(((stats.active || 0) / (stats.total || 1)) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">of tenants currently active</p>
              </div>
              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 text-violet-600" />
                  Activation queue
                </div>
                <p className="mt-1 text-2xl font-bold tabular-nums">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">awaiting activation</p>
              </div>
            </div>
          </SectionCard>
        )
      default:
        return null
    }
  }

  return (
    <div className="erp-shell">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-grad-admin-hero text-white elev-2">
        <div className="absolute inset-0 bg-dotgrid opacity-[0.1]" />
        <div
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-45 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, hsl(290 95% 65%), transparent)' }}
        />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              <ShieldCheck className="h-3 w-3" />
              Platform Administration
            </div>
            <h1 className="erp-page-title">
              Welcome, {user?.firstName || 'Admin'}
            </h1>
            <p className="mt-1.5 text-sm text-white/85">
              Manage tenant organizations, users, and platform health from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/90 transition-colors">
                  <Plus className="h-4 w-4" />
                  New organization
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create tenant organization</DialogTitle>
                  <DialogDescription>
                    Provision a new tenant and seed the first organization administrator.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-5 pt-2">
                  {banner && (
                    <div
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm',
                        banner.ok
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-800',
                      )}
                    >
                      {banner.text}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Organization
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="ad-name">Legal / display name *</Label>
                        <Input
                          id="ad-name"
                          value={orgForm.name}
                          onChange={(e) => setOrgForm((f) => ({ ...f, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-code">Code</Label>
                        <Input
                          id="ad-code"
                          value={orgForm.code}
                          onChange={(e) => setOrgForm((f) => ({ ...f, code: e.target.value }))}
                          placeholder="Short unique code"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-type">Type</Label>
                        <Input
                          id="ad-type"
                          value={orgForm.type}
                          onChange={(e) => setOrgForm((f) => ({ ...f, type: e.target.value }))}
                          placeholder="client / vendor / both"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-email">Email</Label>
                        <Input
                          id="ad-email"
                          type="email"
                          value={orgForm.email}
                          onChange={(e) => setOrgForm((f) => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-phone">Phone</Label>
                        <Input
                          id="ad-phone"
                          value={orgForm.phone}
                          onChange={(e) => setOrgForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="ad-contact">Contact person</Label>
                        <Input
                          id="ad-contact"
                          value={orgForm.contactPerson}
                          onChange={(e) => setOrgForm((f) => ({ ...f, contactPerson: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="ad-address">Address</Label>
                        <Input
                          id="ad-address"
                          value={orgForm.address}
                          onChange={(e) => setOrgForm((f) => ({ ...f, address: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      First organization administrator
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Receives the <strong>ORG_ADMIN</strong> role and can manage users for this tenant.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-admin-email">Email *</Label>
                        <Input
                          id="ad-admin-email"
                          type="email"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm((f) => ({ ...f, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-admin-pass">Temporary password *</Label>
                        <Input
                          id="ad-admin-pass"
                          type="password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm((f) => ({ ...f, password: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-fn">First name *</Label>
                        <Input
                          id="ad-fn"
                          value={adminForm.firstName}
                          onChange={(e) => setAdminForm((f) => ({ ...f, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ad-ln">Last name *</Label>
                        <Input
                          id="ad-ln"
                          value={adminForm.lastName}
                          onChange={(e) => setAdminForm((f) => ({ ...f, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Creating…' : 'Create organization + admin'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Open ERP
            </Link>
          </div>
        </div>
      </div>

      {banner && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm flex items-center gap-2',
            banner.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800',
          )}
        >
          {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {banner.text}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {prefs.visibleWidgets('kpi').map((w) => (
          <Fragment key={w.id}>{kpiCards[w.id]}</Fragment>
        ))}
      </div>

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
