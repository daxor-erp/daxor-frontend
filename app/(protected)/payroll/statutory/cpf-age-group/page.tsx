'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { IdCard, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type CpfAgeGroupRow = {
  id: string
  rowRef: string
  bandCode: string
  description: string
  ageFrom: number
  ageTo: number
  cpfCategoryLabel: string
  employeeRatePct: number
  employerRatePct: number
  effectiveFromYmd: string
  effectiveToYmd: string
  active: boolean
  remarks: string
  approvalStatus: string
}

function nextRef(rows: CpfAgeGroupRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^CPFA-(\d+)$/i.exec((r.rowRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `CPFA-${String(max + 1).padStart(4, '0')}`
}

function parseCpfRecord(r: { id: string; data: string }): Omit<CpfAgeGroupRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    return {
      id: r.id,
      rowRef: typeof o.rowRef === 'string' ? o.rowRef : '',
      bandCode: typeof o.bandCode === 'string' ? o.bandCode : '',
      description: typeof o.description === 'string' ? o.description : '',
      ageFrom: typeof o.ageFrom === 'number' ? o.ageFrom : 0,
      ageTo: typeof o.ageTo === 'number' ? o.ageTo : 99,
      cpfCategoryLabel: typeof o.cpfCategoryLabel === 'string' ? o.cpfCategoryLabel : '',
      employeeRatePct: typeof o.employeeRatePct === 'number' ? o.employeeRatePct : 0,
      employerRatePct: typeof o.employerRatePct === 'number' ? o.employerRatePct : 0,
      effectiveFromYmd: typeof o.effectiveFromYmd === 'string' ? o.effectiveFromYmd : '',
      effectiveToYmd: typeof o.effectiveToYmd === 'string' ? o.effectiveToYmd : '',
      active: typeof o.active === 'boolean' ? o.active : true,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      rowRef: '',
      bandCode: '',
      description: '',
      ageFrom: 0,
      ageTo: 99,
      cpfCategoryLabel: '',
      employeeRatePct: 0,
      employerRatePct: 0,
      effectiveFromYmd: '',
      effectiveToYmd: '',
      active: true,
      remarks: '',
    }
  }
}

function emptyForm() {
  return {
    bandCode: '',
    description: '',
    ageFrom: '',
    ageTo: '',
    cpfCategoryLabel: '',
    employeeRatePct: '',
    employerRatePct: '',
    effectiveFromYmd: '',
    effectiveToYmd: '',
    active: true,
    remarks: '',
  }
}

export default function CpfAgeGroupPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.CPF_AGE_GROUP },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () =>
      ((data?.payrolluirecords as PayrollUiRecordQueryRow[]) ?? []).map((rec) =>
        withOrgApproval<CpfAgeGroupRow>(rec, parseCpfRecord(rec)),
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
      setBanner({ ok: true, text: 'CPF age band saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Age band updated.' })
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
    if (!form.bandCode.trim()) {
      setBanner({ ok: false, text: 'Band code is required.' })
      return
    }
    const af = Number.parseInt(form.ageFrom.trim(), 10)
    const atRaw = form.ageTo.trim()
    const at = atRaw === '' ? 99 : Number.parseInt(atRaw, 10)
    if (Number.isNaN(af) || af < 0 || af > 120) {
      setBanner({ ok: false, text: 'Age “from” must be 0–120.' })
      return
    }
    if (atRaw !== '' && (Number.isNaN(at) || at < 0 || at > 120)) {
      setBanner({ ok: false, text: 'Age “to” must be blank (open) or 0–120.' })
      return
    }
    const upper = atRaw === '' ? 99 : at
    if (upper < af) {
      setBanner({ ok: false, text: 'Age “to” cannot be less than “from”. Leave “to” blank for open-ended bands.' })
      return
    }

    const parsePct = (raw: string, label: string): number | null => {
      const t = raw.trim()
      if (t === '') return 0
      const n = Number.parseFloat(t)
      if (Number.isNaN(n) || n < 0 || n > 100) {
        setBanner({ ok: false, text: `${label} must be 0–100%.` })
        return null
      }
      return n
    }
    const ee = parsePct(form.employeeRatePct, 'Employee contribution %')
    if (ee === null) return
    const er = parsePct(form.employerRatePct, 'Employer contribution %')
    if (er === null) return

    if (form.effectiveFromYmd && form.effectiveToYmd && form.effectiveToYmd < form.effectiveFromYmd) {
      setBanner({ ok: false, text: 'Effective “to” must not be before “from”. ' })
      return
    }

    const bandTrim = form.bandCode.trim().toUpperCase()
    const rowRef = editingId ? rows.find((r) => r.id === editingId)?.rowRef ?? nextRef(rows) : nextRef(rows)

    const payload = {
      rowRef,
      bandCode: bandTrim,
      description: form.description.trim(),
      ageFrom: af,
      ageTo: upper,
      cpfCategoryLabel: form.cpfCategoryLabel.trim(),
      employeeRatePct: ee,
      employerRatePct: er,
      effectiveFromYmd: form.effectiveFromYmd,
      effectiveToYmd: form.effectiveToYmd,
      active: form.active,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.CPF_AGE_GROUP,
      code: bandTrim,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: CpfAgeGroupRow) => {
    setEditingId(r.id)
    setForm({
      bandCode: r.bandCode || '',
      description: r.description || '',
      ageFrom: String(r.ageFrom ?? 0),
      ageTo: r.ageTo >= 99 ? '' : String(r.ageTo),
      cpfCategoryLabel: r.cpfCategoryLabel || '',
      employeeRatePct: r.employeeRatePct ? String(r.employeeRatePct) : '',
      employerRatePct: r.employerRatePct ? String(r.employerRatePct) : '',
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
        const c = a.ageFrom - b.ageFrom
        return c !== 0 ? c : (a.bandCode || '').localeCompare(b.bandCode || '')
      }),
    [rows],
  )

  if (!orgId) {
    return <p className="erp-page-desc">Select an organization for CPF age-group masters.</p>
  }

  return (
    <div className="erp-shell">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <IdCard className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Statutory</span>
          </div>
          <h1 className="erp-page-title">CPF applied age group</h1>
          <p className="text-gray-500 mt-1">
            Maintain age-bracket reference rates for CPF withholding. Stored per organization on the server.
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
          <Plus className="h-4 w-4 mr-2" /> Add band
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
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit age band' : 'New age band'}</span>
            <button type="button" onClick={closeDialog} className="text-primary-foreground/80 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="cpf-code"
                label="Band code"
                value={form.bandCode}
                onChange={(e) => setForm((f) => ({ ...f, bandCode: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="cpf-desc"
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <InputFloating
              id="cpf-cat"
              label="Rate category / OW-AW note"
              value={form.cpfCategoryLabel}
              onChange={(e) => setForm((f) => ({ ...f, cpfCategoryLabel: e.target.value }))}
              className="h-7 text-xs"
              placeholder="e.g. SG citizen — ordinary wages"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <InputFloating
                id="cpf-af"
                label="Age from"
                value={form.ageFrom}
                onChange={(e) => setForm((f) => ({ ...f, ageFrom: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="cpf-at"
                label="Age to (blank = open)"
                value={form.ageTo}
                onChange={(e) => setForm((f) => ({ ...f, ageTo: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="cpf-ee"
                label="Employee %"
                value={form.employeeRatePct}
                onChange={(e) => setForm((f) => ({ ...f, employeeRatePct: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="cpf-er"
                label="Employer %"
                value={form.employerRatePct}
                onChange={(e) => setForm((f) => ({ ...f, employerRatePct: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="cpf-ef"
                label="Effective from"
                type="date"
                value={form.effectiveFromYmd}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFromYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="cpf-et"
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
              id="cpf-rem"
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
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[96px]"
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
          CPF age groups
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No rows yet. Define statutory age bands that mirror CPF Board tables for your payroll engine.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap">Ref</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Band</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Ages</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">EE% / ER%</TableHead>
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
                    <TableCell>
                      <div className="font-mono text-sm font-medium">{r.bandCode}</div>
                      <div className="text-xs text-gray-500">{r.description || '—'}</div>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {r.ageFrom} – {r.ageTo >= 99 ? '∞' : r.ageTo}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {r.employeeRatePct} / {r.employerRatePct}
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
                          if (typeof window !== 'undefined' && window.confirm(`Remove “${r.bandCode}”?`)) {
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
