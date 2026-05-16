'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GraduationCap, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
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

type SdlMasterRow = {
  id: string
  rowRef: string
  levyLabel: string
  levyPct: number
  minLevyMonthly: number
  wageCeiling: number
  effectiveFromYmd: string
  effectiveToYmd: string
  active: boolean
  remarks: string
  approvalStatus: string
}

function nextRef(rows: SdlMasterRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^SDL-(\d+)$/i.exec((r.rowRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `SDL-${String(max + 1).padStart(4, '0')}`
}

const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function parseSdlRecord(r: { id: string; data: string }): Omit<SdlMasterRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    return {
      id: r.id,
      rowRef: typeof o.rowRef === 'string' ? o.rowRef : '',
      levyLabel: typeof o.levyLabel === 'string' ? o.levyLabel : '',
      levyPct: typeof o.levyPct === 'number' ? o.levyPct : 0,
      minLevyMonthly: typeof o.minLevyMonthly === 'number' ? o.minLevyMonthly : 0,
      wageCeiling: typeof o.wageCeiling === 'number' ? o.wageCeiling : 0,
      effectiveFromYmd: typeof o.effectiveFromYmd === 'string' ? o.effectiveFromYmd : '',
      effectiveToYmd: typeof o.effectiveToYmd === 'string' ? o.effectiveToYmd : '',
      active: typeof o.active === 'boolean' ? o.active : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      rowRef: '',
      levyLabel: '',
      levyPct: 0,
      minLevyMonthly: 0,
      wageCeiling: 0,
      effectiveFromYmd: '',
      effectiveToYmd: '',
      active: true,
      remarks: '',
    }
  }
}

function emptyForm() {
  return {
    levyLabel: '',
    levyPct: '',
    minLevyMonthly: '',
    wageCeiling: '',
    effectiveFromYmd: '',
    effectiveToYmd: '',
    active: true,
    remarks: '',
  }
}

export default function SdlMasterPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.SDL_MASTER },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () =>
      ((data?.payrolluirecords as PayrollUiRecordQueryRow[]) ?? []).map((rec) =>
        withOrgApproval<SdlMasterRow>(rec, parseSdlRecord(rec)),
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
      setBanner({ ok: true, text: 'SDL tier saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'SDL tier updated.' })
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
    const rawP = form.levyPct.trim()
    const pct = rawP === '' ? 0 : Number.parseFloat(rawP)
    if (rawP !== '' && (Number.isNaN(pct) || pct < 0 || pct > 100)) {
      setBanner({ ok: false, text: 'Levy percentage must be 0–100.' })
      return
    }
    const parseMoney = (raw: string, label: string): number | null => {
      const t = raw.trim()
      if (t === '') return 0
      const n = Number.parseFloat(t)
      if (Number.isNaN(n) || n < 0) {
        setBanner({ ok: false, text: `${label} must be blank or a non-negative amount.` })
        return null
      }
      return n
    }
    const minL = parseMoney(form.minLevyMonthly, 'Minimum levy')
    if (minL === null) return
    const ceil = parseMoney(form.wageCeiling, 'Contribution ceiling')
    if (ceil === null) return

    if (
      form.effectiveFromYmd &&
      form.effectiveToYmd &&
      form.effectiveToYmd < form.effectiveFromYmd
    ) {
      setBanner({ ok: false, text: 'Effective “to” cannot be before “from”.' })
      return
    }

    const rowRef = editingId ? rows.find((r) => r.id === editingId)?.rowRef ?? nextRef(rows) : nextRef(rows)

    const payload = {
      rowRef,
      levyLabel: form.levyLabel.trim(),
      levyPct: pct,
      minLevyMonthly: minL,
      wageCeiling: ceil,
      effectiveFromYmd: form.effectiveFromYmd,
      effectiveToYmd: form.effectiveToYmd,
      active: form.active,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.SDL_MASTER,
      code: rowRef,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: SdlMasterRow) => {
    setEditingId(r.id)
    setForm({
      levyLabel: r.levyLabel || '',
      levyPct: String(r.levyPct ?? 0),
      minLevyMonthly: r.minLevyMonthly > 0 ? String(r.minLevyMonthly) : '',
      wageCeiling: r.wageCeiling > 0 ? String(r.wageCeiling) : '',
      effectiveFromYmd: r.effectiveFromYmd || '',
      effectiveToYmd: r.effectiveToYmd || '',
      active: Boolean(r.active),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const fd = (b.effectiveFromYmd || '').localeCompare(a.effectiveFromYmd || '')
        return fd !== 0 ? fd : (a.rowRef || '').localeCompare(b.rowRef || '')
      }),
    [rows],
  )

  if (!orgId) {
    return <p className="text-sm text-gray-500">Select an organization for SDL master records.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Statutory</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Development Levy (SDL) master</h1>
          <p className="text-gray-500 mt-1">
            Employer SDL percentage, optional wage ceiling, and effective dating. Stored per organization on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add SDL tier
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
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit SDL' : 'New SDL row'}</span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <InputFloating
              id="sdl-lbl"
              label="Label / policy note"
              value={form.levyLabel}
              onChange={(e) => setForm((f) => ({ ...f, levyLabel: e.target.value }))}
              className="h-7 text-xs"
              placeholder="e.g. Default employer SDL"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                id="sdl-pct"
                label="SDL %"
                value={form.levyPct}
                onChange={(e) => setForm((f) => ({ ...f, levyPct: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="sdl-min"
                label="Minimum monthly levy"
                value={form.minLevyMonthly}
                onChange={(e) => setForm((f) => ({ ...f, minLevyMonthly: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="sdl-ceil"
                label="Applicable wage ceiling (optional)"
                value={form.wageCeiling}
                onChange={(e) => setForm((f) => ({ ...f, wageCeiling: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="sdl-ef"
                label="Effective from"
                type="date"
                value={form.effectiveFromYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFromYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="sdl-et"
                label="Effective to (optional)"
                type="date"
                value={form.effectiveToYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveToYmd: e.target.value }))}
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
              id="sdl-rem"
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
          SDL tiers
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No SDL configuration. Populate rates that match Workforce Singapore levy circulars for your payroll year.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Ref</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Label</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">%</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Min / cap</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Validity</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">State</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                  <TableHead className="w-[92px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-mono text-xs text-gray-600">{r.rowRef}</TableCell>
                    <TableCell className="text-sm text-gray-900">{r.levyLabel || '—'}</TableCell>
                    <TableCell className="text-sm tabular-nums">{r.levyPct}</TableCell>
                    <TableCell className="text-sm tabular-nums text-gray-700">
                      {r.minLevyMonthly > 0 ? money.format(r.minLevyMonthly) : '—'} /{' '}
                      {r.wageCeiling > 0 ? money.format(r.wageCeiling) : '∞'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {r.effectiveFromYmd || '—'} → {r.effectiveToYmd || 'open'}
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
                          if (typeof window !== 'undefined' && window.confirm(`Remove ${r.rowRef}?`)) {
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
