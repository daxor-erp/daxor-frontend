'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_ORGANIZATIONS,
  UPDATE_ORGANIZATION,
  DELETE_ORGANIZATION,
  CREATE_ORGANIZATION,
  CREATE_USER,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Building2, Search, Pencil, Trash2, CheckCircle2, AlertCircle, Plus, UserPlus } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'

const STATUS_TONE: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200',
  INACTIVE: 'bg-slate-100 text-slate-700 border-slate-200',
  DELETED: 'bg-rose-50 text-rose-700 border-rose-200',
}

interface OrgRow {
  id: string
  seqNo?: string | null
  name: string
  code?: string | null
  email?: string | null
  phone?: string | null
  status: string
  parentOrganizationId?: string | null
  allowSubTenants?: boolean
  createdAt: string
}

export default function AdminOrganizationsPage() {
  const [search, setSearch] = useState('')
  const [creatingOrg, setCreatingOrg] = useState(false)
  const [addingAdminFor, setAddingAdminFor] = useState<OrgRow | null>(null)
  const [editing, setEditing] = useState<OrgRow | null>(null)
  const [deleting, setDeleting] = useState<OrgRow | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)

  const { data, loading, refetch } = useQuery(GET_ORGANIZATIONS, {
    fetchPolicy: 'cache-and-network',
  })
  const [createOrg, { loading: creating }] = useMutation(CREATE_ORGANIZATION, {
    onCompleted: (d) => {
      setBanner({ ok: true, text: `Created organization "${d?.createOrganization?.name}". Now add an admin from the row actions.` })
      setCreatingOrg(false)
      refetch()
    },
    onError: (err) => setBanner({ ok: false, text: err.message }),
  })
  const [createUser, { loading: creatingAdmin }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setBanner({ ok: true, text: `Admin created for ${addingAdminFor?.name}.` })
      setAddingAdminFor(null)
    },
    onError: (err) => setBanner({ ok: false, text: err.message }),
  })
  const [updateOrg, { loading: saving }] = useMutation(UPDATE_ORGANIZATION, {
    onCompleted: () => {
      setBanner({ ok: true, text: 'Organization updated.' })
      setEditing(null)
      refetch()
    },
    onError: (err) => setBanner({ ok: false, text: err.message }),
  })
  const [deleteOrg, { loading: deletingPending }] = useMutation(DELETE_ORGANIZATION, {
    onCompleted: () => {
      setBanner({ ok: true, text: 'Organization deleted.' })
      setDeleting(null)
      refetch()
    },
    onError: (err) => setBanner({ ok: false, text: err.message }),
  })

  const orgs: OrgRow[] = data?.organizations ?? []
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orgs
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
    const suspended = orgs.filter((o) => String(o.status).toUpperCase() === 'SUSPENDED').length
    return { total, active, pending, suspended }
  }, [orgs])

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title="Organizations"
          description="Manage tenant organizations across the platform. Create an organization, then add its admin."
        />
        <Button onClick={() => setCreatingOrg(true)} className="bg-grad-brand text-white border-none gap-1.5 mt-1 shrink-0">
          <Plus className="h-4 w-4" />
          New organization
        </Button>
      </div>

      {banner && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm',
            banner.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800',
          )}
        >
          {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {banner.text}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total" value={stats.total} tone="brand" />
        <StatTile label="Active" value={stats.active} tone="emerald" />
        <StatTile label="Pending" value={stats.pending} tone="warn" />
        <StatTile label="Suspended" value={stats.suspended} tone="rose" />
      </div>

      <SectionCard
        title="All organizations"
        description={`${filtered.length} of ${orgs.length} shown`}
        action={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, email…"
              className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-64"
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Phone</th>
                  <th className="px-3 py-3 font-medium">Created</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-grad-brand text-white grid place-items-center font-semibold text-xs uppercase shrink-0">
                          {(o.name || '?').slice(0, 2)}
                        </div>
                        <span className="font-medium">{o.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{o.code || '—'}</td>
                    <td className="px-3 py-3 text-xs">{o.email || '—'}</td>
                    <td className="px-3 py-3 text-xs">{o.phone || '—'}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                          STATUS_TONE[String(o.status).toUpperCase()] || STATUS_TONE.INACTIVE,
                        )}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setAddingAdminFor(o)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-primary hover:bg-primary-soft"
                          aria-label={`Add admin to ${o.name}`}
                        >
                          <UserPlus className="h-3 w-3" />
                          Add admin
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(o)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
                          aria-label={`Edit ${o.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(o)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                          aria-label={`Delete ${o.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <CreateOrgDialog
        open={creatingOrg}
        saving={creating}
        onClose={() => setCreatingOrg(false)}
        onSave={(input) => createOrg({ variables: { input } })}
      />

      <AddOrgAdminDialog
        org={addingAdminFor}
        saving={creatingAdmin}
        onClose={() => setAddingAdminFor(null)}
        onSave={(input) => addingAdminFor && createUser({ variables: { input: { ...input, organizationId: addingAdminFor.id, roles: ['ORG_ADMIN'] } } })}
      />

      <EditOrgDialog
        org={editing}
        saving={saving}
        onClose={() => setEditing(null)}
        onSave={(input) => editing && updateOrg({ variables: { id: editing.id, input } })}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete organization?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name} will be removed. Users in this organization will lose access. This cannot be undone from the UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deletingPending}
              onClick={() => deleting && deleteOrg({ variables: { id: deleting.id } })}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deletingPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'brand' | 'emerald' | 'warn' | 'rose'
}) {
  const toneCls: Record<string, string> = {
    brand: 'bg-primary-soft text-primary',
    emerald: 'bg-emerald-50 text-emerald-600',
    warn: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  }
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className={cn('rounded-lg p-2.5', toneCls[tone])}>
        <Building2 className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  )
}

function EditOrgDialog({
  org,
  saving,
  onClose,
  onSave,
}: {
  org: OrgRow | null
  saving: boolean
  onClose: () => void
  onSave: (input: { name?: string; email?: string; phone?: string; status?: string; address?: string; allowSubTenants?: boolean }) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'ACTIVE', address: '', allowSubTenants: false })

  // Sync form when org changes
  if (org && form.name !== org.name && !saving) {
    // shallow-init only when opening a different row
    queueMicrotask(() =>
      setForm({
        name: org.name ?? '',
        email: org.email ?? '',
        phone: org.phone ?? '',
        status: String(org.status || 'ACTIVE').toUpperCase(),
        address: '',
        allowSubTenants: Boolean(org.allowSubTenants),
      }),
    )
  }

  return (
    <Dialog open={!!org} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {org?.name ?? 'organization'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Name</Label>
            <Input id="org-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="org-email">Email</Label>
              <Input id="org-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-phone">Phone</Label>
              <Input id="org-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-status">Status</Label>
            <select
              id="org-status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer bg-secondary/30 hover:bg-secondary/50">
            <input
              type="checkbox"
              checked={form.allowSubTenants}
              onChange={(e) => setForm((f) => ({ ...f, allowSubTenants: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-border"
            />
            <div>
              <p className="text-sm font-medium">Allow multi-tenant (sub-tenants)</p>
              <p className="text-xs text-muted-foreground">
                When enabled, this organization's ORG_ADMIN can create child tenant organizations
                from <code>/admin/sub-tenants</code>.
              </p>
            </div>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            disabled={saving}
            onClick={() => onSave({ name: form.name, email: form.email, phone: form.phone, status: form.status, allowSubTenants: form.allowSubTenants })}
            className="bg-grad-brand text-white border-none"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateOrgDialog({
  open,
  saving,
  onClose,
  onSave,
}: {
  open: boolean
  saving: boolean
  onClose: () => void
  onSave: (input: { name: string; code?: string; email?: string; phone?: string; address?: string; type?: string; contactPerson?: string }) => void
}) {
  const [form, setForm] = useState({ name: '', code: '', email: '', phone: '', address: '', type: '', contactPerson: '' })
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          onClose()
          setForm({ name: '', code: '', email: '', phone: '', address: '', type: '', contactPerson: '' })
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New organization</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1">Creates an empty tenant. You can add the first admin from the row actions afterwards.</p>
        <div className="grid gap-3 py-2 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="cn-name">Legal / display name *</Label>
            <Input id="cn-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cn-code">Code</Label>
            <Input id="cn-code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="Short unique code" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cn-type">Type</Label>
            <Input id="cn-type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="client / vendor / both" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cn-email">Email</Label>
            <Input id="cn-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cn-phone">Phone</Label>
            <Input id="cn-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="cn-contact">Contact person</Label>
            <Input id="cn-contact" value={form.contactPerson} onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="cn-address">Address</Label>
            <Input id="cn-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            disabled={saving || !form.name.trim()}
            onClick={() => {
              const input: any = { name: form.name.trim() }
              if (form.code.trim()) input.code = form.code.trim()
              if (form.email.trim()) input.email = form.email.trim()
              if (form.phone.trim()) input.phone = form.phone.trim()
              if (form.address.trim()) input.address = form.address.trim()
              if (form.type.trim()) input.type = form.type.trim()
              if (form.contactPerson.trim()) input.contactPerson = form.contactPerson.trim()
              onSave(input)
            }}
            className="bg-grad-brand text-white border-none"
          >
            {saving ? 'Creating…' : 'Create organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddOrgAdminDialog({
  org,
  saving,
  onClose,
  onSave,
}: {
  org: OrgRow | null
  saving: boolean
  onClose: () => void
  onSave: (input: { email: string; firstName: string; lastName: string; password: string }) => void
}) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' })
  return (
    <Dialog
      open={!!org}
      onOpenChange={(o) => {
        if (!o) {
          onClose()
          setForm({ email: '', firstName: '', lastName: '', password: '' })
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add admin to {org?.name ?? 'organization'}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1">Creates a user with the <strong>ORG_ADMIN</strong> role for this organization.</p>
        <div className="grid gap-3 py-2 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="aa-fn">First name *</Label>
            <Input id="aa-fn" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="aa-ln">Last name *</Label>
            <Input id="aa-ln" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="aa-email">Email *</Label>
            <Input id="aa-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="aa-pass">Temporary password *</Label>
            <Input id="aa-pass" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            <p className="text-[11px] text-muted-foreground">Send this to the admin out-of-band; they should change it on first login.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            disabled={saving || !form.email || !form.firstName || !form.lastName || !form.password}
            onClick={() => onSave({ email: form.email.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), password: form.password })}
            className="bg-grad-brand text-white border-none"
          >
            {saving ? 'Creating…' : 'Create admin'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
