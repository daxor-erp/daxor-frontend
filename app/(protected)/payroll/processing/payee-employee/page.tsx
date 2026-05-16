'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { ChevronRight, UserCircle, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type PayMethod = 'BANK_TRANSFER' | 'CHEQUE' | 'CASH'

type PayeeRow = {
  id: string
  employeeNo: string
  employeeName: string
  payBatchRef: string
  paymentMethod: PayMethod
  netPay: number
  included: boolean
  remarks: string
  approvalStatus: string
}

const METHOD_OPTIONS: ReadonlyArray<{ value: PayMethod; label: string }> = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CASH', label: 'Cash' },
]

const METHOD_SELECT = METHOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function payeeRecordCode(employeeNo: string, payBatchRef: string): string {
  return `${employeeNo.trim()}::${payBatchRef.trim()}`.replace(/::+$/, '').replace(/^::/, '')
}

function parsePayeeRecord(r: { id: string; data: string }): Omit<PayeeRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const pm = typeof o.paymentMethod === 'string' ? o.paymentMethod : 'BANK_TRANSFER'
    const paymentMethod = METHOD_OPTIONS.some((m) => m.value === pm) ? (pm as PayMethod) : 'BANK_TRANSFER'
    return {
      id: r.id,
      employeeNo: typeof o.employeeNo === 'string' ? o.employeeNo : '',
      employeeName: typeof o.employeeName === 'string' ? o.employeeName : '',
      payBatchRef: typeof o.payBatchRef === 'string' ? o.payBatchRef : '',
      paymentMethod,
      netPay: typeof o.netPay === 'number' ? o.netPay : 0,
      included: typeof o.included === 'boolean' ? o.included : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      employeeNo: '',
      employeeName: '',
      payBatchRef: '',
      paymentMethod: 'BANK_TRANSFER',
      netPay: 0,
      included: true,
      remarks: '',
    }
  }
}

const money = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function emptyForm() {
  return {
    employeeNo: '',
    employeeName: '',
    payBatchRef: '',
    paymentMethod: 'BANK_TRANSFER' as PayMethod,
    netPay: '',
    included: true,
    remarks: '',
  }
}

export default function PayeeEmployeePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.PAYEE_EMPLOYEE },
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
        ...parsePayeeRecord(rec),
        approvalStatus: rec.approvalStatus ?? 'none',
      })),
    [data],
  )

  const [createRec, { loading: creating }] = useMutation(CREATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Payee line saved to the database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Payee line updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteRec] = useMutation(DELETE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Line removed.' })
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
    const raw = form.netPay.trim()
    const net = raw === '' ? 0 : Number.parseFloat(raw)
    if (raw !== '' && Number.isNaN(net)) {
      setBanner({ ok: false, text: 'Net pay must be a valid amount.' })
      return
    }
    if (!form.employeeNo.trim()) {
      setBanner({ ok: false, text: 'Employee number is required.' })
      return
    }

    const payload = {
      employeeNo: form.employeeNo.trim(),
      employeeName: form.employeeName.trim(),
      payBatchRef: form.payBatchRef.trim(),
      paymentMethod: form.paymentMethod,
      netPay: net < 0 ? 0 : net,
      included: form.included,
      remarks: form.remarks.trim(),
    }
    const code = payeeRecordCode(payload.employeeNo, payload.payBatchRef) || payload.employeeNo
    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.PAYEE_EMPLOYEE,
      code,
      data: JSON.stringify(payload),
    }

    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: PayeeRow) => {
    setEditingId(r.id)
    setForm({
      employeeNo: r.employeeNo || '',
      employeeName: r.employeeName || '',
      payBatchRef: r.payBatchRef || '',
      paymentMethod: r.paymentMethod,
      netPay: r.netPay !== undefined && r.netPay !== null ? String(r.netPay) : '',
      included: Boolean(r.included),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const totals = useMemo(() => {
    let includedPay = 0
    let count = 0
    for (const r of rows) {
      if (r.included) {
        includedPay += Number.isFinite(r.netPay) ? r.netPay : 0
        count += 1
      }
    }
    return { includedPay, count }
  }, [rows])

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization to manage payees.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        <Link href="/payroll-management" className="hover:text-gray-800 hover:underline">
          Payroll
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <Link href="/payroll/processing/payee-employee" className="hover:text-gray-800 hover:underline font-medium">
          Payroll processing
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <span className="text-gray-700 font-medium">Payee employee</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <UserCircle className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Processing</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payee employee</h1>
          <p className="text-gray-500 mt-1">
            Decide who is paid inside a batch and by which method. Rows are saved to your organization database.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-9 text-xs">
            <Link href="/payroll/processing/pay-batch">Pay batches</Link>
          </Button>
          <Button onClick={openCreate} className="bg-slate-800 hover:bg-slate-900 text-white h-9 text-xs">
            <Plus className="h-4 w-4 mr-2" /> Add payee line
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-500">Included payees</p>
          <p className="text-2xl font-bold tabular-nums text-slate-900">{totals.count}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-emerald-800">Included net total</p>
          <p className="text-2xl font-bold tabular-nums text-emerald-900">{money.format(totals.includedPay)}</p>
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
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit payee line' : 'New payee line'}
            </span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pe-no"
                label="Employee number"
                value={form.employeeNo}
                onChange={(e) => setForm((f) => ({ ...f, employeeNo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pe-name"
                label="Employee name"
                value={form.employeeName}
                onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="pe-batchref"
                label="Pay batch reference"
                value={form.payBatchRef}
                onChange={(e) => setForm((f) => ({ ...f, payBatchRef: e.target.value }))}
                className="h-7 text-xs"
                placeholder="e.g. PB-0001"
              />
              <SelectFloating
                label="Payment method"
                name="pe-method"
                value={form.paymentMethod}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    paymentMethod: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as PayMethod,
                  }))
                }
                options={METHOD_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="pe-net"
                label="Net pay"
                value={form.netPay}
                onChange={(e) => setForm((f) => ({ ...f, netPay: e.target.value }))}
                className="h-7 text-xs"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="pe-included"
                type="checkbox"
                checked={form.included}
                onChange={(e) => setForm((f) => ({ ...f, included: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="pe-included" className="text-sm text-gray-700">
                Include this employee in payout
              </label>
            </div>
            <InputFloating
              id="pe-remarks"
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
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : editingId ? 'Update' : 'Save payee'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold">
          Payees in selection
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No payees yet. Add rows to assemble the employee side of payroll processing for this cycle.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Employee</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Batch ref</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Method</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Net pay</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Include</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="font-mono text-xs text-gray-600">{r.employeeNo}</div>
                    <div className="text-sm text-gray-900">{r.employeeName || '—'}</div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{r.payBatchRef || '—'}</TableCell>
                  <TableCell className="text-sm">
                    {METHOD_OPTIONS.find((m) => m.value === r.paymentMethod)?.label ?? r.paymentMethod}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">{money.format(Number.isFinite(r.netPay) ? r.netPay : 0)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        r.included
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }
                    >
                      {r.included ? 'Included' : 'Excluded'}
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
                        const label = r.employeeNo || 'this row'
                        if (typeof window !== 'undefined' && window.confirm(`Remove payee ${label}?`)) {
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
