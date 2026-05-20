'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_ATTENDANCES,
  CREATE_ATTENDANCE,
  GET_EMPLOYEE_MASTERS,
} from '@/gql/queries'

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'Leave' },
]

function statusClass(s: string) {
  if (s === 'present') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (s === 'absent') return 'bg-red-50 text-red-800 border-red-200'
  if (s === 'leave') return 'bg-amber-50 text-amber-800 border-amber-200'
  return 'bg-slate-100 text-slate-700'
}

export default function AttendancePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    userId: '',
    date: new Date().toISOString().slice(0, 10),
    checkIn: '',
    checkOut: '',
  })

  const { data: empData } = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data, loading, refetch } = useQuery(GET_ATTENDANCES, {
    variables: { organizationId: orgId, limit: 200 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createAttendance, { loading: saving }] = useMutation(CREATE_ATTENDANCE, {
    onCompleted: () => {
      setOpen(false)
      setForm({ userId: '', date: new Date().toISOString().slice(0, 10), checkIn: '', checkOut: '' })
      refetch()
    },
  })

  const rows: any[] = data?.attendances ?? []
  const employees: any[] = empData?.employeeMasters ?? []

  const empLookup = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of employees) {
      if (e.userId) m.set(String(e.userId), `${e.firstName} ${e.lastName} (${e.employeeCode})`)
    }
    return m
  }, [employees])

  const employeeOptions = useMemo(
    () =>
      employees
        .filter((e: any) => e.userId)
        .map((e: any) => ({
          value: String(e.userId),
          label: `${e.firstName} ${e.lastName} — ${e.employeeCode}`,
        })),
    [employees],
  )

  const submit = () => {
    if (!form.userId || !form.date || !orgId) return
    const dateIso = new Date(form.date + 'T00:00:00').toISOString()
    const checkIn = form.checkIn ? new Date(form.date + 'T' + form.checkIn + ':00').toISOString() : undefined
    const checkOut = form.checkOut ? new Date(form.date + 'T' + form.checkOut + ':00').toISOString() : undefined
    createAttendance({
      variables: {
        input: { userId: form.userId, date: dateIso, organizationId: orgId, checkIn, checkOut },
      },
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <SelectFloating
              label="Employee"
              value={form.userId}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  userId: typeof v === 'string' ? v : (v as any).target.value,
                }))
              }
              options={employeeOptions}
            />
            <InputFloating
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputFloating
                label="Check-in"
                type="time"
                value={form.checkIn}
                onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
              />
              <InputFloating
                label="Check-out"
                type="time"
                value={form.checkOut}
                onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving || !form.userId}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-500">No attendance records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date ? new Date(r.date).toISOString().slice(0, 10) : '—'}</TableCell>
                    <TableCell>{empLookup.get(String(r.userId)) ?? r.userId}</TableCell>
                    <TableCell>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—'}</TableCell>
                    <TableCell>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusClass(r.status)}>
                        {STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
