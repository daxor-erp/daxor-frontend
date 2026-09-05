'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Landmark, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type FwlTier = 'HIGH_SKILL' | 'MID_SKILL' | 'BASIC' | 'CUSTOM'

type FwlQualificationRow = {
  id: string
  rowRef: string
  levyCode: string
  levyName: string
  tier: FwlTier
  levyAmountMonthly: number
  effectiveFromYmd: string
  effectiveToYmd: string
  sectorMemo: string
  active: boolean
  remarks: string
  approvalStatus: string
}

const TIER_LABELS: ReadonlyArray<{ value: FwlTier; label: string }> = [
  { value: 'HIGH_SKILL', label: 'Higher-skilled levy band' },
  { value: 'MID_SKILL', label: 'Middle-skilled / R2' },
  { value: 'BASIC', label: 'Basic / worker tier' },
  { value: 'CUSTOM', label: 'Custom tariff' },
]

const TIER_SELECT = TIER_LABELS.map((t) => ({ value: t.value, label: t.label }))

function nextRowRef(rows: FwlQualificationRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^FWL-(\d+)$/i.exec((r.rowRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `FWL-${String(max + 1).padStart(4, '0')}`
}

function parseFwlRecord(r: { id: string; data: string }): Omit<FwlQualificationRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const tier = typeof o.tier === 'string' && TIER_LABELS.some((t) => t.value === o.tier) ? (o.tier as FwlTier) : 'CUSTOM'
    return {
      id: r.id,
      rowRef: typeof o.rowRef === 'string' ? o.rowRef : '',
      levyCode: typeof o.levyCode === 'string' ? o.levyCode : '',
      levyName: typeof o.levyName === 'string' ? o.levyName : '',
      tier,
      levyAmountMonthly: typeof o.levyAmountMonthly === 'number' ? o.levyAmountMonthly : 0,
      effectiveFromYmd: typeof o.effectiveFromYmd === 'string' ? o.effectiveFromYmd : '',
      effectiveToYmd: typeof o.effectiveToYmd === 'string' ? o.effectiveToYmd : '',
      sectorMemo: typeof o.sectorMemo === 'string' ? o.sectorMemo : '',
      active: typeof o.active === 'boolean' ? o.active : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      rowRef: '',
      levyCode: '',
      levyName: '',
      tier: 'BASIC',
      levyAmountMonthly: 0,
      effectiveFromYmd: '',
      effectiveToYmd: '',
      sectorMemo: '',
      active: true,
      remarks: '',
    }
  }
}

const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function emptyForm() {
  return {
    levyCode: '',
    levyName: '',
    tier: 'BASIC' as FwlTier,
    levyAmountMonthly: '',
    effectiveFromYmd: '',
    effectiveToYmd: '',
    sectorMemo: '',
    active: true,
    remarks: '',
  }
}

export default function FwlQualificationSetupPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.FWL_QUALIFICATION },
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
        ...parseFwlRecord(rec),
        approvalStatus: rec.approvalStatus ?? 'none',
      })),
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
      setBanner({ ok: true, text: 'FWL qualification saved to the database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'FWL qualification updated.' })
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
    if (!form.levyCode.trim()) {
      setBanner({ ok: false, text: 'Levy / qualification code is required.' })
      return
    }
    const rawAmt = form.levyAmountMonthly.trim()
    const amt = rawAmt === '' ? 0 : Number.parseFloat(rawAmt)
    if (rawAmt !== '' && Number.isNaN(amt)) {
      setBanner({ ok: false, text: 'Monthly levy amount must be numeric.' })
      return
    }
    if ((amt ?? 0) < 0) {
      setBanner({ ok: false, text: 'Levy cannot be negative.' })
      return
    }

    if (form.effectiveFromYmd && form.effectiveToYmd) {
      if (form.effectiveToYmd < form.effectiveFromYmd) {
        setBanner({
          ok: false,
          text: 'Effective “to” date must not be before “from”. Leave “to” empty if open-ended.',
        })
        return
      }
    }

    const levyCodeTrim = form.levyCode.trim().toUpperCase()
    const rowRef =
      editingId ? rows.find((r) => r.id === editingId)?.rowRef ?? nextRowRef(rows) : nextRowRef(rows)

    const payload = {
      rowRef,
      levyCode: levyCodeTrim,
      levyName: form.levyName.trim(),
      tier: form.tier,
      levyAmountMonthly: amt ?? 0,
      effectiveFromYmd: form.effectiveFromYmd,
      effectiveToYmd: form.effectiveToYmd,
      sectorMemo: form.sectorMemo.trim(),
      active: form.active,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.FWL_QUALIFICATION,
      code: levyCodeTrim,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: FwlQualificationRow) => {
    setEditingId(r.id)
    setForm({
      levyCode: r.levyCode || '',
      levyName: r.levyName || '',
      tier: r.tier,
      levyAmountMonthly: String(r.levyAmountMonthly ?? 0),
      effectiveFromYmd: r.effectiveFromYmd || '',
      effectiveToYmd: r.effectiveToYmd || '',
      sectorMemo: r.sectorMemo || '',
      active: Boolean(r.active),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(() => [...rows].sort((a, b) => a.levyCode.localeCompare(b.levyCode)), [rows])

  if (!orgId) {
    return <p className="erp-page-desc">Select an organization to maintain FWL qualifications.</p>
  }

  return (
    <div className="erp-shell">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <Landmark className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Setup</span>
          </div>
          <h1 className="erp-page-title">FWL qualification</h1>
          <p className="text-gray-500 mt-1">
            Foreign-worker levy tiers and tariff amounts commonly feed payroll costing and budgeting. Rows are persisted per
            organization on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add qualification
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
              {editingId ? 'Edit FWL qualification' : 'New FWL qualification'}
            </span>
            <button type="button" onClick={closeDialog} className="text-primary-foreground/80 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="fw-code"
                label="Qualification code"
                value={form.levyCode}
                onChange={(e) => setForm((f) => ({ ...f, levyCode: e.target.value }))}
                className="h-7 text-xs"
                placeholder="R2_UNSK_Q1"
              />
              <InputFloating
                id="fw-name"
                label="Description"
                value={form.levyName}
                onChange={(e) => setForm((f) => ({ ...f, levyName: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SelectFloating
                label="Tier / band"
                name="fw-tier"
                value={form.tier}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    tier: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as FwlTier,
                  }))
                }
                options={TIER_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="fw-amt"
                label="Monthly levy ($)"
                value={form.levyAmountMonthly}
                onChange={(e) => setForm((f) => ({ ...f, levyAmountMonthly: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="fw-from"
                label="Effective from"
                type="date"
                value={form.effectiveFromYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFromYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="fw-to"
                label="Effective to (optional)"
                type="date"
                value={form.effectiveToYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveToYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <InputFloating
              id="fw-sector"
              label="Sector / policy memo"
              value={form.sectorMemo}
              onChange={(e) => setForm((f) => ({ ...f, sectorMemo: e.target.value }))}
              className="h-7 text-xs"
              placeholder="Construction quota, dormitory credit, …"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              Active for selection in payroll costing
            </label>
            <InputFloating
              id="fw-rem"
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
          FWL qualifications
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No levy qualifications yet. Add bands that match workforce policy tables for your subsidiaries.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Ref</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Band</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Monthly levy</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Validity</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">State</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[96px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono text-xs text-gray-600">{r.rowRef}</TableCell>
                  <TableCell>
                    <div className="font-mono text-sm font-medium">{r.levyCode}</div>
                    <div className="text-xs text-gray-500">{r.levyName || '—'}</div>
                  </TableCell>
                  <TableCell className="text-sm">{TIER_LABELS.find((t) => t.value === r.tier)?.label ?? r.tier}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {money.format(Number.isFinite(r.levyAmountMonthly) ? r.levyAmountMonthly : 0)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {r.effectiveFromYmd ? r.effectiveFromYmd : '—'}
                    {' → '}
                    {r.effectiveToYmd ? r.effectiveToYmd : 'open'}
                  </TableCell>
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
                        if (typeof window !== 'undefined' && window.confirm(`Remove “${r.levyCode}”?`)) {
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
