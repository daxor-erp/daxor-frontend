'use client'

import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_USERS, GET_USER, SET_USER_MODULE_PERMISSIONS } from '@/gql/queries'
import { ERP_MODULE_DEFINITIONS, type ModulePermissionRow } from '@/lib/erp-module-access'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'

function mergeRowsFromApi(apiRows: ModulePermissionRow[] | undefined): ModulePermissionRow[] {
  const map = new Map(apiRows?.map((r) => [r.moduleKey, r]) ?? [])
  return ERP_MODULE_DEFINITIONS.map((def) => {
    const r = map.get(def.key)
    if (!r) {
      return {
        moduleKey: def.key,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        canView: true,
      }
    }
    return {
      moduleKey: def.key,
      canCreate: !!r.canCreate,
      canUpdate: !!r.canUpdate,
      canDelete: !!r.canDelete,
      canView: !!r.canView,
    }
  })
}

function isFullyOpen(rows: ModulePermissionRow[]): boolean {
  return rows.every((r) => r.canCreate && r.canUpdate && r.canDelete && r.canView)
}

export default function OrgAdminRolesPermissionsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [rows, setRows] = useState<ModulePermissionRow[]>(() =>
    ERP_MODULE_DEFINITIONS.map((d) => ({
      moduleKey: d.key,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canView: true,
    })),
  )
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: userDetail, loading: detailLoading } = useQuery(GET_USER, {
    variables: { id: selectedUserId },
    skip: !selectedUserId,
    fetchPolicy: 'network-only',
  })

  const users = usersData?.usersByOrganization?.users ?? []
  const selectableUsers = useMemo(
    () =>
      [...users]
        .filter((u: { roles?: string[] }) => !(u.roles ?? []).includes('ORG_ADMIN'))
        .sort((a: { firstName?: string }, b: { firstName?: string }) =>
          `${a.firstName ?? ''}`.localeCompare(`${b.firstName ?? ''}`),
        ),
    [users],
  )

  useEffect(() => {
    if (!selectedUserId) return
    const apiRows = userDetail?.user?.modulePermissions as ModulePermissionRow[] | undefined
    if (!apiRows?.length) {
      setRows(mergeRowsFromApi(undefined))
    } else {
      setRows(mergeRowsFromApi(apiRows))
    }
  }, [selectedUserId, userDetail?.user])

  const [savePermissions, { loading: saving }] = useMutation(SET_USER_MODULE_PERMISSIONS, {
    onCompleted: () => {
      setBanner({ ok: true, text: 'Permissions saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const updateCell = (
    moduleKey: string,
    field: keyof Pick<ModulePermissionRow, 'canCreate' | 'canUpdate' | 'canDelete' | 'canView'>,
    value: boolean,
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.moduleKey !== moduleKey) return row
        let next = { ...row, [field]: value }
        if (field === 'canView' && !value) {
          next = { ...next, canCreate: false, canUpdate: false, canDelete: false }
        }
        if (field !== 'canView' && value) {
          next = { ...next, canView: true }
        }
        return next
      }),
    )
  }

  const handleSave = () => {
    if (!selectedUserId) return
    const payload = isFullyOpen(rows) ? [] : rows
    void savePermissions({ variables: { userId: selectedUserId, permissions: payload } })
  }

  const loadingDetail = detailLoading && !!selectedUserId

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" asChild className="mt-0.5 shrink-0">
          <Link href="/org-admin/dashboard" className="gap-1 inline-flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Roles & permissions</h1>
          <p className="text-sm text-slate-600 mt-1">
            Select a user from your organization, then set per-module access. View-only prevents create, update, and
            delete. Turning on create, update, or delete automatically enables view for that module.
          </p>
        </div>
      </div>

      {banner ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.ok ? 'border-teal-200 bg-teal-50 text-teal-900' : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-end gap-4">
          <div className="min-w-[240px] flex-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User</p>
            <Select
              value={selectedUserId || undefined}
              onValueChange={(v) => setSelectedUserId(v)}
              disabled={usersLoading || !orgId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={usersLoading ? 'Loading users…' : 'Select a user'} />
              </SelectTrigger>
              <SelectContent>
                {selectableUsers.map((u: { id: string; email: string; firstName: string; lastName: string }) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!selectedUserId || saving || loadingDetail}
            onClick={handleSave}
          >
            {saving ? 'Saving…' : 'Save permissions'}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[220px] font-semibold">Module</TableHead>
              <TableHead className="text-center font-semibold">Create</TableHead>
              <TableHead className="text-center font-semibold">Update</TableHead>
              <TableHead className="text-center font-semibold">Delete</TableHead>
              <TableHead className="text-center font-semibold">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ERP_MODULE_DEFINITIONS.map((def) => {
              const row = rows.find((r) => r.moduleKey === def.key)
              if (!row) return null
              return (
                <TableRow key={def.key}>
                  <TableCell className="font-medium text-slate-900">{def.label}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canCreate}
                      disabled={!selectedUserId || loadingDetail || !row.canView}
                      onCheckedChange={(v) => updateCell(def.key, 'canCreate', v === true)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canUpdate}
                      disabled={!selectedUserId || loadingDetail || !row.canView}
                      onCheckedChange={(v) => updateCell(def.key, 'canUpdate', v === true)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canDelete}
                      disabled={!selectedUserId || loadingDetail || !row.canView}
                      onCheckedChange={(v) => updateCell(def.key, 'canDelete', v === true)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canView}
                      disabled={!selectedUserId || loadingDetail}
                      onCheckedChange={(v) => updateCell(def.key, 'canView', v === true)}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {!selectedUserId ? (
          <p className="text-sm text-slate-500 px-4 py-6 border-t border-slate-100">Select a user to edit permissions.</p>
        ) : null}
      </div>
    </div>
  )
}
