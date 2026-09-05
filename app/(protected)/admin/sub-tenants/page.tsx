'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputFloating } from '@/components/ui/input-floating'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Building2, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { GET_ORGANIZATION } from '@/gql/queries'
import {
  GET_SUB_TENANTS,
  CREATE_SUB_TENANT_WITH_ADMIN,
} from '@/gql/queries'

export default function SubTenantsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
    adminPassword: '',
  })

  const { data: orgData } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
  })
  const parentOrg = orgData?.organization
  const allowed = Boolean(parentOrg?.allowSubTenants)

  const { data, loading, refetch } = useQuery(GET_SUB_TENANTS, {
    variables: { parentOrganizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createSubTenant, { loading: saving }] = useMutation(CREATE_SUB_TENANT_WITH_ADMIN, {
    onCompleted: () => {
      toast.success('Sub-tenant created')
      setOpen(false)
      setForm({ name: '', email: '', phone: '', adminEmail: '', adminFirstName: '', adminLastName: '', adminPassword: '' })
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const submit = () => {
    if (!form.name.trim() || !form.adminEmail.trim() || !form.adminPassword) {
      toast.error('Name, admin email, password are required')
      return
    }
    createSubTenant({
      variables: {
        input: {
          organization: {
            name: form.name.trim(),
            email: form.email.trim() || undefined,
            phone: form.phone.trim() || undefined,
          },
          orgAdmin: {
            email: form.adminEmail.trim().toLowerCase(),
            firstName: form.adminFirstName.trim() || 'Org',
            lastName: form.adminLastName.trim() || 'Admin',
            password: form.adminPassword,
          },
        },
      },
    })
  }

  const rows: any[] = data?.subTenants ?? []

  return (
    <div className="erp-shell">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Building2 className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Admin · Multi-tenant</span>
          </div>
          <h1 className="erp-page-title">Sub-tenants</h1>
          <p className="text-gray-500 text-sm">
            Tenant organizations created under <span className="font-medium">{parentOrg?.name ?? 'your org'}</span>. Each
            sub-tenant has its own data, users, and admin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={!allowed}>
          <Plus className="h-4 w-4 mr-2" /> New sub-tenant
        </Button>
      </div>

      {!allowed ? (
        <Card>
          <CardContent className="p-6 bg-amber-50 border-amber-200 border text-amber-800 text-sm rounded">
            <strong>Sub-tenants are not enabled</strong> for your organization. A platform admin
            (SUPER_ADMIN / ERP_ADMIN) must turn on <code>allowSubTenants</code> on your org first.
          </CardContent>
        </Card>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden max-w-2xl">
          <DialogHeader><DialogTitle>New sub-tenant</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto">
            <div className="border rounded p-3 space-y-3">
              <p className="text-sm font-medium flex items-center gap-1.5"><Building2 className="h-4 w-4" /> Organization</p>
              <div className="grid grid-cols-2 gap-3">
                <InputFloating label="Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                <InputFloating label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                <InputFloating label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <p className="text-xs text-muted-foreground">Code will be auto-generated (e.g. ORG-0042).</p>
            </div>
            <div className="border rounded p-3 space-y-3">
              <p className="text-sm font-medium flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Admin user for this tenant</p>
              <div className="grid grid-cols-2 gap-3">
                <InputFloating label="Admin email *" value={form.adminEmail} onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))} />
                <InputFloating label="Admin password *" type="password" value={form.adminPassword} onChange={(e) => setForm((f) => ({ ...f, adminPassword: e.target.value }))} />
                <InputFloating label="First name" value={form.adminFirstName} onChange={(e) => setForm((f) => ({ ...f, adminFirstName: e.target.value }))} />
                <InputFloating label="Last name" value={form.adminLastName} onChange={(e) => setForm((f) => ({ ...f, adminLastName: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving ? 'Creating…' : 'Create sub-tenant'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>Sub-tenants ({rows.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-500">No sub-tenants yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Allows sub-tenants?</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="font-mono text-xs">{r.code ?? '—'}</TableCell>
                    <TableCell className="text-xs">{r.email ?? '—'}</TableCell>
                    <TableCell>
                      {r.allowSubTenants ? <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200">Yes</Badge> : <span className="text-gray-400">No</span>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                    <TableCell className="text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
