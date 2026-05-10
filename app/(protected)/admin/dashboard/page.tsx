'use client'

import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_ORGANIZATIONS,
  CREATE_ORGANIZATION_WITH_ORG_ADMIN,
} from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Building2, LogOut, Shield, ExternalLink } from 'lucide-react'

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()
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
    variables: { page: 1, limit: 200, search: null },
    fetchPolicy: 'network-only',
  })

  const [runBootstrap, { loading: saving }] = useMutation(CREATE_ORGANIZATION_WITH_ORG_ADMIN, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Organization and organization admin created.' })
      setOrgForm({
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        type: '',
      })
      setAdminForm({ email: '', firstName: '', lastName: '', password: '' })
      setTimeout(() => setBanner(null), 5000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

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

    const organization: Record<string, unknown>  = {
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

  const rows = data?.organizations ?? []

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-2 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Platform</p>
            <h1 className="text-lg font-bold text-slate-900">Administration</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>
            {user?.firstName} {user?.lastName}
          </span>
          <Button variant="outline" size="sm" onClick={() => logout()} className="gap-1">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {banner && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              banner.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/dashboard" className="gap-1 inline-flex items-center">
              <ExternalLink className="h-4 w-4" />
              Open ERP dashboard
            </Link>
          </Button>
        </div>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-50 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">New tenant organization</h2>
          </div>
          <form onSubmit={submit} className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Organization</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ad-name">Legal / display name *</Label>
                  <Input
                    id="ad-name"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-code">Code</Label>
                  <Input
                    id="ad-code"
                    value={orgForm.code}
                    onChange={(e) => setOrgForm((f) => ({ ...f, code: e.target.value }))}
                    placeholder="Short unique code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-type">Type (client / vendor / both)</Label>
                  <Input
                    id="ad-type"
                    value={orgForm.type}
                    onChange={(e) => setOrgForm((f) => ({ ...f, type: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-email">Email</Label>
                  <Input
                    id="ad-email"
                    type="email"
                    value={orgForm.email}
                    onChange={(e) => setOrgForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-phone">Phone</Label>
                  <Input
                    id="ad-phone"
                    value={orgForm.phone}
                    onChange={(e) => setOrgForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ad-contact">Contact person</Label>
                  <Input
                    id="ad-contact"
                    value={orgForm.contactPerson}
                    onChange={(e) => setOrgForm((f) => ({ ...f, contactPerson: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ad-address">Address</Label>
                  <Input
                    id="ad-address"
                    value={orgForm.address}
                    onChange={(e) => setOrgForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                First organization administrator
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                This user receives the <strong>ORG_ADMIN</strong> role and can create staff for this
                tenant only.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ad-admin-email">Email *</Label>
                  <Input
                    id="ad-admin-email"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-admin-pass">Temporary password *</Label>
                  <Input
                    id="ad-admin-pass"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm((f) => ({ ...f, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-fn">First name *</Label>
                  <Input
                    id="ad-fn"
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm((f) => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
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

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                {saving ? 'Creating…' : 'Create organization + admin'}
              </Button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-50">
            <h2 className="font-semibold text-slate-900">Organizations</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No organizations yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase">Name</TableHead>
                  <TableHead className="text-xs uppercase">Code</TableHead>
                  <TableHead className="text-xs uppercase">Email</TableHead>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((o: { id: string; name: string; code?: string; email?: string; status: string }) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.name}</TableCell>
                    <TableCell className="font-mono text-sm">{o.code || '—'}</TableCell>
                    <TableCell className="text-sm">{o.email || '—'}</TableCell>
                    <TableCell className="text-sm capitalize">{o.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  )
}
