'use client'

import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { ChevronRight, Layers, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type PayBatchStatus = 'DRAFT' | 'QUEUED' | 'APPROVED' | 'POSTED' | 'CANCELLED'

type PayBatchRow = {
  id: string
  batchCode: string
  docDateIso: string
  title: string
  payPeriodStartYmd: string
  payPeriodEndYmd: string
  payGroup: string
  status: PayBatchStatus
  lineEstimate: number
  remarks: string
}

const STATUS_OPTIONS: ReadonlyArray<{ value: PayBatchStatus; label: string }> = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'QUEUED', label: 'Queued' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'POSTED', label: 'Posted' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const STATUS_SELECT = STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextBatchCode(rows: PayBatchRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^PB-(\d+)$/i.exec((r.batchCode || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `PB-${String(max + 1).padStart(4, '0')}`
}

function parsePayBatchRecord(r: { id: string; data: string }): PayBatchRow {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const st = typeof o.status === 'string' ? o.status : 'DRAFT'
    const status = STATUS_OPTIONS.some((s) => s.value === st) ? (st as PayBatchStatus) : 'DRAFT'
    return {
      id: r.id,
      batchCode: typeof o.batchCode === 'string' ? o.batchCode : '',
      docDateIso: typeof o.docDateIso === 'string' ? o.docDateIso : new Date().toISOString(),
      title: typeof o.title === 'string' ? o.title : '',
      payPeriodStartYmd: typeof o.payPeriodStartYmd === 'string' ? o.payPeriodStartYmd : '',
      payPeriodEndYmd: typeof o.payPeriodEndYmd === 'string' ? o.payPeriodEndYmd : '',
      payGroup: typeof o.payGroup === 'string' ? o.payGroup : '',
      status,
      lineEstimate: typeof o.lineEstimate === 'number' ? o.lineEstimate : 0,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      batchCode: '',
      docDateIso: new Date().toISOString(),
      title: '',
      payPeriodStartYmd: '',
      payPeriodEndYmd: '',
      payGroup: '',
      status: 'DRAFT',
      lineEstimate: 0,
      remarks: '',
    }
  }
}

function statusBadgeClass(status: string) {
  const s = status.toUpperCase()
  if (s === 'DRAFT') return 'bg-slate-100 text-slate-800 border-slate-200'
  if (s === 'QUEUED') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (s === 'APPROVED') return 'bg-sky-50 text-sky-800 border-sky-200'
  if (s === 'POSTED') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (s === 'CANCELLED') return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

function emptyForm() {
  return {
    title: '',
    docDateYmd: format(new Date(), 'yyyy-MM-dd'),
    payPeriodStartYmd: '',
    payPeriodEndYmd: '',
    payGroup: '',
    status: 'DRAFT' as PayBatchStatus,
    lineEstimate: '',
    remarks: '',
  }
}

export default function PayBatchPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.PAY_BATCH },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () =>
      ((data?.payrolluirecords as { id: string; data: string }[]) ?? []).map(parsePayBatchRecord),
    [data],
  )

  const [createRec, { loading: creating }] = useMutation(CREATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Pay batch saved to the organization database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Pay batch updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteRec] = useMutation(DELETE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Batch removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const busy = creating || updating

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
    const rawLines = form.lineEstimate.trim()
    const lineNum = rawLines === '' ? 0 : Number.parseInt(rawLines, 10)
    if (rawLines !== '' && Number.isNaN(lineNum)) {
      setBanner({ ok: false, text: 'Line estimate must be a whole number.' })
      return
    }
    const docIso = form.docDateYmd
      ? new Date(`${form.docDateYmd}T12:00:00`).toISOString()
      : new Date().toISOString()

    let batchCode = ''
    if (editingId) {
      batchCode = rows.find((r) => r.id === editingId)?.batchCode ?? nextBatchCode(rows)
    } else {
      batchCode = nextBatchCode(rows)
    }

    const payload = {
      batchCode,
      docDateIso: docIso,
      title: form.title.trim(),
      payPeriodStartYmd: form.payPeriodStartYmd,
      payPeriodEndYmd: form.payPeriodEndYmd,
      payGroup: form.payGroup.trim(),
      status: form.status,
      lineEstimate: lineNum < 0 ? 0 : lineNum,
      remarks: form.remarks.trim(),
    }
    const dataStr = JSON.stringify(payload)
    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.PAY_BATCH,
      code: batchCode,
      data: dataStr,
    }

    if (editingId) {
      updateRec({ variables: { id: editingId, input } })
    } else {
      createRec({ variables: { input } })
    }
  }

  const openEdit = (r: PayBatchRow) => {
    setEditingId(r.id)
    setForm({
      title: r.title || '',
      docDateYmd: r.docDateIso
        ? format(new Date(r.docDateIso), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      payPeriodStartYmd: r.payPeriodStartYmd || '',
      payPeriodEndYmd: r.payPeriodEndYmd || '',
      payGroup: r.payGroup || '',
      status:
        STATUS_OPTIONS.find((s) => s.value === r.status)?.value ?? ('DRAFT' as PayBatchStatus),
      lineEstimate: String(r.lineEstimate ?? 0),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => b.batchCode.localeCompare(a.batchCode)),
    [rows],
  )

  const ready = Boolean(orgId) && !loading

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization to manage pay batches.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        <Link href="/payroll-management" className="hover:text-gray-800 hover:underline">
          Payroll
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <Link href="/payroll/processing/pay-batch" className="hover:text-gray-800 hover:underline font-medium">
          Payroll processing
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <span className="text-gray-700 font-medium">Pay batch</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <Layers className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Processing</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pay batch</h1>
          <p className="text-gray-500 mt-1">
            Group employees and amounts into a runnable pay batch before posting. Rows are saved to the backend for your
            organization.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-9 text-xs">
            <Link href="/payroll/processing/payee-employee">Payee employees</Link>
          </Button>
          <Button onClick={openCreate} className="bg-slate-800 hover:bg-slate-900 text-white h-9 text-xs">
            <Plus className="h-4 w-4 mr-2" /> New pay batch
          </Button>
        </div>
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
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit pay batch' : 'New pay batch'}</span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <InputFloating
                  id="pb-title"
                  label="Batch title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-7 text-xs"
                  placeholder="e.g. Monthly staff — March 2026"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="pb-docdate"
                label="Batch date"
                type="date"
                value={form.docDateYmd}
                onChange={(e) => setForm((f) => ({ ...f, docDateYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Status"
                name="pb-status"
                value={form.status}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    status: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as PayBatchStatus,
                  }))
                }
                options={STATUS_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="pb-lines"
                label="Estimated pay lines"
                value={form.lineEstimate}
                onChange={(e) => setForm((f) => ({ ...f, lineEstimate: e.target.value }))}
                className="h-7 text-xs"
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="pb-pstart"
                label="Pay period start"
                type="date"
                value={form.payPeriodStartYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodStartYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pb-pend"
                label="Pay period end"
                type="date"
                value={form.payPeriodEndYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodEndYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pb-group"
                label="Pay group"
                value={form.payGroup}
                onChange={(e) => setForm((f) => ({ ...f, payGroup: e.target.value }))}
                className="h-7 text-xs"
                placeholder="e.g. STAFF_SG"
              />
            </div>
            <InputFloating
              id="pb-remarks"
              label="Remarks"
              multiline
              rows={3}
              value={form.remarks}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
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
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : editingId ? 'Update batch' : 'Save batch'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold">
          Pay batches
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No pay batches yet. Create one to stage a payout period before selecting payees.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Batch</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Title</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Period</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Pay group</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Lines</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono text-sm font-medium">{r.batchCode}</TableCell>
                  <TableCell className="text-sm text-gray-800">{r.title || '—'}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {r.payPeriodStartYmd && r.payPeriodEndYmd
                      ? `${r.payPeriodStartYmd} – ${r.payPeriodEndYmd}`
                      : '—'}
                  </TableCell>
                  <TableCell className="text-sm">{r.payGroup || '—'}</TableCell>
                  <TableCell className="text-sm tabular-nums">{r.lineEstimate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadgeClass(r.status)}>
                      {STATUS_OPTIONS.find((o) => o.value === r.status)?.label ?? r.status}
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
                        if (typeof window !== 'undefined' && window.confirm(`Remove batch “${r.batchCode}”?`)) {
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
