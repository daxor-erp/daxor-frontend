'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { ChevronRight, History, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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
import { useAuth } from '@/contexts/AuthContext'
import { PayrollUiRecordOrgApprovalCell } from '@/components/payroll-ui-record-org-approval-cell'
import { PAYROLL_UI_CATEGORY } from '@/lib/payroll-ui-category'
import {
  GET_PAYROLL_UI_RECORDS,
  CREATE_PAYROLL_UI_RECORD,
  UPDATE_PAYROLL_UI_RECORD,
  DELETE_PAYROLL_UI_RECORD,
} from '@/gql/queries'

type RetroScenario = 'RATE_CHANGE' | 'MISSED_PAY' | 'CORRECTION' | 'OTHER'

type RetroRow = {
  id: string
  employeeNo: string
  employeeName: string
  scenario: RetroScenario
  periodFromYmd: string
  periodToYmd: string
  payoutDateYmd: string
  amount: number
  status: 'DRAFT' | 'SUBMITTED' | 'POSTED' | 'CANCELLED'
  notes: string
  approvalStatus: string
}

const SCENARIO_OPTIONS: ReadonlyArray<{ value: RetroScenario; label: string }> = [
  { value: 'RATE_CHANGE', label: 'Rate change' },
  { value: 'MISSED_PAY', label: 'Missed pay' },
  { value: 'CORRECTION', label: 'Correction' },
  { value: 'OTHER', label: 'Other' },
]

const SCENARIO_SELECT = SCENARIO_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

const STATUS_OPTIONS: ReadonlyArray<{ value: RetroRow['status']; label: string }> = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'POSTED', label: 'Posted' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const STATUS_SELECT = STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function retroRecordCode(employeeNo: string, payoutDateYmd: string): string {
  const x = `${employeeNo.trim()}::${payoutDateYmd.trim()}`.replace(/^:+|:+$/g, '')
  return x || employeeNo.trim()
}

function parseRetroRecord(r: { id: string; data: string }): Omit<RetroRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const sc = typeof o.scenario === 'string' ? o.scenario : 'OTHER'
    const scenario = SCENARIO_OPTIONS.some((s) => s.value === sc) ? (sc as RetroScenario) : 'OTHER'
    const st = typeof o.status === 'string' ? o.status : 'DRAFT'
    const status = STATUS_OPTIONS.some((s) => s.value === st)
      ? (st as RetroRow['status'])
      : 'DRAFT'
    return {
      id: r.id,
      employeeNo: typeof o.employeeNo === 'string' ? o.employeeNo : '',
      employeeName: typeof o.employeeName === 'string' ? o.employeeName : '',
      scenario,
      periodFromYmd: typeof o.periodFromYmd === 'string' ? o.periodFromYmd : '',
      periodToYmd: typeof o.periodToYmd === 'string' ? o.periodToYmd : '',
      payoutDateYmd: typeof o.payoutDateYmd === 'string' ? o.payoutDateYmd : '',
      amount: typeof o.amount === 'number' ? o.amount : 0,
      status,
      notes: typeof o.notes === 'string' ? o.notes : '',
    }
  } catch {
    return {
      id: r.id,
      employeeNo: '',
      employeeName: '',
      scenario: 'OTHER',
      periodFromYmd: '',
      periodToYmd: '',
      payoutDateYmd: '',
      amount: 0,
      status: 'DRAFT',
      notes: '',
    }
  }
}

function statusBadgeClass(status: string) {
  const s = status.toUpperCase()
  if (s === 'DRAFT') return 'bg-slate-100 text-slate-800 border-slate-200'
  if (s === 'SUBMITTED') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (s === 'POSTED') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (s === 'CANCELLED') return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

const money = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function emptyForm() {
  return {
    employeeNo: '',
    employeeName: '',
    scenario: 'RATE_CHANGE' as RetroScenario,
    periodFromYmd: '',
    periodToYmd: '',
    payoutDateYmd: '',
    amount: '',
    status: 'DRAFT' as RetroRow['status'],
    notes: '',
  }
}

export default function RetroactivePaymentPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.RETRO_PAYMENT },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () =>
      (
        (data?.payrolluirecords as {
          id: string
          data: string
          approvalStatus?: string | null
        }[]) ?? []
      ).map((rec) => ({
        ...parseRetroRecord(rec),
        approvalStatus: rec.approvalStatus ?? 'none',
      })),
    [data],
  )

  const [createRec, { loading: creating }] = useMutation(CREATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Retro payment saved to the database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Retro payment updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteRec] = useMutation(DELETE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Adjustment removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const busy = creating || updating
  const ready = Boolean(orgId) && !loading

  const closeDialog = useCallback(() => {
    setOpen(false)
    setEditingId(null)
    setForm(emptyForm())
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    if (!form.employeeNo.trim()) {
      setBanner({ ok: false, text: 'Employee number is required.' })
      return
    }
    const rawAmt = form.amount.trim()
    const amt = rawAmt === '' ? 0 : Number.parseFloat(rawAmt)
    if (rawAmt !== '' && Number.isNaN(amt)) {
      setBanner({ ok: false, text: 'Retroactive amount must be numeric.' })
      return
    }

    const payload = {
      employeeNo: form.employeeNo.trim(),
      employeeName: form.employeeName.trim(),
      scenario: form.scenario,
      periodFromYmd: form.periodFromYmd,
      periodToYmd: form.periodToYmd,
      payoutDateYmd: form.payoutDateYmd,
      amount: amt < 0 ? 0 : amt,
      status: form.status,
      notes: form.notes.trim(),
    }

    const code = retroRecordCode(payload.employeeNo, payload.payoutDateYmd) || payload.employeeNo
    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.RETRO_PAYMENT,
      code,
      data: JSON.stringify(payload),
    }

    if (form.periodFromYmd && form.periodToYmd && form.periodToYmd < form.periodFromYmd) {
      setBanner({ ok: false, text: 'Original period “to” must not precede “from”.' })
      return
    }

    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: RetroRow) => {
    setEditingId(r.id)
    setForm({
      employeeNo: r.employeeNo || '',
      employeeName: r.employeeName || '',
      scenario: r.scenario,
      periodFromYmd: r.periodFromYmd || '',
      periodToYmd: r.periodToYmd || '',
      payoutDateYmd: r.payoutDateYmd || '',
      amount: r.amount !== undefined && r.amount !== null ? String(r.amount) : '',
      status: r.status,
      notes: r.notes || '',
    })
    setOpen(true)
  }

  const pendingDrafts = useMemo(
    () => rows.filter((r) => r.status === 'DRAFT' || r.status === 'SUBMITTED').length,
    [rows],
  )

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => String(b.payoutDateYmd).localeCompare(String(a.payoutDateYmd))),
    [rows],
  )

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization for retro payroll.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        <Link href="/payroll-management" className="hover:text-gray-800 hover:underline">
          Payroll
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <Link href="/payroll/processing/retroactive-payment" className="hover:text-gray-800 hover:underline font-medium">
          Payroll processing
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <span className="text-gray-700 font-medium">Retroactive payment</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <History className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Processing</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Retroactive payment</h1>
          <p className="text-gray-500 mt-1">
            Capture back-pay, rate arrears, and corrections with the original eligibility window and a planned payout date.
            Persisted per organization on the server.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-9 text-xs">
            <Link href="/payroll/processing/pay-batch">Pay batches</Link>
          </Button>
          <Button onClick={openCreate} className="bg-slate-800 hover:bg-slate-900 text-white h-9 text-xs">
            <Plus className="h-4 w-4 mr-2" /> New retro line
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-3 max-w-md">
        <p className="text-xs font-semibold uppercase text-indigo-800">Workflow queue</p>
        <p className="text-lg font-semibold text-indigo-950 tabular-nums">{pendingDrafts} open adjustments</p>
      </div>

      {banner ? (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${
            banner.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {banner.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
          {banner.text}
        </div>
      ) : null}

      {open ? (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit retro payment' : 'New retro payment'}
            </span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="rt-no"
                label="Employee number"
                value={form.employeeNo}
                onChange={(e) => setForm((f) => ({ ...f, employeeNo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="rt-name"
                label="Employee name"
                value={form.employeeName}
                onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SelectFloating
                label="Scenario"
                name="rt-scenario"
                value={form.scenario}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    scenario: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as RetroScenario,
                  }))
                }
                options={SCENARIO_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <SelectFloating
                label="Status"
                name="rt-status"
                value={form.status}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    status: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as RetroRow['status'],
                  }))
                }
                options={STATUS_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="rt-amt"
                label="Retro amount"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="h-7 text-xs"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="rt-pfrom"
                label="Original period from"
                type="date"
                value={form.periodFromYmd}
                onChange={(e) => setForm((f) => ({ ...f, periodFromYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="rt-pto"
                label="Original period to"
                type="date"
                value={form.periodToYmd}
                onChange={(e) => setForm((f) => ({ ...f, periodToYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="rt-payout"
                label="Pay on (payout date)"
                type="date"
                value={form.payoutDateYmd}
                onChange={(e) => setForm((f) => ({ ...f, payoutDateYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <InputFloating
              id="rt-notes"
              label="Explanation / memo"
              multiline
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="text-xs min-h-[72px]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={closeDialog} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submit}
                disabled={busy}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold">
          Retro adjustments
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No retro items yet. Add lines when correcting prior periods outside the active pay batch window.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Scenario</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Original period</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Payout</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Record status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="font-mono text-xs text-gray-600">{r.employeeNo}</div>
                    <div className="text-sm text-gray-900">{r.employeeName || '—'}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {SCENARIO_OPTIONS.find((s) => s.value === r.scenario)?.label ?? r.scenario}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {r.periodFromYmd && r.periodToYmd ? `${r.periodFromYmd} → ${r.periodToYmd}` : '—'}
                  </TableCell>
                  <TableCell className="text-sm">{r.payoutDateYmd || '—'}</TableCell>
                  <TableCell className="text-sm tabular-nums">{money.format(Number.isFinite(r.amount) ? r.amount : 0)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadgeClass(r.status)}>
                      {STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PayrollUiRecordOrgApprovalCell
                      recordId={r.id}
                      approvalStatus={r.approvalStatus}
                      onCompleted={() => refetch()}
                    />
                  </TableCell>
                  <TableCell className="space-x-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                      <Pencil className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const label = r.employeeNo || 'this adjustment'
                        if (typeof window !== 'undefined' && window.confirm(`Remove adjustment for ${label}?`)) {
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
        )}
      </div>
    </div>
  )
}
