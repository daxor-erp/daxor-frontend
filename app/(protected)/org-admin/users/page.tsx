'use client'

import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { GET_USERS, CREATE_USER, DELETE_USER } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ORG_ADMIN_ASSIGNABLE_ROLES } from '@/lib/rbac/permissions'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'

const ROLE_OPTIONS = ORG_ADMIN_ASSIGNABLE_ROLES.map((r) => ({
  value: r,
  label: r.replace(/_/g, ' '),
}))

export default function OrgAdminUsersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: ORG_ADMIN_ASSIGNABLE_ROLES[0] ?? 'SALES_MANAGER',
  })

  const { data, loading, refetch } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      setForm({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: ORG_ADMIN_ASSIGNABLE_ROLES[0] ?? 'SALES_MANAGER',
      })
      setBanner({ ok: true, text: 'User created.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'User removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const rows = data?.usersByOrganization?.users ?? []

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    if (!form.email.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      setBanner({ ok: false, text: 'Fill in email and name.' })
      return
    }
    if (!form.password || form.password.length < 6) {
      setBanner({ ok: false, text: 'Password must be at least 6 characters.' })
      return
    }
    createUser({
      variables: {
        input: {
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          password: form.password,
          organizationId: orgId,
          roles: [form.role],
        },
      },
    })
  }

  if (!orgId) {
    return (
      <div className="erp-shell">
        <p className="text-sm text-slate-600">No organization on this account.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="gap-1 -ml-2 text-slate-600">
            <Link href="/org-admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <h1 className="erp-page-title">Users in your organization</h1>
        </div>
      </div>

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

      <div className="flex justify-end">
        <Button onClick={() => setOpen((o) => !o)} className="bg-teal-600 hover:bg-teal-700 gap-1">
          <Plus className="h-4 w-4" />
          New user
        </Button>
      </div>

      {open && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">Create user</span>
            <button
              type="button"
              className="text-primary-foreground/80 hover:text-white text-sm"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="p-4 space-y-3 grid sm:grid-cols-2 gap-3">
            <InputFloating
              id="ou-email"
              label="Email"
              type="email"
              className="h-8 text-xs"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <InputFloating
              id="ou-pass"
              label="Password"
              type="password"
              className="h-8 text-xs"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
            <InputFloating
              id="ou-fn"
              label="First name"
              className="h-8 text-xs"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            />
            <InputFloating
              id="ou-ln"
              label="Last name"
              className="h-8 text-xs"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            />
            <div className="sm:col-span-2">
              <SelectFloating
                label="Role"
                name="ou-role"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: (e as React.ChangeEvent<HTMLSelectElement>).target.value,
                  }))
                }
                options={ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                className="h-8 text-xs"
                placeholder="Role"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="button"
                size="sm"
                className="bg-primary hover:bg-primary/90"
                disabled={creating}
                onClick={submit}
              >
                {creating ? 'Saving…' : 'Create user'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500 text-sm">Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50">
                <TableHead className="text-xs uppercase">User</TableHead>
                <TableHead className="text-xs uppercase">Roles</TableHead>
                <TableHead className="text-xs uppercase">Status</TableHead>
                <TableHead className="text-xs uppercase w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(
                (u: {
                  id: string
                  email: string
                  firstName: string
                  lastName: string
                  roles?: string[]
                  status: string
                }) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {(u.roles ?? []).join(', ') || '—'}
                    </TableCell>
                    <TableCell className="text-sm capitalize">{u.status}</TableCell>
                    <TableCell>
                      {u.id !== user?.id ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            if (
                              confirm(
                                `Remove user ${u.email}? They will not be able to sign in.`,
                              )
                            ) {
                              deleteUser({ variables: { id: u.id } })
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">You</span>
                      )}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
