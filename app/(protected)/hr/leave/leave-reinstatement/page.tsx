'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RotateCcw, Plus, CheckCircle2, CheckCircle, XCircle, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GET_USERS } from '@/gql/queries'
import {
  GET_LEAVE_TYPES,
  GET_LEAVE_APPLICATIONS,
  GET_LEAVE_REINSTATEMENTS,
  CREATE_LEAVE_REINSTATEMENT,
  APPROVE_LEAVE_REINSTATEMENT,
  REJECT_LEAVE_REINSTATEMENT,
  DELETE_LEAVE_REINSTATEMENT,
} from '@/gql/leave'

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-50 text-red-800 border-red-200',
}

export default function LeaveReinstatementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [open, setOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState<{ id: string } | null>(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({
    userId: '',
    leaveTypeId: '',
    calendarYear: String(new Date().getFullYear()),
    daysRestored: '1',
    reason: '',
    leaveApplicationId: '',
  })

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })
  const { data: ltData } = useQuery(GET_LEAVE_TYPES, {
    variables: { organizationId: orgId, activeOnly: true },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data: appsData } = useQuery(GET_LEAVE_APPLICATIONS, {
    variables: { organizationId: orgId, status: 'approved' },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data, loading, refetch } = useQuery(GET_LEAVE_REINSTATEMENTS, {
    variables: {
      organizationId: orgId,
      status: statusFilter === 'all' ? undefined : statusFilter,
    },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createRs, { loading: saving }] = useMutation(CREATE_LEAVE_REINSTATEMENT, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      setForm({
        userId: '',
        leaveTypeId: '',
        calendarYear: String(new Date().getFullYear()),
        daysRestored: '1',
        reason: '',
        leaveApplicationId: '',
      })
      setBanner({ ok: true, text: 'Reinstatement request submitted.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [approve] = useMutation(APPROVE_LEAVE_REINSTATEMENT, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Approved — employee leave balance restored.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [reject] = useMutation(REJECT_LEAVE_REINSTATEMENT, {
    onCompleted: () => {
      refetch()
      setRejectOpen(null)
      setRejectNotes('')
      setBanner({ ok: true, text: 'Reinstatement rejected.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteRs] = useMutation(DELETE_LEAVE_REINSTATEMENT, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Request removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const users = usersData?.usersByOrganization?.users ?? []
  const leaveTypes = ltData?.leaveTypes ?? []
  const approvedApps = appsData?.leaveApplications ?? []
  const rows = data?.leaveReinstatements ?? []

  const userMap = useMemo(() => {
    const m = new Map<string, string>()
    users.forEach((u: { id: string; firstName: string; lastName: string }) => {
      m.set(u.id, `${u.firstName} ${u.lastName}`.trim())
    })
    return m
  }, [users])
  const ltMap = useMemo(() => {
    const m = new Map<string, string>()
    leaveTypes.forEach((t: { id: string; code: string; name: string }) => m.set(t.id, `${t.code} — ${t.name}`))
    return m
  }, [leaveTypes])

  const filteredAppsForSelect = useMemo(() => {
    if (!form.userId) return approvedApps
    return approvedApps.filter((a: { userId: string }) => a.userId === form.userId)
  }, [approvedApps, form.userId])

  const submit = () => {
    if (!orgId || !form.userId || !form.leaveTypeId || !form.reason.trim()) return
    const days = parseFloat(form.daysRestored)
    if (!(days > 0)) return
    createRs({
      variables: {
        input: {
          userId: form.userId,
          leaveTypeId: form.leaveTypeId,
          calendarYear: parseInt(form.calendarYear, 10),
          daysRestored: days,
          reason: form.reason.trim(),
          leaveApplicationId: form.leaveApplicationId || undefined,
          organizationId: orgId,
        },
      },
    })
  }

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization.</p>
  }

  return (
    <div className="erp-shell">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <RotateCcw className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">HR · Leave</span>
          </div>
          <h1 className="erp-page-title">Employee leave reinstatement</h1>
          <p className="text-gray-500 mt-1">
            Correct wrongly deducted leave or reinstate balance after a cancelled / erroneous approval. Approved requests reduce{' '}
            <strong>used days</strong> on enrollment for payroll accuracy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <Label className="text-xs text-gray-500">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mt-1 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="mb-0.5" onClick={() => refetch()}>Refresh</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New request
          </Button>
        </div>
      </div>

      {banner && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${
            banner.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {banner.ok && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {banner.text}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold">
          Reinstatement requests
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No reinstatement requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Type · Year</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 text-center">Days</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Reason</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 min-w-[160px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r: (typeof rows)[0]) => (
                  <TableRow key={r.id} className="hover:bg-primary/5/40">
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        {userMap.get(r.userId) ?? r.userId}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {ltMap.get(r.leaveTypeId) ?? r.leaveTypeId}
                      <span className="text-gray-400"> · {r.calendarYear}</span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{r.daysRestored}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[220px] truncate" title={r.reason}>
                      {r.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_STYLE[r.status] ?? STATUS_STYLE.pending}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => approve({ variables: { id: r.id } })}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-red-200 text-red-700"
                              onClick={() => setRejectOpen({ id: r.id })}
                            >
                              <XCircle className="h-3 w-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {r.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => confirm('Delete this request?') && deleteRs({ variables: { id: r.id } })}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New reinstatement request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Employee</Label>
              <Select
                value={form.userId}
                onValueChange={(v) => setForm((f) => ({ ...f, userId: v, leaveApplicationId: '' }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u: { id: string; firstName: string; lastName: string }) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Leave type</Label>
              <Select value={form.leaveTypeId} onValueChange={(v) => setForm((f) => ({ ...f, leaveTypeId: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((t: { id: string; code: string; name: string }) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.code} — {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Calendar year</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form.calendarYear}
                  onChange={(e) => setForm((f) => ({ ...f, calendarYear: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Days to restore</Label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  className="mt-1"
                  value={form.daysRestored}
                  onChange={(e) => setForm((f) => ({ ...f, daysRestored: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Link to approved application (optional)</Label>
              <Select
                value={form.leaveApplicationId || '__none__'}
                onValueChange={(v) => setForm((f) => ({ ...f, leaveApplicationId: v === '__none__' ? '' : v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {filteredAppsForSelect.map((a: { id: string; startDate: string; endDate: string; totalDays: number }) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.startDate}–{a.endDate} ({a.totalDays}d)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Justification</Label>
              <Textarea
                className="mt-1"
                rows={3}
                placeholder="e.g. Leave application cancelled after payroll correction"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90" disabled={saving} onClick={submit}>
              {saving ? 'Saving…' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectOpen} onOpenChange={(v) => !v && setRejectOpen(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject reinstatement</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Notes (optional)"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(null)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                rejectOpen && reject({ variables: { id: rejectOpen.id, reviewNotes: rejectNotes || undefined } })
              }
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
