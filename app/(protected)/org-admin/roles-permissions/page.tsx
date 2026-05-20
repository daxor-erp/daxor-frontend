'use client'

import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_USERS, GET_USER, SET_USER_MODULE_PERMISSIONS } from '@/gql/queries'
import type { ModulePermissionRow } from '@/contexts/AuthContext'
import { getPermissionModuleGroups, type ErpPermissionModuleGroup } from '@/lib/erp-submodule-keys'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ModulePermissionCard } from '@/components/org-admin/permissions/ModulePermissionCard'
import { UserPermissionSelector } from '@/components/org-admin/permissions/RoleSelector'
import type { SubmoduleCell } from '@/components/org-admin/permissions/permission-types'
import { permKey } from '@/components/org-admin/permissions/permission-types'

const FULL: SubmoduleCell = {
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  canView: true,
}

function buildDefaultFull(groups: ErpPermissionModuleGroup[]): Record<string, SubmoduleCell> {
  const o: Record<string, SubmoduleCell> = {}
  for (const g of groups) {
    for (const s of g.submodules) {
      o[permKey(g.moduleKey, s.submoduleKey)] = { ...FULL }
    }
  }
  return o
}

function mergeApiIntoState(
  apiRows: ModulePermissionRow[] | undefined,
  groups: ErpPermissionModuleGroup[],
): Record<string, SubmoduleCell> {
  const base = buildDefaultFull(groups)
  if (!apiRows?.length) return base
  const hasGranular = apiRows.some((r) => r.submoduleKey)
  if (!hasGranular) {
    const byMod = new Map(
      apiRows.filter((r) => !r.submoduleKey).map((r) => [r.moduleKey, r]),
    )
    for (const g of groups) {
      const m = byMod.get(g.moduleKey)
      if (!m) continue
      for (const s of g.submodules) {
        const k = permKey(g.moduleKey, s.submoduleKey)
        base[k] = {
          canCreate: !!m.canCreate,
          canUpdate: !!m.canUpdate,
          canDelete: !!m.canDelete,
          canView: !!m.canView,
        }
      }
    }
    return base
  }
  const byKey = new Map(
    apiRows
      .filter((r) => r.submoduleKey)
      .map((r) => [permKey(r.moduleKey, String(r.submoduleKey)), r]),
  )
  for (const g of groups) {
    for (const s of g.submodules) {
      const k = permKey(g.moduleKey, s.submoduleKey)
      const r = byKey.get(k)
      if (r) {
        base[k] = {
          canCreate: !!r.canCreate,
          canUpdate: !!r.canUpdate,
          canDelete: !!r.canDelete,
          canView: !!r.canView,
        }
      }
    }
  }
  return base
}

export default function OrgAdminRolesPermissionsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [selectedUserId, setSelectedUserId] = useState('')
  const groups = useMemo(() => getPermissionModuleGroups(new Set(['dashboard'])), [])
  const [matrix, setMatrix] = useState<Record<string, SubmoduleCell>>(() => buildDefaultFull(groups))
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
    if (!selectedUserId) {
      setMatrix(buildDefaultFull(groups))
      return
    }
    const apiRows = userDetail?.user?.modulePermissions as ModulePermissionRow[] | undefined
    setMatrix(mergeApiIntoState(apiRows, groups))
  }, [selectedUserId, userDetail?.user, groups])

  const setCell = useCallback((moduleKey: string, submoduleKey: string, next: SubmoduleCell) => {
    const k = permKey(moduleKey, submoduleKey)
    setMatrix((prev) => ({ ...prev, [k]: next }))
  }, [])

  const selectAllModule = useCallback(
    (moduleKey: string, value: boolean) => {
      const g = groups.find((x) => x.moduleKey === moduleKey)
      if (!g) return
      const fix: SubmoduleCell = value
        ? { ...FULL }
        : { canCreate: false, canUpdate: false, canDelete: false, canView: false }
      setMatrix((prev) => {
        const n = { ...prev }
        for (const s of g.submodules) {
          n[permKey(moduleKey, s.submoduleKey)] = { ...fix }
        }
        return n
      })
    },
    [groups],
  )

  const [savePermissions, { loading: saving }] = useMutation(SET_USER_MODULE_PERMISSIONS, {
    onCompleted: () => {
      setBanner({ ok: true, text: 'Permissions saved. Navigation and API access update on next sync.' })
      setTimeout(() => setBanner(null), 5000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const handleSave = () => {
    if (!selectedUserId) return
    const permissions = groups.flatMap((g) =>
      g.submodules.map((s) => {
        const c = matrix[permKey(g.moduleKey, s.submoduleKey)] ?? FULL
        return {
          moduleKey: g.moduleKey,
          submoduleKey: s.submoduleKey,
          canCreate: c.canCreate,
          canUpdate: c.canUpdate,
          canDelete: c.canDelete,
          canView: c.canView,
        }
      }),
    )
    void savePermissions({ variables: { userId: selectedUserId, permissions } })
  }

  const loadingDetail = detailLoading && !!selectedUserId

  if (!orgId) {
    return (
      <div className="p-8 text-slate-400 text-sm">No organization on this account.</div>
    )
  }

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 -ml-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <Link href="/org-admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-slate-50 mt-1 tracking-tight">Roles &amp; permissions</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Module → submodule → action matrix. View gates sidebar and read APIs; create / update / delete gate
              write operations. Disabled View hides the menu item and blocks deep links for that submodule.
            </p>
          </div>
        </div>

        {banner ? (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              banner.ok
                ? 'border-emerald-800/80 bg-emerald-950/50 text-emerald-200'
                : 'border-red-800/80 bg-red-950/40 text-red-200'
            }`}
          >
            {banner.text}
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-700/80 bg-slate-900/50 p-4 space-y-4">
          <UserPermissionSelector
            users={selectableUsers}
            value={selectedUserId}
            onChange={setSelectedUserId}
            loading={usersLoading}
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={!selectedUserId || saving || loadingDetail}
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-500 text-white"
            >
              {saving ? 'Saving…' : 'Save permissions'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {groups.map((g, idx) => (
            <ModulePermissionCard
              key={g.moduleKey}
              moduleLabel={g.label}
              moduleKey={g.moduleKey}
              submodules={g.submodules}
              defaultOpen={idx < 2}
              state={matrix}
              onChangeRow={(sk, next) => setCell(g.moduleKey, sk, next)}
              onSelectAllModule={(v) => selectAllModule(g.moduleKey, v)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
