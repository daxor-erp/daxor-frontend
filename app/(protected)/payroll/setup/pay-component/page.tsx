'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { SlidersHorizontal, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type ComponentKind = 'EARNING' | 'DEDUCTION' | 'STATUTORY'
type CalcBasis = 'FIXED_AMOUNT' | 'PERCENT_BASIC' | 'PERCENT_GROSS'

type PayComponentRow = {
  id: string
  componentCode: string
  shortCode: string
  name: string
  kind: ComponentKind
  basis: CalcBasis
  value: number
  taxable: boolean
  active: boolean
  remarks: string
  approvalStatus: string
}

const KIND_OPTIONS: ReadonlyArray<{ value: ComponentKind; label: string }> = [
  { value: 'EARNING', label: 'Earning' },
  { value: 'DEDUCTION', label: 'Deduction' },
  { value: 'STATUTORY', label: 'Statutory' },
]

const BASIS_OPTIONS: ReadonlyArray<{ value: CalcBasis; label: string }> = [
  { value: 'FIXED_AMOUNT', label: 'Fixed amount' },
  { value: 'PERCENT_BASIC', label: '% of basic' },
  { value: 'PERCENT_GROSS', label: '% of gross' },
]

const KIND_SELECT = KIND_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
const BASIS_SELECT = BASIS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextComponentCode(rows: PayComponentRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^PC-(\d+)$/i.exec((r.componentCode || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `PC-${String(max + 1).padStart(4, '0')}`
}

function parsePayComponentRecord(r: { id: string; data: string }): Omit<PayComponentRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const k = typeof o.kind === 'string' ? o.kind : 'EARNING'
    const kind = KIND_OPTIONS.some((x) => x.value === k) ? (k as ComponentKind) : 'EARNING'
    const b = typeof o.basis === 'string' ? o.basis : 'FIXED_AMOUNT'
    const basis = BASIS_OPTIONS.some((x) => x.value === b) ? (b as CalcBasis) : 'FIXED_AMOUNT'
    return {
      id: r.id,
      componentCode: typeof o.componentCode === 'string' ? o.componentCode : '',
      shortCode: typeof o.shortCode === 'string' ? o.shortCode : '',
      name: typeof o.name === 'string' ? o.name : '',
      kind,
      basis,
      value: typeof o.value === 'number' ? o.value : 0,
      taxable: typeof o.taxable === 'boolean' ? o.taxable : true,
      active: typeof o.active === 'boolean' ? o.active : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      componentCode: '',
      shortCode: '',
      name: '',
      kind: 'EARNING',
      basis: 'FIXED_AMOUNT',
      value: 0,
      taxable: true,
      active: true,
      remarks: '',
    }
  }
}

const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })

function emptyForm() {
  return {
    shortCode: '',
    name: '',
    kind: 'EARNING' as ComponentKind,
    basis: 'FIXED_AMOUNT' as CalcBasis,
    value: '',
    taxable: true,
    active: true,
    remarks: '',
  }
}

export default function PayComponentSetupPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.PAY_COMPONENT },
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
        ...parsePayComponentRecord(rec),
        approvalStatus: rec.approvalStatus ?? 'none',
      })),
    [data],
  )

  const [createRec, { loading: creating }] = useMutation(CREATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Component saved to the database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Component updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteRec] = useMutation(DELETE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Component removed.' })
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

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    if (!form.shortCode.trim()) {
      setBanner({ ok: false, text: 'Short code is required (e.g. BASIC, TRANSPORT).' })
      return
    }
    const rawV = form.value.trim()
    const num = rawV === '' ? 0 : Number.parseFloat(rawV)
    if (rawV !== '' && Number.isNaN(num)) {
      setBanner({ ok: false, text: 'Value must be a number (amount or percent).' })
      return
    }

    const componentCode =
      editingId ? rows.find((r) => r.id === editingId)?.componentCode ?? nextComponentCode(rows) : nextComponentCode(rows)
    const shortCode = form.shortCode.trim().toUpperCase()

    const payload = {
      componentCode,
      shortCode,
      name: form.name.trim(),
      kind: form.kind,
      basis: form.basis,
      value: num < 0 ? 0 : num,
      taxable: form.taxable,
      active: form.active,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.PAY_COMPONENT,
      code: shortCode,
      data: JSON.stringify(payload),
    }

    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: PayComponentRow) => {
    setEditingId(r.id)
    setForm({
      shortCode: r.shortCode || '',
      name: r.name || '',
      kind: r.kind,
      basis: r.basis,
      value: String(r.value ?? 0),
      taxable: Boolean(r.taxable),
      active: Boolean(r.active),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (a.shortCode || '').localeCompare(b.shortCode || '')),
    [rows],
  )

  if (!orgId) {
    return <p className="erp-page-desc">Select an organization to edit pay components.</p>
  }

  return (
    <div className="erp-shell">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <SlidersHorizontal className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Setup</span>
          </div>
          <h1 className="erp-page-title">Pay component</h1>
          <p className="text-gray-500 mt-1">
            Define reusable salary heads (basic, allowances, deductions, statutory) and how amounts are calculated.
            Persisted per organization on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add component
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
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit pay component' : 'New pay component'}
            </span>
            <button type="button" onClick={closeDialog} className="text-primary-foreground/80 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pc-short"
                label="Short code"
                value={form.shortCode}
                onChange={(e) => setForm((f) => ({ ...f, shortCode: e.target.value }))}
                className="h-7 text-xs"
                placeholder="BASIC"
              />
              <InputFloating
                id="pc-name"
                label="Description"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SelectFloating
                label="Type"
                name="pc-kind"
                value={form.kind}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    kind: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as ComponentKind,
                  }))
                }
                options={KIND_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <SelectFloating
                label="Calculation basis"
                name="pc-basis"
                value={form.basis}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    basis: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as CalcBasis,
                  }))
                }
                options={BASIS_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="pc-val"
                label={form.basis === 'FIXED_AMOUNT' ? 'Amount' : 'Percent'}
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.taxable}
                  onChange={(e) => setForm((f) => ({ ...f, taxable: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Subject to tax
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Active
              </label>
            </div>
            <InputFloating
              id="pc-rem"
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
          Pay components
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No components configured. Create earnings and deductions before mapping them to employees or batches.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">ERP ref</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Description</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Type</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Basis</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Value</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Flags</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[96px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono text-xs text-gray-500">{r.componentCode || '—'}</TableCell>
                  <TableCell className="font-mono text-sm font-medium">{r.shortCode}</TableCell>
                  <TableCell className="text-sm text-gray-800">{r.name || '—'}</TableCell>
                  <TableCell className="text-sm">{KIND_OPTIONS.find((k) => k.value === r.kind)?.label ?? r.kind}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {BASIS_OPTIONS.find((b) => b.value === r.basis)?.label ?? r.basis}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {r.basis === 'FIXED_AMOUNT' ? money.format(Number.isFinite(r.value) ? r.value : 0) : `${r.value}%`}
                  </TableCell>
                  <TableCell className="text-xs gap-1 flex flex-wrap">
                    <Badge
                      variant="outline"
                      className={
                        r.active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }
                    >
                      {r.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {r.taxable ? 'Taxable' : 'Non-tax'}
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
                        if (typeof window !== 'undefined' && window.confirm(`Delete component “${r.shortCode}”?`)) {
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
