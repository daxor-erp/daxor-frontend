'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_ROLES_BY_ORGANIZATION,
  CREATE_ROLE,
  DELETE_ROLE,
  CREATE_USER,
} from '@/gql/queries'
import { ORG_ADMIN_ASSIGNABLE_ROLES } from '@/lib/rbac/permissions'
import { ORG_TENANT_ROLE_RESOURCE_OPTIONS } from '@/lib/org-tenant-role-resources'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

const ACTIONS = ['create', 'update', 'delete', 'read'] as const

type ActionKey = (typeof ACTIONS)[number]

function emptyPermState(): Record<string, Set<ActionKey>> {
  const r: Record<string, Set<ActionKey>> = {}
  for (const { resource } of ORG_TENANT_ROLE_RESOURCE_OPTIONS) {
    r[resource] = new Set()
  }
  return r
}

export default function OrgAdminUsersAndCustomRolesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)

  const [roleForm, setRoleForm] = useState({
    name: '',
    displayName: '',
    description: '',
  })
  const [permCells, setPermCells] = useState(emptyPermState)

  const [userForm, setUserForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: ORG_ADMIN_ASSIGNABLE_ROLES[0] ?? 'SALES_MANAGER',
  })

  const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useQuery(
    GET_ROLES_BY_ORGANIZATION,
    {
      variables: { organizationId: orgId },
      skip: !orgId,
      fetchPolicy: 'network-only',
    },
  )

  const tenantRoles = useMemo(
    () => (rolesData?.rolesByOrganization ?? []).filter((r: { isSystemRole?: boolean }) => !r.isSystemRole),
    [rolesData?.rolesByOrganization],
  )

  const roleSelectOptions = useMemo(() => {
    const builtIns = ORG_ADMIN_ASSIGNABLE_ROLES.map((r) => ({
      value: r,
      label: `Standard: ${r.replace(/_/g, ' ')}`,
    }))
    const customs = tenantRoles.map((r: { name: string; displayName: string }) => ({
      value: r.name,
      label: `Custom: ${r.displayName} (${r.name})`,
    }))
    return [...builtIns, ...customs]
  }, [tenantRoles])

  const [createRole, { loading: creatingRole }] = useMutation(CREATE_ROLE, {
    onCompleted: () => {
      void refetchRoles()
      setRoleForm({ name: '', displayName: '', description: '' })
      setPermCells(emptyPermState())
      setBanner({ ok: true, text: 'Custom role created.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const [deleteRole] = useMutation(DELETE_ROLE, {
    onCompleted: () => {
      void refetchRoles()
      setBanner({ ok: true, text: 'Role removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const [createUser, { loading: creatingUser }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setUserForm({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: ORG_ADMIN_ASSIGNABLE_ROLES[0] ?? 'SALES_MANAGER',
      })
      setBanner({ ok: true, text: 'User created. They appear on the Users page.' })
      setTimeout(() => setBanner(null), 5000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const togglePerm = (resource: string, action: ActionKey, checked: boolean) => {
    setPermCells((prev) => {
      const next = { ...prev, [resource]: new Set(prev[resource]) }
      const row = next[resource]!
      if (!checked) {
        row.delete(action)
      } else {
        row.add(action)
      }
      return next
    })
  }

  const submitRole = () => {
    setBanner(null)
    if (!orgId) return
    const permissions = ORG_TENANT_ROLE_RESOURCE_OPTIONS.map(({ resource }) => {
      const actions = Array.from(permCells[resource] ?? [])
      if (!actions.length) return null
      return { resource, actions: [...actions] }
    }).filter(Boolean) as { resource: string; actions: string[] }[]

    if (!roleForm.name.trim() || !roleForm.displayName.trim()) {
      setBanner({ ok: false, text: 'Role key and display name are required.' })
      return
    }
    if (!permissions.length) {
      setBanner({ ok: false, text: 'Select at least one permission.' })
      return
    }

    void createRole({
      variables: {
        input: {
          name: roleForm.name.trim().toUpperCase().replace(/\s+/g, '_'),
          displayName: roleForm.displayName.trim(),
          description: roleForm.description.trim() || null,
          permissions,
        },
      },
    })
  }

  const submitUser = () => {
    setBanner(null)
    if (!orgId) return
    if (!userForm.email.trim() || !userForm.firstName.trim() || !userForm.lastName.trim()) {
      setBanner({ ok: false, text: 'Fill in email and name.' })
      return
    }
    if (!userForm.password || userForm.password.length < 6) {
      setBanner({ ok: false, text: 'Password must be at least 6 characters.' })
      return
    }
    void createUser({
      variables: {
        input: {
          email: userForm.email.trim(),
          firstName: userForm.firstName.trim(),
          lastName: userForm.lastName.trim(),
          password: userForm.password,
          organizationId: orgId,
          roles: [userForm.role],
        },
      },
    })
  }

  if (!orgId) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-600">No organization on this account.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="gap-1 -ml-2 text-slate-600">
            <Link href="/org-admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Users &amp; custom roles</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Define tenant-specific roles with API permissions, then assign them when creating users. Standard role
            templates stay available. Existing users are unchanged and still listed on the{' '}
            <Link href="/org-admin/users" className="text-teal-700 underline">
              Users
            </Link>{' '}
            page.
          </p>
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

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-900">Custom roles for your organization</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Names must be UPPER_SNAKE_CASE and cannot match a built-in template (e.g. SALES_MANAGER).
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <InputFloating
              id="cr-name"
              label="Role key (e.g. REGIONAL_LEAD)"
              className="h-8 text-xs"
              value={roleForm.name}
              onChange={(e) => setRoleForm((f) => ({ ...f, name: e.target.value }))}
            />
            <InputFloating
              id="cr-dn"
              label="Display name"
              className="h-8 text-xs"
              value={roleForm.displayName}
              onChange={(e) => setRoleForm((f) => ({ ...f, displayName: e.target.value }))}
            />
            <div className="sm:col-span-2">
              <InputFloating
                id="cr-desc"
                label="Description (optional)"
                className="h-8 text-xs"
                value={roleForm.description}
                onChange={(e) => setRoleForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden max-h-[340px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs font-semibold w-[200px]">Resource</TableHead>
                  {ACTIONS.map((a) => (
                    <TableHead key={a} className="text-xs font-semibold text-center capitalize w-20">
                      {a}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORG_TENANT_ROLE_RESOURCE_OPTIONS.map(({ resource, label }) => (
                  <TableRow key={resource}>
                    <TableCell className="text-xs font-medium text-slate-800">{label}</TableCell>
                    {ACTIONS.map((action) => (
                      <TableCell key={action} className="text-center">
                        <Checkbox
                          checked={permCells[resource]?.has(action) ?? false}
                          onCheckedChange={(v) => togglePerm(resource, action, v === true)}
                          className="mx-auto"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 gap-1"
              disabled={creatingRole}
              onClick={() => void submitRole()}
            >
              <Plus className="h-4 w-4" />
              {creatingRole ? 'Saving…' : 'Save custom role'}
            </Button>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">Saved tenant roles</h3>
            {rolesLoading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : tenantRoles.length === 0 ? (
              <p className="text-sm text-slate-500">No custom roles yet.</p>
            ) : (
              <div className="rounded-lg border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-xs uppercase">Key</TableHead>
                      <TableHead className="text-xs uppercase">Display name</TableHead>
                      <TableHead className="text-xs uppercase w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenantRoles.map((r: { id: string; name: string; displayName: string }) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-sm font-mono">{r.name}</TableCell>
                        <TableCell className="text-sm">{r.displayName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete role ${r.name}? Users still assigned this key may lose API access until updated.`,
                                )
                              ) {
                                void deleteRole({ variables: { id: r.id } })
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-900">Create a user in your organization</h2>
          <p className="text-xs text-slate-600 mt-0.5">Choose a standard role or a custom role you defined above.</p>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          <InputFloating
            id="cu-email"
            label="Email"
            type="email"
            className="h-8 text-xs"
            value={userForm.email}
            onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
          />
          <InputFloating
            id="cu-pass"
            label="Password"
            type="password"
            className="h-8 text-xs"
            value={userForm.password}
            onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
          />
          <InputFloating
            id="cu-fn"
            label="First name"
            className="h-8 text-xs"
            value={userForm.firstName}
            onChange={(e) => setUserForm((f) => ({ ...f, firstName: e.target.value }))}
          />
          <InputFloating
            id="cu-ln"
            label="Last name"
            className="h-8 text-xs"
            value={userForm.lastName}
            onChange={(e) => setUserForm((f) => ({ ...f, lastName: e.target.value }))}
          />
          <div className="sm:col-span-2">
            <SelectFloating
              label="Role"
              name="cu-role"
              value={userForm.role}
              onChange={(e) =>
                setUserForm((f) => ({
                  ...f,
                  role: (e as React.ChangeEvent<HTMLSelectElement>).target.value,
                }))
              }
              options={roleSelectOptions}
              className="h-8 text-xs"
              placeholder="Role"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="button"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={creatingUser}
              onClick={() => void submitUser()}
            >
              {creatingUser ? 'Saving…' : 'Create user'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
