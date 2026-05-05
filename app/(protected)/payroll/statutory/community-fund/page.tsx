'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { HandHeart, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type FundBasis = 'PERCENT_WAGE' | 'FIXED_PER_PAY'

type CommunityFundRow = {
  id: string
  rowRef: string
  fundCode: string
  fundName: string
  basis: FundBasis
  rateValue: number
  monthlyCap: number
  effectiveFromYmd: string
  active: boolean
  remarks: string
}

const BASIS_OPTIONS: ReadonlyArray<{ value: FundBasis; label: string }> = [
  { value: 'PERCENT_WAGE', label: '% of qualifying wage' },
  { value: 'FIXED_PER_PAY', label: 'Fixed per pay run' },
]

const BASIS_SELECT = BASIS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextRef(rows: CommunityFundRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^CCF-(\d+)$/i.exec((r.rowRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `CCF-${String(max + 1).padStart(4, '0')}`
}

const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function parseFundRecord(r: { id: string; data: string }): CommunityFundRow {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const basis =
      typeof o.basis === 'string' && BASIS_OPTIONS.some((b) => b.value === o.basis)
        ? (o.basis as FundBasis)
        : 'PERCENT_WAGE'
    return {
      id: r.id,
      rowRef: typeof o.rowRef === 'string' ? o.rowRef : '',
      fundCode: typeof o.fundCode === 'string' ? o.fundCode : '',
      fundName: typeof o.fundName === 'string' ? o.fundName : '',
      basis,
      rateValue: typeof o.rateValue === 'number' ? o.rateValue : 0,
      monthlyCap: typeof o.monthlyCap === 'number' ? o.monthlyCap : 0,
      effectiveFromYmd: typeof o.effectiveFromYmd === 'string' ? o.effectiveFromYmd : '',
      active: typeof o.active === 'boolean' ? o.active : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      rowRef: '',
      fundCode: '',
      fundName: '',
      basis: 'PERCENT_WAGE',
      rateValue: 0,
      monthlyCap: 0,
      effectiveFromYmd: '',
      active: true,
      remarks: '',
    }
  }
}

function emptyForm() {
  return {
    fundCode: '',
    fundName: '',
    basis: 'PERCENT_WAGE' as FundBasis,
    rateValue: '',
    monthlyCap: '',
    effectiveFromYmd: '',
    active: true,
    remarks: '',
  }
}

export default function CommunityContributionFundPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.COMMUNITY_FUND },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () => ((data?.payrolluirecords as { id: string; data: string }[]) ?? []).map(parseFundRecord),
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
      setBanner({ ok: true, text: 'Community fund saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Community fund updated.' })
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
    if (!form.fundCode.trim()) {
      setBanner({ ok: false, text: 'Fund code is required (e.g. CDAC, MBMF).' })
      return
    }
    const rawR = form.rateValue.trim()
    const rv = rawR === '' ? 0 : Number.parseFloat(rawR)
    if (rawR !== '' && Number.isNaN(rv)) {
      setBanner({ ok: false, text: 'Rate / amount must be numeric.' })
      return
    }
    if (rv < 0) {
      setBanner({ ok: false, text: 'Rate / amount cannot be negative.' })
      return
    }
    if (form.basis === 'PERCENT_WAGE' && rv > 100) {
      setBanner({ ok: false, text: 'Percent of wage cannot exceed 100.' })
      return
    }
    const rawC = form.monthlyCap.trim()
    const cap = rawC === '' ? 0 : Number.parseFloat(rawC)
    if (rawC !== '' && (Number.isNaN(cap) || cap < 0)) {
      setBanner({ ok: false, text: 'Monthly cap must be blank or a non-negative amount.' })
      return
    }

    const codeTrim = form.fundCode.trim().toUpperCase()
    const rowRef = editingId ? rows.find((r) => r.id === editingId)?.rowRef ?? nextRef(rows) : nextRef(rows)

    const payload = {
      rowRef,
      fundCode: codeTrim,
      fundName: form.fundName.trim(),
      basis: form.basis,
      rateValue: rv,
      monthlyCap: cap,
      effectiveFromYmd: form.effectiveFromYmd,
      active: form.active,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.COMMUNITY_FUND,
      code: codeTrim,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: CommunityFundRow) => {
    setEditingId(r.id)
    setForm({
      fundCode: r.fundCode || '',
      fundName: r.fundName || '',
      basis: r.basis,
      rateValue: String(r.rateValue ?? 0),
      monthlyCap: r.monthlyCap > 0 ? String(r.monthlyCap) : '',
      effectiveFromYmd: r.effectiveFromYmd || '',
      active: Boolean(r.active),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (a.fundCode || '').localeCompare(b.fundCode || '')),
    [rows],
  )

  if (!orgId) {
    return <p className="text-sm text-gray-500">Select an organization for community contribution funds.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <HandHeart className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Statutory</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Community contribution fund</h1>
          <p className="text-gray-500 mt-1">
            Self-help group and community levies (e.g. CDAC, MBMF, SINDA, ECF) with percent-of-wage or flat amounts and
            optional monthly caps. Persisted on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add fund
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
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit fund' : 'New fund'}</span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="ccf-code"
                label="Fund code"
                value={form.fundCode}
                onChange={(e) => setForm((f) => ({ ...f, fundCode: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ccf-name"
                label="Fund name"
                value={form.fundName}
                onChange={(e) => setForm((f) => ({ ...f, fundName: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <SelectFloating
              label="Calculation basis"
              name="ccf-basis"
              value={form.basis}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  basis: (typeof v === 'string'
                    ? v
                    : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as FundBasis,
                }))
              }
              options={BASIS_SELECT}
              className="h-7 text-xs"
              placeholder="Select…"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="ccf-rate"
                label={form.basis === 'PERCENT_WAGE' ? 'Percent of wage' : 'Fixed amount'}
                value={form.rateValue}
                onChange={(e) => setForm((f) => ({ ...f, rateValue: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ccf-cap"
                label="Monthly cap (optional)"
                value={form.monthlyCap}
                onChange={(e) => setForm((f) => ({ ...f, monthlyCap: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="ccf-ef"
                label="Effective from"
                type="date"
                value={form.effectiveFromYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFromYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              Active
            </label>
            <InputFloating
              id="ccf-rem"
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
          Community funds register
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No fund rules yet. Align codes with IRAS / CPF community contribution schedules.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Ref</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Fund</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Basis</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Value / cap</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Effective</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">State</TableHead>
                  <TableHead className="w-[92px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-mono text-xs text-gray-600">{r.rowRef}</TableCell>
                    <TableCell>
                      <div className="font-mono text-sm font-medium">{r.fundCode}</div>
                      <div className="text-xs text-gray-500">{r.fundName || '—'}</div>
                    </TableCell>
                    <TableCell className="text-sm">{BASIS_OPTIONS.find((b) => b.value === r.basis)?.label ?? r.basis}</TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {r.basis === 'PERCENT_WAGE'
                        ? `${r.rateValue}%`
                        : money.format(Number.isFinite(r.rateValue) ? r.rateValue : 0)}
                      {r.monthlyCap > 0 ? (
                        <span className="block text-xs text-gray-500">Cap {money.format(r.monthlyCap)}</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm">{r.effectiveFromYmd || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          r.active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }
                      >
                        {r.active ? 'Active' : 'Inactive'}
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
                          if (typeof window !== 'undefined' && window.confirm(`Remove “${r.fundCode}”?`)) {
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
