'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ClipboardList, Plus, Trash2, CheckCircle2, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GET_USERS } from '@/gql/queries'
import {
  GET_LEAVE_TYPES,
  GET_LEAVE_ENROLLMENTS,
  CREATE_LEAVE_ENROLLMENT,
  DELETE_LEAVE_ENROLLMENT,
} from '@/gql/leave'

const yearNow = () => new Date().getFullYear()

export default function LeaveEnrollmentPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [filterYear, setFilterYear] = useState(yearNow())
  const [open, setOpen] = useState(false)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({
    userId: '',
    leaveTypeId: '',
    calendarYear: String(yearNow()),
    entitledDays: '12',
    carriedForward: '0',
    notes: '',
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
  const { data, loading, refetch } = useQuery(GET_LEAVE_ENROLLMENTS, {
    variables: { organizationId: orgId, calendarYear: filterYear },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createEn, { loading: saving }] = useMutation(CREATE_LEAVE_ENROLLMENT, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      setForm({ userId: '', leaveTypeId: '', calendarYear: String(filterYear), entitledDays: '12', carriedForward: '0', notes: '' })
      setBanner({ ok: true, text: 'Enrollment created.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteEn] = useMutation(DELETE_LEAVE_ENROLLMENT, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Enrollment removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const users = usersData?.usersByOrganization?.users ?? []
  const leaveTypes = ltData?.leaveTypes ?? []
  const rows = data?.leaveEnrollments ?? []

  const userMap = useMemo(() => {
    const m = new Map<string, string>()
    users.forEach((u: { id: string; firstName: string; lastName: string }) => {
      m.set(u.id, `${u.firstName} ${u.lastName}`.trim())
    })
    return m
  }, [users])
  const ltMap = useMemo(() => {
    const m = new Map<string, string>()
    leaveTypes.forEach((t: { id: string; name: string; code: string }) => m.set(t.id, `${t.code} — ${t.name}`))
    return m
  }, [leaveTypes])

  const submit = () => {
    if (!orgId || !form.userId || !form.leaveTypeId) return
    createEn({
      variables: {
        input: {
          userId: form.userId,
          leaveTypeId: form.leaveTypeId,
          calendarYear: parseInt(form.calendarYear, 10),
          entitledDays: parseFloat(form.entitledDays) || 0,
          carriedForward: parseFloat(form.carriedForward) || 0,
          notes: form.notes || undefined,
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
            <ClipboardList className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">HR · Leave</span>
          </div>
          <h1 className="erp-page-title">Employee leave enrollment</h1>
          <p className="text-gray-500 mt-1">
            Set annual entitlements per employee and leave type. Salary processing uses <strong>used</strong> vs{' '}
            <strong>entitled + carried forward</strong> when applications are approved.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <Label className="text-xs text-gray-500">Calendar year</Label>
            <Input
              type="number"
              className="mt-1 w-28"
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value, 10) || yearNow())}
            />
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="mb-0.5">
            Refresh
          </Button>
          <Button
            onClick={() => {
              setForm((f) => ({ ...f, calendarYear: String(filterYear) }))
              setOpen(true)
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" /> New enrollment
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
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold flex items-center justify-between">
          <span>Enrollments · {filterYear}</span>
          <span className="text-primary-foreground/80 font-normal text-xs">{rows.length} record(s)</span>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No enrollments for this year. Add enrollments before approving leave applications.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Leave type</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 text-right">Entitled</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 text-right">Carried</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 text-right">Used</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 text-right">Balance</TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r: (typeof rows)[0]) => {
                const bal =
                  Number(r.entitledDays) + Number(r.carriedForward || 0) - Number(r.usedDays || 0)
                return (
                  <TableRow key={r.id} className="hover:bg-primary/5/40">
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        {userMap.get(r.userId) ?? r.userId}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{ltMap.get(r.leaveTypeId) ?? r.leaveTypeId}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{r.entitledDays}</TableCell>
                    <TableCell className="text-right text-sm">{r.carriedForward}</TableCell>
                    <TableCell className="text-right text-sm">{r.usedDays}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={bal >= 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-50 text-red-800'}>
                        {bal.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => {
                          if (confirm('Remove this enrollment?')) deleteEn({ variables: { id: r.id } })
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New enrollment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Employee</Label>
              <Select value={form.userId} onValueChange={(v) => setForm((f) => ({ ...f, userId: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select employee" />
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
                  <SelectValue placeholder="Select type" />
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
            <div>
              <Label className="text-xs">Calendar year</Label>
              <Input
                type="number"
                className="mt-1"
                value={form.calendarYear}
                onChange={(e) => setForm((f) => ({ ...f, calendarYear: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Entitled days</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  className="mt-1"
                  value={form.entitledDays}
                  onChange={(e) => setForm((f) => ({ ...f, entitledDays: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Carried forward</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  className="mt-1"
                  value={form.carriedForward}
                  onChange={(e) => setForm((f) => ({ ...f, carriedForward: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Notes (optional)</Label>
              <Input className="mt-1" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90" disabled={saving} onClick={submit}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
