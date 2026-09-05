'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ClipboardList, Plus, Pencil, Trash2, Save, CheckCircle2, X, Eye, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { PAYROLL_UI_CATEGORY } from '@/lib/payroll-ui-category'
import {
  GET_PAYROLL_UI_RECORDS,
  CREATE_PAYROLL_UI_RECORD,
  UPDATE_PAYROLL_UI_RECORD,
  DELETE_PAYROLL_UI_RECORD,
  SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL,
} from '@/gql/queries'

type TimesheetSource = 'WEB' | 'MOBILE_APP' | 'IMPORT' | 'BIOMETRIC'

type PoolStatus = 'PENDING_REV' | 'APPROVED_POOL' | 'LOCKED_PAY' | 'REJECTED' | 'RELEASED_RUN'

type TimesheetPoolRow = {
  id: string
  lineRef: string
  employeeNo: string
  employeeName: string
  periodStartYmd: string
  periodEndYmd: string
  regularHours: number
  overtimeHours: number
  source: TimesheetSource
  poolStatus: PoolStatus
  projectCode: string
  remarks: string
  /** Routed org-admin payroll approver (none / pending / approved / declined). */
  orgApproval: string
}

const SOURCE_OPTIONS: ReadonlyArray<{ value: TimesheetSource; label: string }> = [
  { value: 'WEB', label: 'Web ESS' },
  { value: 'MOBILE_APP', label: 'Mobile' },
  { value: 'IMPORT', label: 'Import' },
  { value: 'BIOMETRIC', label: 'Biometric gate' },
]

const STATUS_OPTIONS: ReadonlyArray<{ value: PoolStatus; label: string }> = [
  { value: 'PENDING_REV', label: 'Pending review' },
  { value: 'APPROVED_POOL', label: 'Approved in pool' },
  { value: 'LOCKED_PAY', label: 'Locked for pay' },
  { value: 'RELEASED_RUN', label: 'Released into run' },
  { value: 'REJECTED', label: 'Rejected' },
]

const SOURCE_SELECT = SOURCE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
const STATUS_SELECT = STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextLineRef(rows: TimesheetPoolRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^TS-(\d+)$/i.exec((r.lineRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `TS-${String(max + 1).padStart(4, '0')}`
}

function statusBadgeClass(status: PoolStatus): string {
  switch (status) {
    case 'PENDING_REV':
      return 'bg-amber-50 text-amber-900 border-amber-200'
    case 'APPROVED_POOL':
      return 'bg-sky-50 text-sky-900 border-sky-200'
    case 'LOCKED_PAY':
      return 'bg-primary/10 text-indigo-900 border-primary/20'
    case 'RELEASED_RUN':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200'
    case 'REJECTED':
      return 'bg-red-50 text-red-900 border-red-200'
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200'
  }
}

function orgApprovalBadgeCls(s: string): string {
  switch (s) {
    case 'pending':
      return 'bg-amber-50 text-amber-900 border-amber-200'
    case 'approved':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200'
    case 'declined':
      return 'bg-red-50 text-red-900 border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

function orgApprovalLabel(s: string): string {
  switch (s) {
    case 'none':
      return 'Not submitted'
    case 'pending':
      return 'Pending'
    case 'approved':
      return 'Approved'
    case 'declined':
      return 'Declined'
    default:
      return s
  }
}

function viewDetailPayload(r: TimesheetPoolRow) {
  return {
    id: r.id,
    approvalStatus: r.orgApproval,
    timesheet: {
      lineRef: r.lineRef,
      employeeNo: r.employeeNo,
      employeeName: r.employeeName,
      periodStartYmd: r.periodStartYmd,
      periodEndYmd: r.periodEndYmd,
      regularHours: r.regularHours,
      overtimeHours: r.overtimeHours,
      source: r.source,
      poolStatus: r.poolStatus,
      projectCode: r.projectCode,
      remarks: r.remarks,
    },
  }
}

function parseHours(raw: string, label: string, setBanner: (b: { ok: boolean; text: string }) => void): number | null {
  const t = raw.trim()
  if (t === '') return 0
  const n = Number.parseFloat(t)
  if (Number.isNaN(n) || n < 0 || n > 999.99) {
    setBanner({ ok: false, text: `${label} must be between 0 and 999.99 hours.` })
    return null
  }
  return Math.round(n * 100) / 100
}

function parsePoolRecord(r: {
  id: string
  data: string
  approvalStatus?: string | null
}): TimesheetPoolRow {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const src =
      typeof o.source === 'string' && SOURCE_OPTIONS.some((s) => s.value === o.source)
        ? (o.source as TimesheetSource)
        : 'WEB'
    const pst =
      typeof o.poolStatus === 'string' && STATUS_OPTIONS.some((s) => s.value === o.poolStatus)
        ? (o.poolStatus as PoolStatus)
        : 'PENDING_REV'
    return {
      id: r.id,
      lineRef: typeof o.lineRef === 'string' ? o.lineRef : '',
      employeeNo: typeof o.employeeNo === 'string' ? o.employeeNo : '',
      employeeName: typeof o.employeeName === 'string' ? o.employeeName : '',
      periodStartYmd: typeof o.periodStartYmd === 'string' ? o.periodStartYmd : '',
      periodEndYmd: typeof o.periodEndYmd === 'string' ? o.periodEndYmd : '',
      regularHours: typeof o.regularHours === 'number' ? o.regularHours : 0,
      overtimeHours: typeof o.overtimeHours === 'number' ? o.overtimeHours : 0,
      source: src,
      poolStatus: pst,
      projectCode: typeof o.projectCode === 'string' ? o.projectCode : '',
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
      orgApproval: r.approvalStatus && r.approvalStatus !== '' ? String(r.approvalStatus) : 'none',
    }
  } catch {
    return {
      id: r.id,
      lineRef: '',
      employeeNo: '',
      employeeName: '',
      periodStartYmd: '',
      periodEndYmd: '',
      regularHours: 0,
      overtimeHours: 0,
      source: 'WEB',
      poolStatus: 'PENDING_REV',
      projectCode: '',
      remarks: '',
      orgApproval: r.approvalStatus && r.approvalStatus !== '' ? String(r.approvalStatus) : 'none',
    }
  }
}

function emptyForm() {
  return {
    employeeNo: '',
    employeeName: '',
    periodStartYmd: '',
    periodEndYmd: '',
    regularHours: '',
    overtimeHours: '',
    source: 'WEB' as TimesheetSource,
    poolStatus: 'PENDING_REV' as PoolStatus,
    projectCode: '',
    remarks: '',
  }
}

export default function TimesheetPoolPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [viewDetailRow, setViewDetailRow] = useState<TimesheetPoolRow | null>(null)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.TIMESHEET_POOL },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () =>
      (
        (data?.payrolluirecords as { id: string; data: string; approvalStatus?: string | null }[]) ?? []
      ).map(parsePoolRecord),
    [data],
  )

  const closeDialog = useCallback(() => {
    setOpen(false)
    setEditingId(null)
    setForm(emptyForm())
  }, [])

  const [createRec, { loading: creating }] = useMutation(CREATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Timesheet pool line saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Pool line updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteRec] = useMutation(DELETE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [submitPayrollForApproval, { loading: submittingPayrollApproval }] = useMutation(
    SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL,
    {
      onCompleted: () => {
        refetch()
        setBanner({ ok: true, text: 'Sent for payroll approval.' })
        setTimeout(() => setBanner(null), 4000)
      },
      onError: (e) => setBanner({ ok: false, text: e.message }),
    },
  )

  const busy = creating || updating
  const ready = Boolean(orgId) && !loading

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    if (!form.employeeNo.trim()) {
      setBanner({ ok: false, text: 'Employee number is required.' })
      return
    }
    if (form.periodStartYmd && form.periodEndYmd && form.periodEndYmd < form.periodStartYmd) {
      setBanner({ ok: false, text: 'Period end cannot be before start.' })
      return
    }
    const rh = parseHours(form.regularHours, 'Regular hours', setBanner)
    if (rh === null) return
    const oh = parseHours(form.overtimeHours, 'Overtime hours', setBanner)
    if (oh === null) return

    const lineRef =
      editingId ? rows.find((r) => r.id === editingId)?.lineRef ?? nextLineRef(rows) : nextLineRef(rows)

    const payload = {
      lineRef,
      employeeNo: form.employeeNo.trim(),
      employeeName: form.employeeName.trim(),
      periodStartYmd: form.periodStartYmd,
      periodEndYmd: form.periodEndYmd,
      regularHours: rh,
      overtimeHours: oh,
      source: form.source,
      poolStatus: form.poolStatus,
      projectCode: form.projectCode.trim(),
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.TIMESHEET_POOL,
      code: lineRef,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: TimesheetPoolRow) => {
    setEditingId(r.id)
    setForm({
      employeeNo: r.employeeNo || '',
      employeeName: r.employeeName || '',
      periodStartYmd: r.periodStartYmd || '',
      periodEndYmd: r.periodEndYmd || '',
      regularHours: String(r.regularHours ?? 0),
      overtimeHours: String(r.overtimeHours ?? 0),
      source: r.source,
      poolStatus: r.poolStatus,
      projectCode: r.projectCode || '',
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const summary = useMemo(() => {
    let pending = 0
    let locked = 0
    let reg = 0
    let ot = 0
    for (const r of rows) {
      reg += Number.isFinite(r.regularHours) ? r.regularHours : 0
      ot += Number.isFinite(r.overtimeHours) ? r.overtimeHours : 0
      if (r.poolStatus === 'PENDING_REV' || r.poolStatus === 'APPROVED_POOL') pending += 1
      if (r.poolStatus === 'LOCKED_PAY' || r.poolStatus === 'RELEASED_RUN') locked += 1
    }
    return { pending, locked, regular: reg, overtime: ot }
  }, [rows])

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const pd = (b.periodEndYmd || '').localeCompare(a.periodEndYmd || '')
        if (pd !== 0) return pd
        return (b.lineRef || '').localeCompare(a.lineRef || '')
      }),
    [rows],
  )

  if (!orgId) {
    return <p className="erp-page-desc">Select an organization to view the timesheet pool.</p>
  }

  return (
    <div className="erp-shell">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <ClipboardList className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Workflow</span>
          </div>
          <h1 className="erp-page-title">Timesheet pool</h1>
          <p className="text-gray-500 mt-1">
            Collect approved attendance rows before payroll calculation. Entries are stored per organization on the server
            and complement{' '}
            <Link href="/payroll/workflow/payroll-runs" className="text-primary hover:underline">
              payroll runs
            </Link>
            .
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setForm(emptyForm())
            setOpen(true)
          }}
          className="bg-slate-800 hover:bg-slate-900 text-white shrink-0 h-9 text-xs"
        >
          <Plus className="h-4 w-4 mr-2" /> Add pool line
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-500">Open / review</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{summary.pending}</p>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/10/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-primary">Locked / released</p>
          <p className="text-2xl font-bold tabular-nums text-indigo-950">{summary.locked}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-emerald-800">Regular hours Σ</p>
          <p className="text-2xl font-bold tabular-nums text-emerald-950">{summary.regular.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-amber-900">OT hours Σ</p>
          <p className="text-2xl font-bold tabular-nums text-amber-950">{summary.overtime.toFixed(2)}</p>
        </div>
      </div>

      {banner ? (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${
            banner.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {banner.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
          {banner.text}
        </div>
      ) : null}

      {open ? (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit pool entry' : 'New pool entry'}
            </span>
            <button type="button" onClick={closeDialog} className="text-primary-foreground/80 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="ts-no"
                label="Employee number"
                value={form.employeeNo}
                onChange={(e) => setForm((f) => ({ ...f, employeeNo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ts-name"
                label="Employee name"
                value={form.employeeName}
                onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="ts-pstart"
                label="Period start"
                type="date"
                value={form.periodStartYmd}
                onChange={(e) => setForm((f) => ({ ...f, periodStartYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ts-pend"
                label="Period end"
                type="date"
                value={form.periodEndYmd}
                onChange={(e) => setForm((f) => ({ ...f, periodEndYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="ts-reg"
                label="Regular hours"
                value={form.regularHours}
                onChange={(e) => setForm((f) => ({ ...f, regularHours: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ts-ot"
                label="Overtime hours"
                value={form.overtimeHours}
                onChange={(e) => setForm((f) => ({ ...f, overtimeHours: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SelectFloating
                label="Capture source"
                name="ts-source"
                value={form.source}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    source: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as TimesheetSource,
                  }))
                }
                options={SOURCE_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <SelectFloating
                label="Pool status"
                name="ts-status"
                value={form.poolStatus}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    poolStatus: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as PoolStatus,
                  }))
                }
                options={STATUS_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
            </div>
            <InputFloating
              id="ts-proj"
              label="Project / cost centre"
              value={form.projectCode}
              onChange={(e) => setForm((f) => ({ ...f, projectCode: e.target.value }))}
              className="h-7 text-xs"
              placeholder="Optional"
            />
            <InputFloating
              id="ts-rem"
              label="Remarks"
              multiline
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
              className="text-xs min-h-[56px]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submit}
                disabled={busy}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold">
          Timesheet pool lines
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No lines in the pool. Import or capture time first, then review here before calculating payroll runs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap">Ref</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Period</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Reg / OT</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Source</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Pool status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap">Approval</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap w-[176px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-mono text-xs text-gray-600">{r.lineRef}</TableCell>
                    <TableCell>
                      <div className="font-mono text-xs text-gray-600">{r.employeeNo}</div>
                      <div className="text-sm text-foreground">{r.employeeName || '—'}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {r.periodStartYmd && r.periodEndYmd ? `${r.periodStartYmd} – ${r.periodEndYmd}` : '—'}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {(Number.isFinite(r.regularHours) ? r.regularHours : 0).toFixed(2)}
                      {' / '}
                      {(Number.isFinite(r.overtimeHours) ? r.overtimeHours : 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {SOURCE_OPTIONS.find((s) => s.value === r.source)?.label ?? r.source}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadgeClass(r.poolStatus)}>
                        {STATUS_OPTIONS.find((s) => s.value === r.poolStatus)?.label ?? r.poolStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={orgApprovalBadgeCls(r.orgApproval)}>
                        {orgApprovalLabel(r.orgApproval)}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="View record"
                        onClick={() => setViewDetailRow(r)}
                      >
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                      {r.orgApproval === 'none' || r.orgApproval === 'declined' ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={submittingPayrollApproval}
                          title="Submit for org approval"
                          onClick={() => submitPayrollForApproval({ variables: { id: r.id } })}
                        >
                          <Send className="h-3.5 w-3.5 text-sky-600" />
                        </Button>
                      ) : null}
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                        <Pencil className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.confirm(`Remove ${r.lineRef}?`)) {
                            deleteRec({ variables: { id: r.id } })
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog
        open={viewDetailRow !== null}
        onOpenChange={(openState) => {
          if (!openState) setViewDetailRow(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Timesheet pool record</DialogTitle>
          </DialogHeader>
          {viewDetailRow ? (
            <pre className="text-xs font-mono bg-slate-950 text-slate-100 rounded-md p-3 overflow-auto max-h-[min(60vh,520px)] border border-slate-800">
              {JSON.stringify(viewDetailPayload(viewDetailRow), null, 2)}
            </pre>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setViewDetailRow(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
