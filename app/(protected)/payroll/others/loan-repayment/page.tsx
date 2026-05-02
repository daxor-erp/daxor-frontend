'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { format, parseISO } from 'date-fns'
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
import { Plus, Pencil, Trash2, Wallet, CheckCircle2, X, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_LOAN_REPAYMENTS,
  CREATE_LOAN_REPAYMENT,
  UPDATE_LOAN_REPAYMENT,
  DELETE_LOAN_REPAYMENT,
} from '@/gql/queries'

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DEDUCTED', label: 'Deducted' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const

const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function toYmd(iso?: string | null) {
  if (!iso) return ''
  try {
    return format(parseISO(iso), 'yyyy-MM-dd')
  } catch {
    return ''
  }
}

function ymdToIso(ymd: string) {
  if (!ymd) return undefined
  return new Date(ymd + 'T00:00:00').toISOString()
}

function statusBadgeClass(status: string) {
  const s = (status || '').toUpperCase()
  if (s === 'DRAFT') return 'bg-slate-100 text-slate-800 border-slate-200'
  if (s === 'PENDING_REVIEW') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (s === 'APPROVED') return 'bg-sky-50 text-sky-800 border-sky-200'
  if (s === 'DEDUCTED') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (s === 'CANCELLED') return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800'
}

type Row = {
  id: string
  docNumber: string
  docDate: string
  status: string
  createdAt: string
  title?: string | null
  remarks?: string | null
  payPeriodStart?: string | null
  payPeriodEnd?: string | null
  employeeNo?: string | null
  employeeName?: string | null
  loanReference?: string | null
  repaymentAmount: number
}

export default function LoanRepaymentPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({
    title: '',
    docDateYmd: format(new Date(), 'yyyy-MM-dd'),
    status: 'DRAFT' as (typeof STATUS_OPTIONS)[number]['value'],
    payPeriodStartYmd: '',
    payPeriodEndYmd: '',
    employeeNo: '',
    employeeName: '',
    loanReference: '',
    repaymentAmount: '',
    remarks: '',
  })

  const { data, loading, refetch } = useQuery(GET_LOAN_REPAYMENTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createLr, { loading: creating }] = useMutation(CREATE_LOAN_REPAYMENT, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Loan repayment record saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateLr, { loading: updating }] = useMutation(UPDATE_LOAN_REPAYMENT, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Loan repayment updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteLr] = useMutation(DELETE_LOAN_REPAYMENT, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Record removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const rows: Row[] = (data?.loanrepayments as Row[] | undefined) ?? []
  const busy = creating || updating

  const closeDialog = () => {
    setOpen(false)
    setEditingId(null)
    setForm({
      title: '',
      docDateYmd: format(new Date(), 'yyyy-MM-dd'),
      status: 'DRAFT',
      payPeriodStartYmd: '',
      payPeriodEndYmd: '',
      employeeNo: '',
      employeeName: '',
      loanReference: '',
      repaymentAmount: '',
      remarks: '',
    })
  }

  const buildInput = () => {
    if (!orgId) return null
    const payStart = ymdToIso(form.payPeriodStartYmd)
    const payEnd = ymdToIso(form.payPeriodEndYmd)
    const raw = form.repaymentAmount.trim()
    const amount = raw === '' ? 0 : parseFloat(raw)
    if (raw !== '' && Number.isNaN(amount)) {
      setBanner({ ok: false, text: 'Enter a valid repayment amount.' })
      return null
    }
    return {
      organizationId: orgId,
      docDate: ymdToIso(form.docDateYmd) || new Date().toISOString(),
      status: form.status,
      title: form.title.trim() || undefined,
      remarks: form.remarks.trim() || undefined,
      payPeriodStart: payStart,
      payPeriodEnd: payEnd,
      employeeNo: form.employeeNo.trim() || undefined,
      employeeName: form.employeeName.trim() || undefined,
      loanReference: form.loanReference.trim() || undefined,
      repaymentAmount: amount,
    }
  }

  const submit = () => {
    setBanner(null)
    const input = buildInput()
    if (!input) return
    if (editingId) {
      updateLr({ variables: { id: editingId, input } })
    } else {
      createLr({ variables: { input } })
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      title: '',
      docDateYmd: format(new Date(), 'yyyy-MM-dd'),
      status: 'DRAFT',
      payPeriodStartYmd: '',
      payPeriodEndYmd: '',
      employeeNo: '',
      employeeName: '',
      loanReference: '',
      repaymentAmount: '',
      remarks: '',
    })
    setOpen(true)
  }

  const openEdit = (r: Row) => {
    setEditingId(r.id)
    setForm({
      title: r.title || '',
      docDateYmd: toYmd(r.docDate) || format(new Date(), 'yyyy-MM-dd'),
      status: (STATUS_OPTIONS.find((o) => o.value === (r.status || '').toUpperCase())?.value ||
        'DRAFT') as (typeof STATUS_OPTIONS)[number]['value'],
      payPeriodStartYmd: toYmd(r.payPeriodStart),
      payPeriodEndYmd: toYmd(r.payPeriodEnd),
      employeeNo: r.employeeNo || '',
      employeeName: r.employeeName || '',
      loanReference: r.loanReference || '',
      repaymentAmount: Number.isFinite(r.repaymentAmount) ? String(r.repaymentAmount) : '',
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization to use loan repayment.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-800 mb-1">
            <Wallet className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Others</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Loan repayment</h1>
          <p className="text-gray-500 mt-1">
            Record employee loan recoveries: deduction amount, loan reference, and the pay period they apply
            to.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-amber-800 hover:bg-amber-900 text-white shrink-0">
          <Plus className="h-4 w-4 mr-2" /> New record
        </Button>
      </div>

      {banner && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${
            banner.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {banner.ok && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {banner.text}
        </div>
      )}

      {open && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit loan repayment' : 'New loan repayment'}
            </span>
            <button
              type="button"
              onClick={closeDialog}
              className="text-blue-200 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3">
                <InputFloating
                  id="lr-title"
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                id="lr-docdate"
                label="Document date"
                type="date"
                value={form.docDateYmd}
                onChange={(e) => setForm((f) => ({ ...f, docDateYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Status"
                name="lr-status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: (e as React.ChangeEvent<HTMLSelectElement>).target
                      .value as (typeof f)['status'],
                  }))
                }
                options={STATUS_SELECT_OPTIONS}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="lr-amount"
                label="Repayment amount"
                type="number"
                min="0"
                step="0.01"
                value={form.repaymentAmount}
                onChange={(e) => setForm((f) => ({ ...f, repaymentAmount: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                id="lr-empno"
                label="Employee no."
                value={form.employeeNo}
                onChange={(e) => setForm((f) => ({ ...f, employeeNo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="lr-empname"
                label="Employee name"
                value={form.employeeName}
                onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="lr-loanref"
                label="Loan reference"
                value={form.loanReference}
                onChange={(e) => setForm((f) => ({ ...f, loanReference: e.target.value }))}
                className="h-7 text-xs"
                placeholder="Application / account no."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                id="lr-pstart"
                label="Pay period start"
                type="date"
                value={form.payPeriodStartYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodStartYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="lr-pend"
                label="Pay period end"
                type="date"
                value={form.payPeriodEndYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodEndYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <div className="hidden min-[600px]:block" aria-hidden />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <InputFloating
                id="lr-remarks"
                label="Remarks"
                multiline
                rows={3}
                value={form.remarks}
                onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                className="text-xs min-h-[72px]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={closeDialog} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submit}
                disabled={busy}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[160px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : editingId ? 'Update' : 'Save loan repayment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-amber-800 to-amber-900 text-white text-sm font-semibold">
          Loan repayments
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No records yet. Add a repayment line for payroll deduction tracking.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Document</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Loan ref.</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 text-right">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Doc date</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-amber-50/40">
                  <TableCell>
                    <div className="font-mono text-sm font-medium">{r.docNumber}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{r.title || '—'}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-800">
                    {r.employeeName || r.employeeNo ? (
                      <>
                        {r.employeeName || '—'}
                        {r.employeeNo ? (
                          <span className="block text-xs text-gray-500">{r.employeeNo}</span>
                        ) : null}
                      </>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 font-mono">{r.loanReference || '—'}</TableCell>
                  <TableCell className="text-sm text-right font-mono tabular-nums">
                    {money.format(r.repaymentAmount ?? 0)}
                  </TableCell>
                  <TableCell className="text-sm">{toYmd(r.docDate) || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadgeClass(r.status)}>
                      {STATUS_OPTIONS.find((o) => o.value === (r.status || '').toUpperCase())?.label ||
                        r.status ||
                        '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(r)}
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (confirm(`Remove loan repayment “${r.docNumber}”?`)) {
                          deleteLr({ variables: { id: r.id } })
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
