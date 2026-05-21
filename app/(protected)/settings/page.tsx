'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ORGANIZATION, UPDATE_USER } from '@/gql/queries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionCard, PageHeader } from '@/components/dashboard/section-card'
import { Switch } from '@/components/ui/switch'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { toast } from 'sonner'
import {
  User,
  Settings as Cog,
  Bell,
  Lock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Info as InfoIcon,
  Save,
  Sun,
  Moon,
  Monitor,
  Languages,
  Calendar,
} from 'lucide-react'
import { ERP_MODULE_DEFINITIONS } from '@/lib/erp-module-access'
import { cn } from '@/lib/utils'
import { useLayoutPreference, type LayoutMode } from '@/hooks/use-layout-preference'
import { DashboardCustomizationCard } from '@/components/dashboard/dashboard-customization-card'
import { type DashboardKey } from '@/lib/dashboard-manifest'
import { formatDate } from '@/lib/format-date'

const PREFS_KEY = 'daxor:preferences'
const NOTIF_PREFS_KEY = 'daxor:notification-prefs'

interface Preferences {
  density: 'compact' | 'comfortable'
  dateFormat: 'dd-mm-yyyy' | 'mm-dd-yyyy' | 'iso'
  language: 'en' | 'hi'
  currency: 'INR' | 'USD' | 'SGD' | 'MYR'
  showSparklines: boolean
  showDeltas: boolean
}

const DEFAULT_PREFS: Preferences = {
  density: 'comfortable',
  dateFormat: 'dd-mm-yyyy',
  language: 'en',
  currency: 'INR',
  showSparklines: true,
  showDeltas: true,
}

interface NotifPrefs {
  lowStock: boolean
  overdueInvoices: boolean
  billsDue: boolean
  approvals: boolean
  newLeads: boolean
  emailDigest: boolean
}

const DEFAULT_NOTIF: NotifPrefs = {
  lowStock: true,
  overdueInvoices: true,
  billsDue: true,
  approvals: true,
  newLeads: true,
  emailDigest: false,
}

function readPrefs<T extends object>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}
function writePrefs<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch { /* localStorage write blocked */ }
}

export default function SettingsPage() {
  const { user, mergeUser } = useAuth()
  const params = useSearchParams()
  const initialTab = params?.get('tab') ?? 'profile'
  const { theme, setTheme } = useTheme()
  const [layoutMode, setLayoutMode] = useLayoutPreference()
  const orgId = user?.organizationId ?? ''

  const [tab, setTab] = useState(initialTab)
  useEffect(() => {
    if (initialTab) setTab(initialTab)
  }, [initialTab])

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  })
  useEffect(() => {
    setProfile({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    })
  }, [user])

  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF)
  useEffect(() => {
    setPrefs(readPrefs<Preferences>(PREFS_KEY, DEFAULT_PREFS))
    setNotifPrefs(readPrefs<NotifPrefs>(NOTIF_PREFS_KEY, DEFAULT_NOTIF))
  }, [])

  const updatePrefs = (patch: Partial<Preferences>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch }
      writePrefs(PREFS_KEY, next)
      return next
    })
  }
  const updateNotifs = (patch: Partial<NotifPrefs>) => {
    setNotifPrefs((p) => {
      const next = { ...p, ...patch }
      writePrefs(NOTIF_PREFS_KEY, next)
      return next
    })
  }

  const { data: orgData } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const org = orgData?.organization

  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const u = data?.updateUser
      if (u) mergeUser({ firstName: u.firstName, lastName: u.lastName })
      toast.success('Profile updated')
    },
    onError: (e) => toast.error(e.message || 'Update failed'),
  })

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    updateUser({
      variables: {
        id: user.id,
        input: {
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
        },
      },
    })
  }

  const initials = ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || 'U'
  const permMap = useMemo(() => {
    const map: Record<string, any> = {}
    for (const p of user?.modulePermissions ?? []) map[p.moduleKey] = p
    return map
  }, [user?.modulePermissions])

  const availableDashboards = useMemo<{ key: DashboardKey; label: string }[]>(() => {
    const roles = user?.roles ?? []
    const isPlatform = roles.includes('SUPER_ADMIN') || roles.includes('ERP_ADMIN')
    const isOrgAdmin = roles.includes('ORG_ADMIN')
    const list: { key: DashboardKey; label: string }[] = []
    list.push({ key: 'erp', label: 'ERP dashboard' })
    if (isPlatform) list.push({ key: 'admin', label: 'Platform admin' })
    if (isOrgAdmin) list.push({ key: 'orgAdmin', label: 'Org admin' })
    return list
  }, [user?.roles])

  return (
    <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, notifications and access."
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="overflow-x-auto no-scrollbar w-full justify-start">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="preferences"><Cog className="h-4 w-4 mr-1.5" />Preferences</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><Lock className="h-4 w-4 mr-1.5" />Security</TabsTrigger>
          <TabsTrigger value="organization"><Building2 className="h-4 w-4 mr-1.5" />Organization</TabsTrigger>
          <TabsTrigger value="access"><ShieldCheck className="h-4 w-4 mr-1.5" />Module access</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <SectionCard title="Your profile" description="Personal information shown across the app">
            <form onSubmit={submitProfile} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-grad-brand text-white grid place-items-center text-xl font-bold elev-brand">
                  {initials}
                </div>
                <div>
                  <p className="text-base font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Roles: {(user?.roles ?? []).join(', ') || '—'}
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled />
                  <p className="text-xs text-muted-foreground">Contact your organization admin to change your email.</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="bg-grad-brand text-white border-none gap-1.5">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="mt-6 space-y-6">
          <SectionCard title="Navigation layout" description="Choose how modules are displayed">
            <div className="grid gap-4 sm:grid-cols-2">
              <LayoutPreviewCard
                value="sidebar"
                current={layoutMode}
                onSelect={setLayoutMode}
                label="Side menu"
                description="Vertical sidebar with module groups. Best for power users on wide screens."
              />
              <LayoutPreviewCard
                value="navbar"
                current={layoutMode}
                onSelect={setLayoutMode}
                label="Top navbar"
                description="Horizontal navigation with dropdowns. More content space; great for dashboards."
              />
            </div>
          </SectionCard>

          <SectionCard title="Appearance" description="Tune how the app looks">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-all',
                    theme === id ? 'border-primary ring-2 ring-primary/40 bg-primary-soft/40' : 'hover:bg-secondary',
                  )}
                >
                  <Icon className="h-5 w-5 mb-2 text-primary" />
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{id === 'system' ? 'Match OS preference' : `Use ${label.toLowerCase()} theme`}</p>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Display" description="Density, dates and language">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Density</Label>
                <RadioGroup
                  value={prefs.density}
                  onValueChange={(v) => updatePrefs({ density: v as Preferences['density'] })}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { v: 'comfortable', label: 'Comfortable' },
                    { v: 'compact', label: 'Compact' },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-3 cursor-pointer text-sm',
                        prefs.density === o.v ? 'border-primary bg-primary-soft/40' : 'hover:bg-secondary',
                      )}
                    >
                      <RadioGroupItem value={o.v} className="sr-only" />
                      <div className={cn('h-2 w-2 rounded-full', prefs.density === o.v ? 'bg-primary' : 'bg-border')} />
                      {o.label}
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date format</Label>
                <RadioGroup
                  value={prefs.dateFormat}
                  onValueChange={(v) => updatePrefs({ dateFormat: v as Preferences['dateFormat'] })}
                  className="space-y-1.5"
                >
                  {[
                    { v: 'dd-mm-yyyy', label: 'DD-MM-YYYY (India)' },
                    { v: 'mm-dd-yyyy', label: 'MM-DD-YYYY (US)' },
                    { v: 'iso', label: 'YYYY-MM-DD (ISO)' },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer text-sm',
                        prefs.dateFormat === o.v ? 'border-primary bg-primary-soft/40' : 'hover:bg-secondary',
                      )}
                    >
                      <RadioGroupItem value={o.v} className="sr-only" />
                      <div className={cn('h-2 w-2 rounded-full', prefs.dateFormat === o.v ? 'bg-primary' : 'bg-border')} />
                      {o.label}
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" /> Language</Label>
                <RadioGroup
                  value={prefs.language}
                  onValueChange={(v) => updatePrefs({ language: v as Preferences['language'] })}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { v: 'en', label: 'English' },
                    { v: 'hi', label: 'हिन्दी (Hindi)' },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer text-sm',
                        prefs.language === o.v ? 'border-primary bg-primary-soft/40' : 'hover:bg-secondary',
                      )}
                    >
                      <RadioGroupItem value={o.v} className="sr-only" />
                      <div className={cn('h-2 w-2 rounded-full', prefs.language === o.v ? 'bg-primary' : 'bg-border')} />
                      {o.label}
                    </label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">UI translation coming soon.</p>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <RadioGroup
                  value={prefs.currency}
                  onValueChange={(v) => {
                    updatePrefs({ currency: v as Preferences['currency'] })
                    if (user?.id) {
                      updateUser({ variables: { id: user.id, input: { currency: v } } })
                    }
                    if (typeof window !== 'undefined') window.location.reload()
                  }}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { v: 'INR', label: '₹ Rupee (INR)' },
                    { v: 'USD', label: '$ US Dollar (USD)' },
                    { v: 'SGD', label: 'S$ Singapore Dollar (SGD)' },
                    { v: 'MYR', label: 'RM Malaysian Ringgit (MYR)' },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer text-sm',
                        prefs.currency === o.v ? 'border-primary bg-primary-soft/40' : 'hover:bg-secondary',
                      )}
                    >
                      <RadioGroupItem value={o.v} className="sr-only" />
                      <div className={cn('h-2 w-2 rounded-full', prefs.currency === o.v ? 'bg-primary' : 'bg-border')} />
                      {o.label}
                    </label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Applies to all monetary fields. Changing reloads the page.
                </p>
              </div>
              <div className="space-y-3">
                <Label>Stat card decorations</Label>
                <div className="space-y-2">
                  <SwitchRow
                    label="Show sparklines on stat cards"
                    checked={prefs.showSparklines}
                    onChange={(c) => updatePrefs({ showSparklines: c })}
                  />
                  <SwitchRow
                    label="Show delta % trends"
                    checked={prefs.showDeltas}
                    onChange={(c) => updatePrefs({ showDeltas: c })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 text-xs">
              <CheckCircle2 className="h-4 w-4" />
              Density, date format and stat card decorations save locally to your browser.
            </div>
          </SectionCard>

          <SectionCard
            title="Dashboard customization"
            description="Choose which widgets appear on your dashboards and drag them into the order you want."
          >
            <DashboardCustomizationCard availableDashboards={availableDashboards} />
          </SectionCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <SectionCard title="What you get notified about" description="Toggle which alerts show in your inbox">
            <div className="grid gap-3 sm:grid-cols-2">
              <SwitchRow label="Low stock & out-of-stock items" checked={notifPrefs.lowStock} onChange={(c) => updateNotifs({ lowStock: c })} />
              <SwitchRow label="Overdue customer invoices" checked={notifPrefs.overdueInvoices} onChange={(c) => updateNotifs({ overdueInvoices: c })} />
              <SwitchRow label="Vendor bills due soon" checked={notifPrefs.billsDue} onChange={(c) => updateNotifs({ billsDue: c })} />
              <SwitchRow label="Approval requests assigned to me" checked={notifPrefs.approvals} onChange={(c) => updateNotifs({ approvals: c })} />
              <SwitchRow label="New leads" checked={notifPrefs.newLeads} onChange={(c) => updateNotifs({ newLeads: c })} />
              <SwitchRow label="Daily email digest (coming soon)" checked={notifPrefs.emailDigest} onChange={(c) => updateNotifs({ emailDigest: c })} disabled />
            </div>
          </SectionCard>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <SectionCard title="Password" description="Change your account password">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast.info('Password change requires an administrator. Please contact your organization admin.')
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" autoComplete="current-password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" autoComplete="new-password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm</Label>
                <Input id="confirm" type="password" autoComplete="new-password" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" className="bg-grad-brand text-white border-none">Update password</Button>
              </div>
            </form>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-900 px-3 py-2 text-xs">
              <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
              Self-service password change is not yet enabled in this build — contact your administrator to rotate your password.
            </div>
          </SectionCard>

          <SectionCard title="Sessions" description="Active sessions on this account">
            <div className="rounded-xl border border-border bg-secondary/30 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Current session</p>
                <p className="text-xs text-muted-foreground">This browser · just now</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] uppercase font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Organization */}
        <TabsContent value="organization" className="mt-6 space-y-6">
          <SectionCard title="Your organization" description="Read-only tenant information">
            {!org ? (
              <p className="text-sm text-muted-foreground">No organization linked to this account.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <Info label="Name" value={org.name} />
                <Info label="Code" value={org.code} mono />
                <Info label="Email" value={org.email} />
                <Info label="Phone" value={org.phone} />
                <Info label="Status" value={String(org.status || '').toUpperCase()} />
                <Info label="Created" value={org.createdAt ? formatDate(org.createdAt) : '—'} />
                <Info label="Address" value={org.address} colSpan />
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Module access */}
        <TabsContent value="access" className="mt-6 space-y-6">
          <SectionCard title="Your module access" description="What you can do in each module" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                    <th className="px-5 py-3 font-medium">Module</th>
                    <th className="px-3 py-3 font-medium text-center">View</th>
                    <th className="px-3 py-3 font-medium text-center">Create</th>
                    <th className="px-3 py-3 font-medium text-center">Update</th>
                    <th className="px-5 py-3 font-medium text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {ERP_MODULE_DEFINITIONS.map((m) => {
                    const p = permMap[m.key] ?? { canView: false, canCreate: false, canUpdate: false, canDelete: false }
                    return (
                      <tr key={m.key} className="border-b last:border-0 hover:bg-secondary/30">
                        <td className="px-5 py-3 font-medium">{m.label}</td>
                        <PermCell on={p.canView} />
                        <PermCell on={p.canCreate} />
                        <PermCell on={p.canUpdate} />
                        <PermCell on={p.canDelete} />
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SwitchRow({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={cn('flex items-center justify-between gap-3 rounded-lg border bg-card p-3', disabled && 'opacity-60')}>
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </label>
  )
}

function Info({ label, value, mono, colSpan }: { label: string; value?: string | null; mono?: boolean; colSpan?: boolean }) {
  return (
    <div className={cn('space-y-1', colSpan && 'sm:col-span-2')}>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className={cn('text-sm', mono && 'font-mono')}>{value || '—'}</p>
    </div>
  )
}

function LayoutPreviewCard({
  value,
  current,
  onSelect,
  label,
  description,
}: {
  value: LayoutMode
  current: LayoutMode
  onSelect: (v: LayoutMode) => void
  label: string
  description: string
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'group rounded-2xl border p-4 text-left transition-all',
        active
          ? 'border-primary ring-2 ring-primary/40 bg-primary-soft/30 elev-2'
          : 'border-border bg-card hover:elev-2 hover:border-primary/40',
      )}
    >
      {/* Mini preview */}
      <div className="rounded-xl border border-border overflow-hidden bg-secondary/40">
        {value === 'sidebar' ? (
          <div className="flex h-28">
            <div className="w-1/3 bg-grad-slate p-2 space-y-1">
              <div className="h-2 w-3/4 bg-white/30 rounded" />
              <div className="h-1.5 w-full bg-white/15 rounded mt-2" />
              <div className="h-1.5 w-full bg-white/25 rounded" />
              <div className="h-1.5 w-2/3 bg-white/15 rounded" />
              <div className="h-1.5 w-3/4 bg-white/15 rounded" />
            </div>
            <div className="flex-1 p-2 space-y-1">
              <div className="h-3 bg-white rounded shadow-sm" />
              <div className="grid grid-cols-3 gap-1 mt-1">
                <div className="h-5 bg-white rounded shadow-sm" />
                <div className="h-5 bg-white rounded shadow-sm" />
                <div className="h-5 bg-white rounded shadow-sm" />
              </div>
              <div className="h-8 bg-white rounded shadow-sm mt-1" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-28">
            <div className="h-3 bg-grad-slate" />
            <div className="h-3 bg-white border-b border-border flex items-center px-1.5 gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-1.5 w-5 bg-foreground/30 rounded" />
              ))}
            </div>
            <div className="flex-1 p-2 space-y-1">
              <div className="grid grid-cols-4 gap-1">
                <div className="h-6 bg-white rounded shadow-sm" />
                <div className="h-6 bg-white rounded shadow-sm" />
                <div className="h-6 bg-white rounded shadow-sm" />
                <div className="h-6 bg-white rounded shadow-sm" />
              </div>
              <div className="h-6 bg-white rounded shadow-sm" />
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded-full border-2',
            active ? 'border-primary' : 'border-border',
          )}
        >
          {active && <span className="h-2 w-2 rounded-full bg-primary" />}
        </span>
        <p className="text-sm font-semibold">{label}</p>
        {active && <span className="ml-auto text-[10px] uppercase tracking-wider text-primary font-semibold">Selected</span>}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  )
}

function PermCell({ on }: { on?: boolean }) {
  return (
    <td className="px-3 py-3 text-center">
      {on ? (
        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-secondary text-muted-foreground">—</span>
      )}
    </td>
  )
}
