'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { ERP_APPROVAL_MODULES } from '@/lib/erp-approval-modules'
import { GET_ORGANIZATION, GET_USERS, SET_ORGANIZATION_MODULE_APPROVERS } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function approverMapFromOrg(rows: { moduleKey: string; approverUserId?: string | null }[] | undefined) {
  const m: Record<string, string | null> = {}
  for (const r of rows ?? []) {
    if (r?.moduleKey) m[r.moduleKey] = r.approverUserId ?? null
  }
  return m
}

export default function OrgAdminApprovalsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [selection, setSelection] = useState<Record<string, string | undefined>>({})
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)

  const {
    data: orgData,
    loading: orgLoading,
    refetch: refetchOrg,
  } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [saveApprovers, { loading: saving }] = useMutation(SET_ORGANIZATION_MODULE_APPROVERS, {
    onCompleted: () => {
      refetchOrg()
      setBanner({ ok: true, text: 'Approval routing saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const orgModuleRows = orgData?.organization?.moduleApprovers

  const approverSig = useMemo(
    () =>
      (orgModuleRows ?? [])
        .map((r: { moduleKey: string; approverUserId?: string | null }) => `${r.moduleKey}:${r.approverUserId ?? ''}`)
        .sort()
        .join('|'),
    [orgModuleRows],
  )

  useEffect(() => {
    const fromApi = approverMapFromOrg(orgModuleRows)
    const next: Record<string, string | undefined> = {}
    for (const mod of ERP_APPROVAL_MODULES) {
      const uid = fromApi[mod.key]
      next[mod.key] = uid ?? undefined
    }
    setSelection(next)
  }, [approverSig, orgModuleRows])

  const users = usersData?.usersByOrganization?.users ?? []
  const userOptions = useMemo(
    () =>
      [...users].sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, undefined, {
          sensitivity: 'base',
        }),
      ),
    [users],
  )

  const persist = () => {
    setBanner(null)
    if (!orgId) return
    saveApprovers({
      variables: {
        organizationId: orgId,
        assignments: ERP_APPROVAL_MODULES.map((m) => ({
          moduleKey: m.key,
          approverUserId: selection[m.key] ?? null,
        })),
      },
    })
  }

  const loading = orgLoading || usersLoading

  if (!orgId) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-600">No organization on this account.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Approvals</h1>
        <p className="text-sm text-slate-600 mt-1">
          Assign users who receive approval tasks in their ERP inbox (clipboard icon next to notifications). Purchasing
          is wired today; other modules can follow the same pattern. The Status column summarizes the queue posture for each area.
        </p>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50">
                <TableHead className="text-xs uppercase w-[22%]">Module</TableHead>
                <TableHead className="text-xs uppercase w-[28%]">Status</TableHead>
                <TableHead className="text-xs uppercase">Approve as (user)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ERP_APPROVAL_MODULES.map((mod) => (
                <TableRow key={mod.key}>
                  <TableCell className="font-medium text-slate-900">{mod.label}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-amber-900 bg-amber-50 border-amber-200">
                      Awaiting approval (queue)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={selection[mod.key] ?? '__none__'}
                      onValueChange={(v) =>
                        setSelection((prev) => ({
                          ...prev,
                          [mod.key]: v === '__none__' ? undefined : v,
                        }))
                      }
                    >
                      <SelectTrigger className="max-w-md h-10">
                        <SelectValue placeholder="Select user…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">— None —</SelectItem>
                        {userOptions.map((u: { id: string; email: string; firstName: string; lastName: string }) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} ({u.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          className="bg-teal-600 hover:bg-teal-700"
          disabled={saving || loading}
          onClick={persist}
        >
          {saving ? 'Saving…' : 'Save routing'}
        </Button>
      </div>
    </div>
  )
}
