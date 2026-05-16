'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { FileSpreadsheet, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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
import { type PayrollUiRecordQueryRow, withOrgApproval } from '@/lib/payroll-ui-record-row'
import {
  GET_PAYROLL_UI_RECORDS,
  CREATE_PAYROLL_UI_RECORD,
  UPDATE_PAYROLL_UI_RECORD,
  DELETE_PAYROLL_UI_RECORD,
} from '@/gql/queries'

type Ir8YearStatus = 'OPEN' | 'LOCKED' | 'ARCHIVED'

type Ir8aYearRow = {
  id: string
  rowRef: string
  taxYear: number
  formVersionLabel: string
  filingOpenYmd: string
  filingCloseYmd: string
  status: Ir8YearStatus
  autoAppendFromPayroll: boolean
  remarks: string
  approvalStatus: string
}

const STATUS_OPTIONS: ReadonlyArray<{ value: Ir8YearStatus; label: string }> = [
  { value: 'OPEN', label: 'Open for drafting' },
  { value: 'LOCKED', label: 'Locked / submitted window' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const STATUS_SELECT = STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextRef(rows: Ir8aYearRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^IR8Y-(\d+)$/i.exec((r.rowRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `IR8Y-${String(max + 1).padStart(4, '0')}`
}

function statusBadge(status: Ir8YearStatus): string {
  if (status === 'OPEN') return 'bg-emerald-50 text-emerald-900 border-emerald-200'
  if (status === 'LOCKED') return 'bg-amber-50 text-amber-900 border-amber-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

function parseIr8aRecord(r: { id: string; data: string }): Omit<Ir8aYearRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const status =
      typeof o.status === 'string' && STATUS_OPTIONS.some((s) => s.value === o.status)
        ? (o.status as Ir8YearStatus)
        : 'OPEN'
    return {
      id: r.id,
      rowRef: typeof o.rowRef === 'string' ? o.rowRef : '',
      taxYear:
        typeof o.taxYear === 'number' && Number.isFinite(o.taxYear) ? Math.floor(o.taxYear) : new Date().getFullYear(),
      formVersionLabel: typeof o.formVersionLabel === 'string' ? o.formVersionLabel : '',
      filingOpenYmd: typeof o.filingOpenYmd === 'string' ? o.filingOpenYmd : '',
      filingCloseYmd: typeof o.filingCloseYmd === 'string' ? o.filingCloseYmd : '',
      status,
      autoAppendFromPayroll:
        typeof o.autoAppendFromPayroll === 'boolean' ? o.autoAppendFromPayroll : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      rowRef: '',
      taxYear: new Date().getFullYear(),
      formVersionLabel: '',
      filingOpenYmd: '',
      filingCloseYmd: '',
      status: 'OPEN',
      autoAppendFromPayroll: true,
      remarks: '',
    }
  }
}

function emptyForm() {
  return {
    taxYear: '',
    formVersionLabel: '',
    filingOpenYmd: '',
    filingCloseYmd: '',
    status: 'OPEN' as Ir8YearStatus,
    autoAppendFromPayroll: true,
    remarks: '',
  }
}

export default function Ir8aYearPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.IR8A_YEAR },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () =>
      ((data?.payrolluirecords as PayrollUiRecordQueryRow[]) ?? []).map((rec) =>
        withOrgApproval<Ir8aYearRow>(rec, parseIr8aRecord(rec)),
      ),
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
      setBanner({ ok: true, text: 'IR8A year saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'IR8A year updated.' })
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

  const busy = creating || updating
  const ready = Boolean(orgId) && !loading

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    const rawY = form.taxYear.trim()
    const yr = rawY === '' ? new Date().getFullYear() : Number.parseInt(rawY, 10)
    if (Number.isNaN(yr) || yr < 2000 || yr > 2100) {
      setBanner({ ok: false, text: 'Tax year must be between 2000 and 2100.' })
      return
    }

    const dupYear = rows.some((r) => r.taxYear === yr && r.id !== editingId)
    if (dupYear) {
      setBanner({ ok: false, text: 'A configuration for this assessment year already exists.' })
      return
    }

    if (form.filingOpenYmd && form.filingCloseYmd && form.filingCloseYmd < form.filingOpenYmd) {
      setBanner({ ok: false, text: 'Filing end date cannot be before the start date.' })
      return
    }

    const rowRef = editingId ? rows.find((r) => r.id === editingId)?.rowRef ?? nextRef(rows) : nextRef(rows)

    const payload = {
      rowRef,
      taxYear: yr,
      formVersionLabel: form.formVersionLabel.trim(),
      filingOpenYmd: form.filingOpenYmd,
      filingCloseYmd: form.filingCloseYmd,
      status: form.status,
      autoAppendFromPayroll: form.autoAppendFromPayroll,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.IR8A_YEAR,
      code: String(yr),
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: Ir8aYearRow) => {
    setEditingId(r.id)
    setForm({
      taxYear: String(r.taxYear ?? ''),
      formVersionLabel: r.formVersionLabel || '',
      filingOpenYmd: r.filingOpenYmd || '',
      filingCloseYmd: r.filingCloseYmd || '',
      status: r.status,
      autoAppendFromPayroll: Boolean(r.autoAppendFromPayroll),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (b.taxYear ?? 0) - (a.taxYear ?? 0)),
    [rows],
  )

  if (!orgId) {
    return <p className="text-sm text-gray-500">Select an organization for IR8A year setup.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <FileSpreadsheet className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Statutory</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">IR8A assessment year</h1>
          <p className="text-gray-500 mt-1">
            Declare which YA windows are active for appendix 8B / IR8A generation. Persisted per organization on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add year profile
        </Button>
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
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit IR8A year' : 'New IR8A year'}</span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="ir8-yr"
                label="Assessment (tax) year"
                value={form.taxYear}
                onChange={(e) => setForm((f) => ({ ...f, taxYear: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ir8-ver"
                label="Form bundle / revision label"
                value={form.formVersionLabel}
                onChange={(e) => setForm((f) => ({ ...f, formVersionLabel: e.target.value }))}
                className="h-7 text-xs"
                placeholder="e.g. IR8A YA2026 baseline"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="ir8-o"
                label="Employer drafting opens"
                type="date"
                value={form.filingOpenYmd}
                onChange={(e) => setForm((f) => ({ ...f, filingOpenYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ir8-c"
                label="Statutory filing deadline"
                type="date"
                value={form.filingCloseYmd}
                onChange={(e) => setForm((f) => ({ ...f, filingCloseYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <SelectFloating
              label="Cycle status"
              name="ir8-st"
              value={form.status}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  status: (typeof v === 'string'
                    ? v
                    : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as Ir8YearStatus,
                }))
              }
              options={STATUS_SELECT}
              className="h-7 text-xs"
              placeholder="Select…"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.autoAppendFromPayroll}
                onChange={(e) => setForm((f) => ({ ...f, autoAppendFromPayroll: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              Auto-stub income lines from finalized payroll registers
            </label>
            <InputFloating
              id="ir8-rem"
              label="Remarks"
              multiline
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
              className="text-xs min-h-[56px]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={closeDialog} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submit}
                disabled={busy}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[96px]"
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
          IR8A year profiles
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No years captured. Define at least one assessment year ahead of appendix 8A / 8B exports.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Ref</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Year</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Form label</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Filing window</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Payroll stub</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                  <TableHead className="w-[92px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-mono text-xs text-gray-600">{r.rowRef}</TableCell>
                    <TableCell className="text-lg font-semibold tabular-nums">{r.taxYear}</TableCell>
                    <TableCell className="text-sm text-gray-800">{r.formVersionLabel || '—'}</TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {r.filingOpenYmd || '—'} → {r.filingCloseYmd || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(r.status)}>
                        {STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.autoAppendFromPayroll ? 'Yes' : 'Manual only'}</TableCell>
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
                          if (typeof window !== 'undefined' && window.confirm(`Remove YA ${r.taxYear}?`)) {
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
    </div>
  )
}
