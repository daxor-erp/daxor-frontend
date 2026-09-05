'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_APPRAISALS,
  CREATE_APPRAISAL,
  TRANSITION_APPRAISAL,
  GET_EMPLOYEE_MASTERS,
} from '@/gql/queries'

const STATUS_OPTIONS = ['DRAFT', 'SELF_REVIEW', 'MANAGER_REVIEW', 'CALIBRATED', 'FINALIZED']

export default function AppraisalPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ employeeId: '', cycle: 'FY2025-26-H1', periodStart: '', periodEnd: '' })

  const { data: empData } = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const { data, loading, refetch } = useQuery(GET_APPRAISALS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createAppraisal, { loading: saving }] = useMutation(CREATE_APPRAISAL, {
    onCompleted: () => { setOpen(false); refetch() },
  })
  const [transition] = useMutation(TRANSITION_APPRAISAL, { onCompleted: () => refetch() })

  const employees: any[] = empData?.employeeMasters ?? []
  const empLookup = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of employees) m.set(e.id, `${e.firstName} ${e.lastName} (${e.employeeCode})`)
    return m
  }, [employees])

  const rows: any[] = data?.appraisals ?? []

  return (
    <div className="erp-shell">
      <div className="flex justify-between items-center">
        <h1 className="erp-page-title">Performance Appraisals</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Appraisal
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader><DialogTitle>New Appraisal</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <SelectFloating
              label="Employee"
              value={form.employeeId}
              onChange={(v) => setForm((f) => ({ ...f, employeeId: typeof v === 'string' ? v : (v as any).target.value }))}
              options={employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} — ${e.employeeCode}` }))}
            />
            <InputFloating
              label="Cycle"
              value={form.cycle}
              onChange={(e) => setForm((f) => ({ ...f, cycle: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Period start" type="date" value={form.periodStart} onChange={(e) => setForm((f) => ({ ...f, periodStart: e.target.value }))} />
              <InputFloating label="Period end" type="date" value={form.periodEnd} onChange={(e) => setForm((f) => ({ ...f, periodEnd: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() =>
                createAppraisal({
                  variables: {
                    input: {
                      organizationId: orgId,
                      employeeId: form.employeeId,
                      cycle: form.cycle,
                      periodStart: new Date(form.periodStart + 'T00:00:00').toISOString(),
                      periodEnd: new Date(form.periodEnd + 'T00:00:00').toISOString(),
                    },
                  },
                })
              }
              disabled={!form.employeeId || !form.periodStart || !form.periodEnd || saving}
            >
              {saving ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>Appraisals</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-500">No appraisals yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Hike %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Advance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{empLookup.get(a.employeeId) ?? a.employeeId}</TableCell>
                    <TableCell>{a.cycle}</TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {new Date(a.periodStart).toISOString().slice(0, 10)} → {new Date(a.periodEnd).toISOString().slice(0, 10)}
                    </TableCell>
                    <TableCell>{a.overallRating ?? '—'}</TableCell>
                    <TableCell>{a.recommendedHikePercent != null ? `${a.recommendedHikePercent}%` : '—'}</TableCell>
                    <TableCell><Badge variant="outline">{a.status}</Badge></TableCell>
                    <TableCell>
                      <SelectFloating
                        label=""
                        value={a.status}
                        onChange={(v) =>
                          transition({
                            variables: { id: a.id, status: typeof v === 'string' ? v : (v as any).target.value },
                          })
                        }
                        options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                        className="h-8 text-xs min-w-[140px]"
                      />
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
