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
import { CalendarRange, Plus, CheckCircle2, XCircle, CheckCircle, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GET_EMPLOYEE_MASTERS } from '@/gql/queries'
import {
  GET_LEAVE_TYPES,
  GET_LEAVE_APPLICATIONS,
  CREATE_LEAVE_APPLICATION,
  APPROVE_LEAVE_APPLICATION,
  REJECT_LEAVE_APPLICATION,
  DELETE_LEAVE_APPLICATION,
} from '@/gql/leave'

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-50 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function LeaveApplicationPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [open, setOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState<{ id: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({
    userId: '',
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const { data: empData } = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data: ltData } = useQuery(GET_LEAVE_TYPES, {
    variables: { organizationId: orgId, activeOnly: true },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data, loading, refetch } = useQuery(GET_LEAVE_APPLICATIONS, {
    variables: {
      organizationId: orgId,
      status: statusFilter === 'all' ? undefined : statusFilter,
    },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createApp, { loading: saving }] = useMutation(CREATE_LEAVE_APPLICATION, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      setForm({ userId: '', leaveTypeId: '', startDate: '', endDate: '', reason: '' })
      setBanner({ ok: true, text: 'Leave application submitted.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [approve] = useMutation(APPROVE_LEAVE_APPLICATION, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Application approved; leave balance updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [reject] = useMutation(REJECT_LEAVE_APPLICATION, {
    onCompleted: () => {
      refetch()
      setRejectOpen(null)
      setRejectReason('')
      setBanner({ ok: true, text: 'Application rejected.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteApp] = useMutation(DELETE_LEAVE_APPLICATION, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Application removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const employees = (empData?.employeeMasters ?? []) as Array<{
    id: string
    userId?: string | null
    firstName: string
    lastName: string
    employeeCode: string
  }>
  const leaveTypes = ltData?.leaveTypes ?? []
  const rows = data?.leaveApplications ?? []

  // Map userId → display name (employee master + current login fallback)
  const userMap = useMemo(() => {
    const m = new Map<string, string>()
    employees.forEach((e) => {
      if (e.userId) {
        m.set(String(e.userId), `${e.firstName} ${e.lastName} (${e.employeeCode})`.trim())
      }
    })
    if (user?.id) {
      const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      const label = name || user.email || 'Current user'
      if (!m.has(String(user.id))) m.set(String(user.id), label)
    }
    return m
  }, [employees, user])
  // Employees eligible to apply leave (must have a linked user account)
  const eligibleEmployees = useMemo(() => employees.filter((e) => e.userId), [employees])
  const employeeOptions = useMemo(() => {
    const opts = eligibleEmployees.map((e) => ({
      value: String(e.userId),
      label: `${e.firstName} ${e.lastName} (${e.employeeCode})`.trim(),
    }))
    const seen = new Set(opts.map((o) => o.value))
    if (user?.id && !seen.has(String(user.id))) {
      const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      opts.unshift({
        value: String(user.id),
        label: name ? `${name} (current user)` : `${user.email || user.id} (current user)`,
      })
    }
    return opts
  }, [eligibleEmployees, user])
  const resolveEmployeeName = (userId: string | null | undefined) => {
    if (!userId) return '—'
    const key = String(userId)
    return userMap.get(key) ?? employeeOptions.find((o) => o.value === key)?.label ?? key
  }
  const ltMap = useMemo(() => {
    const m = new Map<string, string>()
    leaveTypes.forEach((t: { id: string; code: string; name: string }) => m.set(t.id, `${t.code} — ${t.name}`))
    return m
  }, [leaveTypes])

  const submit = () => {
    if (!orgId || !form.userId || !form.leaveTypeId || !form.startDate || !form.endDate) return
    createApp({
      variables: {
        input: {
          userId: form.userId,
          leaveTypeId: form.leaveTypeId,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason || undefined,
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
            <CalendarRange className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">HR · Leave</span>
          </div>
          <h1 className="erp-page-title">Employee leave application</h1>
          <p className="text-gray-500 mt-1">
            Employees request leave; approvers validate against enrollment. Approved days feed into salary processing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <Label className="text-xs text-gray-500">Status</Label>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="mt-1 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="mb-0.5">Refresh</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New application
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
          Applications
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No applications for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Type</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Dates</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 text-center">Days</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 min-w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r: (typeof rows)[0]) => (
                  <TableRow key={r.id} className="hover:bg-primary/5/40">
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        {resolveEmployeeName(r.userId)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{ltMap.get(r.leaveTypeId) ?? r.leaveTypeId}</TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {r.startDate} → {r.endDate}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-sm">{r.totalDays}</TableCell>
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
                              className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
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
                            className="h-7 text-xs text-gray-500"
                            onClick={() => confirm('Delete this draft/pending application?') && deleteApp({ variables: { id: r.id } })}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                      {r.rejectedReason && (
                        <p className="text-xs text-red-600 mt-1 max-w-[200px]">{r.rejectedReason}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New leave application</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Employee</Label>
              <Select value={form.userId} onValueChange={(v) => setForm((f) => ({ ...f, userId: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[200]">
                  {employeeOptions.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      No employees available
                    </SelectItem>
                  ) : (
                    employeeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {eligibleEmployees.length < employees.length ? (
                <p className="text-xs text-amber-700 mt-1">
                  {employees.length - eligibleEmployees.length} employee(s) hidden — no linked user account.
                </p>
              ) : null}
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
                <Label className="text-xs">Start</Label>
                <Input type="date" className="mt-1" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">End</Label>
                <Input type="date" className="mt-1" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Reason</Label>
              <Textarea className="mt-1" rows={3} value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90" disabled={saving} onClick={submit}>
              {saving ? 'Submitting…' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectOpen} onOpenChange={(v) => !v && setRejectOpen(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(null)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectReason.trim()}
              onClick={() => rejectOpen && reject({ variables: { id: rejectOpen.id, reason: rejectReason.trim() } })}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
