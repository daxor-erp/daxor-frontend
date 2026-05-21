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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type OrgApproverRow = {
  moduleKey: string
  approverUserId?: string | null
  approverUserIds?: string[] | null
}

function idsFromApproverRow(r?: OrgApproverRow | null): string[] {
  if (!r) return []
  const arr = [...(r.approverUserIds ?? [])].filter(Boolean).map(String)
  if (arr.length) return [...new Set(arr)]
  if (r.approverUserId != null && String(r.approverUserId).trim()) return [String(r.approverUserId)]
  return []
}

function approverListsFromOrg(rows: OrgApproverRow[] | undefined): Record<string, string[]> {
  const m: Record<string, string[]> = {}
  for (const r of rows ?? []) {
    if (r.moduleKey) m[r.moduleKey] = idsFromApproverRow(r)
  }
  return m
}

export default function OrgAdminApprovalsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [selection, setSelection] = useState<Record<string, string[]>>({})
  const [vendorsPopoverOpen, setVendorsPopoverOpen] = useState(false)
  const [vendorsPickerSearch, setVendorsPickerSearch] = useState('')
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

  const approverSig = useMemo(() => {
    const rows = (orgModuleRows ?? []) as OrgApproverRow[]
    return rows
      .map((r) => `${r.moduleKey}:${idsFromApproverRow(r).sort().join(',')}`)
      .sort()
      .join('|')
  }, [orgModuleRows])

  useEffect(() => {
    const fromApi = approverListsFromOrg(orgModuleRows as OrgApproverRow[] | undefined)
    const next: Record<string, string[]> = {}
    for (const mod of ERP_APPROVAL_MODULES) {
      next[mod.key] = [...(fromApi[mod.key] ?? [])]
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
          approverUserIds: [...(selection[m.key] ?? [])],
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
              {ERP_APPROVAL_MODULES.map((mod) => {
                const ids = [...(selection[mod.key] ?? [])]
                const isVendorsMulti = mod.key === 'vendors'
                const q = vendorsPickerSearch.trim().toLowerCase()
                const filteredUsers = q
                  ? userOptions.filter(
                      (u: { email: string; firstName: string; lastName: string }) =>
                        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q),
                    )
                  : userOptions

                return (
                  <TableRow key={mod.key}>
                    <TableCell className="font-medium text-slate-900">{mod.label}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-amber-900 bg-amber-50 border-amber-200">
                        Awaiting approval (queue)
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isVendorsMulti ? (
                        <Popover open={vendorsPopoverOpen} onOpenChange={setVendorsPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="max-w-md h-10 justify-start">
                              {ids.length === 0
                                ? 'Select vendors approvers…'
                                : `${ids.length} approver${ids.length === 1 ? '' : 's'} selected`}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-[min(440px,96vw)] p-0">
                            <div className="p-2 border-b border-slate-100">
                              <label className="sr-only" htmlFor="vendors-approver-search">
                                Search users
                              </label>
                              <input
                                id="vendors-approver-search"
                                className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm"
                                placeholder="Search users…"
                                value={vendorsPickerSearch}
                                onChange={(e) => setVendorsPickerSearch(e.target.value)}
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                              {filteredUsers.map(
                                (u: { id: string; email: string; firstName: string; lastName: string }) => {
                                  const checked = ids.includes(u.id)
                                  return (
                                    <label
                                      key={u.id}
                                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 cursor-pointer"
                                    >
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(cv) =>
                                          setSelection((prev) => {
                                            const cur = [...(prev[mod.key] ?? [])]
                                            const on = cv === true
                                            if (on && !cur.includes(u.id)) cur.push(u.id)
                                            else if (!on) {
                                              const i = cur.indexOf(u.id)
                                              if (i >= 0) cur.splice(i, 1)
                                            }
                                            return { ...prev, [mod.key]: [...new Set(cur)] }
                                          })
                                        }
                                      />
                                      <span>
                                        {u.firstName} {u.lastName}
                                        <span className="text-slate-500"> ({u.email})</span>
                                      </span>
                                    </label>
                                  )
                                },
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Select
                          value={(ids[0] ?? '').trim() !== '' ? ids[0] : '__none__'}
                          onValueChange={(v) =>
                            setSelection((prev) => ({
                              ...prev,
                              [mod.key]: v === '__none__' ? [] : [v],
                            }))
                          }
                        >
                          <SelectTrigger className="max-w-md h-10">
                            <SelectValue placeholder="Select user…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">— None —</SelectItem>
                            {userOptions.map(
                              (u: { id: string; email: string; firstName: string; lastName: string }) => (
                                <SelectItem key={u.id} value={u.id}>
                                  {u.firstName} {u.lastName} ({u.email})
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
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
