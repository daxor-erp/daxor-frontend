'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { PiggyBank, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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
import { PAYROLL_UI_CATEGORY } from '@/lib/payroll-ui-category'
import {
  GET_PAYROLL_UI_RECORDS,
  CREATE_PAYROLL_UI_RECORD,
  UPDATE_PAYROLL_UI_RECORD,
  DELETE_PAYROLL_UI_RECORD,
} from '@/gql/queries'

type PfStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED'

type EmployeePfRow = {
  id: string
  recordRef: string
  employeeNo: string
  employeeName: string
  cpfContributorNo: string
  employeeSharePct: number
  employerSharePct: number
  voluntaryExtraPct: number
  effectiveFromYmd: string
  status: PfStatus
  remarks: string
}

const STATUS_OPTIONS: ReadonlyArray<{ value: PfStatus; label: string }> = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CLOSED', label: 'Closed' },
]

const STATUS_SELECT = STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextRecordRef(rows: EmployeePfRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^EPF-(\d+)$/i.exec((r.recordRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `EPF-${String(max + 1).padStart(4, '0')}`
}

function parseEmployeePfRecord(r: { id: string; data: string }): EmployeePfRow {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const st = typeof o.status === 'string' ? o.status : 'ACTIVE'
    const status = STATUS_OPTIONS.some((s) => s.value === st) ? (st as PfStatus) : 'ACTIVE'
    return {
      id: r.id,
      recordRef: typeof o.recordRef === 'string' ? o.recordRef : '',
      employeeNo: typeof o.employeeNo === 'string' ? o.employeeNo : '',
      employeeName: typeof o.employeeName === 'string' ? o.employeeName : '',
      cpfContributorNo: typeof o.cpfContributorNo === 'string' ? o.cpfContributorNo : '',
      employeeSharePct: typeof o.employeeSharePct === 'number' ? o.employeeSharePct : 0,
      employerSharePct: typeof o.employerSharePct === 'number' ? o.employerSharePct : 0,
      voluntaryExtraPct: typeof o.voluntaryExtraPct === 'number' ? o.voluntaryExtraPct : 0,
      effectiveFromYmd: typeof o.effectiveFromYmd === 'string' ? o.effectiveFromYmd : '',
      status,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      recordRef: '',
      employeeNo: '',
      employeeName: '',
      cpfContributorNo: '',
      employeeSharePct: 0,
      employerSharePct: 0,
      voluntaryExtraPct: 0,
      effectiveFromYmd: '',
      status: 'ACTIVE',
      remarks: '',
    }
  }
}

function statusBadge(status: PfStatus): string {
  if (status === 'ACTIVE') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (status === 'SUSPENDED') return 'bg-amber-50 text-amber-800 border-amber-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function emptyForm() {
  return {
    employeeNo: '',
    employeeName: '',
    cpfContributorNo: '',
    employeeSharePct: '',
    employerSharePct: '',
    voluntaryExtraPct: '',
    effectiveFromYmd: '',
    status: 'ACTIVE' as PfStatus,
    remarks: '',
  }
}

export default function EmployeePfSetupPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.EMPLOYEE_PF },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () => ((data?.payrolluirecords as { id: string; data: string }[]) ?? []).map(parseEmployeePfRecord),
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
      setBanner({ ok: true, text: 'PF row saved to the database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'PF row updated.' })
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

  const parsePct = (label: string, raw: string): number | null => {
    const t = raw.trim()
    if (t === '') return 0
    const n = Number.parseFloat(t)
    if (Number.isNaN(n) || n < 0 || n > 60) {
      setBanner({ ok: false, text: `${label} must be blank or between 0 and 60.` })
      return null
    }
    return n
  }

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    if (!form.employeeNo.trim()) {
      setBanner({ ok: false, text: 'Employee number is required.' })
      return
    }
    const ee = parsePct('Employee retirement share %', form.employeeSharePct)
    if (ee === null) return
    const er = parsePct('Employer contribution %', form.employerSharePct)
    if (er === null) return
    const vol = parsePct('Voluntary additional %', form.voluntaryExtraPct)
    if (vol === null) return

    const recordRef =
      editingId ? rows.find((r) => r.id === editingId)?.recordRef ?? nextRecordRef(rows) : nextRecordRef(rows)

    const payload = {
      recordRef,
      employeeNo: form.employeeNo.trim(),
      employeeName: form.employeeName.trim(),
      cpfContributorNo: form.cpfContributorNo.trim(),
      employeeSharePct: ee,
      employerSharePct: er,
      voluntaryExtraPct: vol,
      effectiveFromYmd: form.effectiveFromYmd,
      status: form.status,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.EMPLOYEE_PF,
      code: form.employeeNo.trim(),
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: EmployeePfRow) => {
    setEditingId(r.id)
    setForm({
      employeeNo: r.employeeNo || '',
      employeeName: r.employeeName || '',
      cpfContributorNo: r.cpfContributorNo || '',
      employeeSharePct: r.employeeSharePct ? String(r.employeeSharePct) : '',
      employerSharePct: r.employerSharePct ? String(r.employerSharePct) : '',
      voluntaryExtraPct: r.voluntaryExtraPct ? String(r.voluntaryExtraPct) : '',
      effectiveFromYmd: r.effectiveFromYmd || '',
      status: r.status,
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const c = (a.employeeNo || '').localeCompare(b.employeeNo || '')
        return c !== 0 ? c : a.recordRef.localeCompare(b.recordRef)
      }),
    [rows],
  )

  if (!orgId) {
    return <p className="text-sm text-gray-500">Select an organization to maintain employee PF (CPF) settings.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <PiggyBank className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Setup</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Employee PF</h1>
          <p className="text-gray-500 mt-1">
            CPF-oriented employee / employer percentages per employee. Persisted per organization on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add PF row
        </Button>
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
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit employee PF' : 'New employee PF'}</span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pf-no"
                label="Employee number"
                value={form.employeeNo}
                onChange={(e) => setForm((f) => ({ ...f, employeeNo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pf-name"
                label="Employee name"
                value={form.employeeName}
                onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pf-cpfno"
                label="Contribution account / UEN reference"
                value={form.cpfContributorNo}
                onChange={(e) => setForm((f) => ({ ...f, cpfContributorNo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pf-from"
                label="Effective from"
                type="date"
                value={form.effectiveFromYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFromYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="pf-ee"
                label="Employee %"
                value={form.employeeSharePct}
                onChange={(e) => setForm((f) => ({ ...f, employeeSharePct: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pf-er"
                label="Employer %"
                value={form.employerSharePct}
                onChange={(e) => setForm((f) => ({ ...f, employerSharePct: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pf-v"
                label="Voluntary extra %"
                value={form.voluntaryExtraPct}
                onChange={(e) => setForm((f) => ({ ...f, voluntaryExtraPct: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <SelectFloating
              label="Status"
              name="pf-status"
              value={form.status}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  status: (typeof v === 'string'
                    ? v
                    : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as PfStatus,
                }))
              }
              options={STATUS_SELECT}
              className="h-7 text-xs"
              placeholder="Select…"
            />
            <InputFloating
              id="pf-rem"
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
              <Button size="sm" onClick={submit} disabled={busy} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold">
          Employee PF register
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No PF enrolments yet. Add rows to drive statutory calculations in downstream payroll runs.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Ref</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Account ref</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">EE%</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">ER%</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Extra%</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Effective</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[96px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono text-xs text-gray-600">{r.recordRef}</TableCell>
                  <TableCell>
                    <div className="font-mono text-xs text-gray-600">{r.employeeNo}</div>
                    <div className="text-sm text-gray-900">{r.employeeName || '—'}</div>
                  </TableCell>
                  <TableCell className="text-sm">{r.cpfContributorNo || '—'}</TableCell>
                  <TableCell className="text-sm tabular-nums">{r.employeeSharePct}</TableCell>
                  <TableCell className="text-sm tabular-nums">{r.employerSharePct}</TableCell>
                  <TableCell className="text-sm tabular-nums">{r.voluntaryExtraPct}</TableCell>
                  <TableCell className="text-sm">{r.effectiveFromYmd || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadge(r.status)}>
                      {STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}
                    </Badge>
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
                        if (typeof window !== 'undefined' && window.confirm(`Remove PF setup for ${r.employeeNo}?`)) {
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
