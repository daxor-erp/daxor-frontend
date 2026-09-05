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
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { DataTable, type Column } from '@/components/DataTable'
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
import { Building2, Pencil, Trash2, CheckCircle2, AlertCircle, Plus, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const stats = useMemo(() => {
    const total = orgs.length
    const active = orgs.filter((o) => String(o.status).toUpperCase() === 'ACTIVE').length
    const pending = orgs.filter((o) => String(o.status).toUpperCase() === 'PENDING').length
    const suspended = orgs.filter((o) => String(o.status).toUpperCase() === 'SUSPENDED').length
    return { total, active, pending, suspended }
  }, [orgs])

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (v) => <span className="text-sm font-medium">{v}</span>,
    },
    { key: 'code', label: 'Code', width: '110px', render: (v) => <MonoCell value={v || '—'} /> },
    { key: 'email', label: 'Email', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '120px', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Organizations"
        subtitle="Manage tenant organizations across the platform. Create an organization, then add its admin."
        icon={<Building2 className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Organizations' }]}
        actions={
          <Button onClick={() => setCreatingOrg(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
            <Plus className="h-4 w-4" />
            New organization
          </Button>
        }
      />

      {banner && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm mb-4',
            banner.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800',
          )}
        >
          {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {banner.text}
        </div>
      )}

      <StatsRow cols={4}>
        <StatCard label="Total" value={stats.total} icon={<Building2 className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Pending" value={stats.pending} icon={<AlertCircle className="h-5 w-5" />} variant="amber" />
        <StatCard label="Suspended" value={stats.suspended} icon={<AlertCircle className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <DataTable
        data={orgs}
        columns={columns}
        loading={loading}
        title="All Organizations"
        searchable
        searchPlaceholder="Search by name, code, email…"
        emptyMessage="No organizations yet."
        pageSize={25}
        onRowClick={(o) => setEditing(o)}
        actions={[
          {
            label: 'Add admin',
            icon: <UserPlus className="h-3.5 w-3.5" />,
            onClick: (o) => setAddingAdminFor(o),
          },
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (o) => setEditing(o),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (o) => setDeleting(o),
          },
        ]}
      />

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
          >
            {saving ? 'Creating…' : 'Create admin'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
