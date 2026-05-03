'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { UsersRound, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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

type PayFrequency = 'MONTHLY' | 'BI_WEEKLY' | 'SEMI_MONTHLY' | 'WEEKLY'

type PayGroupRow = {
  id: string
  groupRef: string
  groupCode: string
  name: string
  frequency: PayFrequency
  payrollCutoffDay: number
  remarks: string
  active: boolean
}

const FREQUENCY_OPTIONS: ReadonlyArray<{ value: PayFrequency; label: string }> = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'BI_WEEKLY', label: 'Bi-weekly' },
  { value: 'SEMI_MONTHLY', label: 'Semi-monthly' },
  { value: 'WEEKLY', label: 'Weekly' },
]

const FREQUENCY_SELECT = FREQUENCY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextGroupRef(rows: PayGroupRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^PG-(\d+)$/i.exec((r.groupRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `PG-${String(max + 1).padStart(4, '0')}`
}

function parsePayGroupRecord(r: { id: string; data: string }): PayGroupRow {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const f = typeof o.frequency === 'string' ? o.frequency : 'MONTHLY'
    const frequency = FREQUENCY_OPTIONS.some((x) => x.value === f) ? (f as PayFrequency) : 'MONTHLY'
    const cut =
      typeof o.payrollCutoffDay === 'number' && Number.isFinite(o.payrollCutoffDay)
        ? Math.min(31, Math.max(0, Math.floor(o.payrollCutoffDay)))
        : 0
    return {
      id: r.id,
      groupRef: typeof o.groupRef === 'string' ? o.groupRef : '',
      groupCode: typeof o.groupCode === 'string' ? o.groupCode : '',
      name: typeof o.name === 'string' ? o.name : '',
      frequency,
      payrollCutoffDay: cut,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
      active: typeof o.active === 'boolean' ? o.active : true,
    }
  } catch {
    return {
      id: r.id,
      groupRef: '',
      groupCode: '',
      name: '',
      frequency: 'MONTHLY',
      payrollCutoffDay: 0,
      remarks: '',
      active: true,
    }
  }
}

function emptyForm() {
  return {
    groupCode: '',
    name: '',
    frequency: 'MONTHLY' as PayFrequency,
    payrollCutoffDay: '',
    active: true,
    remarks: '',
  }
}

export default function PayGroupSetupPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.PAY_GROUP },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(
    () => ((data?.payrolluirecords as { id: string; data: string }[]) ?? []).map(parsePayGroupRecord),
    [data],
  )

  const [createRec, { loading: creating }] = useMutation(CREATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Pay group saved to the database.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Pay group updated.' })
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

  const closeDialog = useCallback(() => {
    setOpen(false)
    setEditingId(null)
    setForm(emptyForm())
  }, [])

  const submit = () => {
    setBanner(null)
    if (!orgId) return
    if (!form.groupCode.trim()) {
      setBanner({ ok: false, text: 'Group code is required (short key for rules and batches).' })
      return
    }
    const rawDay = form.payrollCutoffDay.trim()
    const dayNum = rawDay === '' ? 0 : Number.parseInt(rawDay, 10)
    if (rawDay !== '' && (Number.isNaN(dayNum) || dayNum < 0 || dayNum > 31)) {
      setBanner({
        ok: false,
        text: 'Payroll cut-off day must be blank or 0–31 (0 or empty = calendar default).',
      })
      return
    }
    const cut = rawDay === '' ? 0 : dayNum
    const groupRef =
      editingId ? rows.find((r) => r.id === editingId)?.groupRef ?? nextGroupRef(rows) : nextGroupRef(rows)
    const groupCode = form.groupCode.trim().toUpperCase()

    const payload = {
      groupRef,
      groupCode,
      name: form.name.trim(),
      frequency: form.frequency,
      payrollCutoffDay: cut,
      active: form.active,
      remarks: form.remarks.trim(),
    }
    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.PAY_GROUP,
      code: groupCode,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: PayGroupRow) => {
    setEditingId(r.id)
    setForm({
      groupCode: r.groupCode || '',
      name: r.name || '',
      frequency: r.frequency,
      payrollCutoffDay: r.payrollCutoffDay > 0 ? String(r.payrollCutoffDay) : '',
      active: Boolean(r.active),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => a.groupRef.localeCompare(b.groupRef)),
    [rows],
  )

  if (!orgId) {
    return <p className="text-sm text-gray-500">Select an organization to configure pay groups.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <UsersRound className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Setup</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pay group</h1>
          <p className="text-gray-500 mt-1">
            Payroll groups organize employees by run calendar and cutoff. Data is persisted on the server per organization.
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
          <Plus className="h-4 w-4 mr-2" /> Add pay group
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
            <span className="text-xs font-semibold text-white">{editingId ? 'Edit pay group' : 'New pay group'}</span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pg-code"
                label="Group code"
                value={form.groupCode}
                onChange={(e) => setForm((f) => ({ ...f, groupCode: e.target.value }))}
                className="h-7 text-xs"
                placeholder="STAFF_M"
              />
              <InputFloating
                id="pg-name"
                label="Display name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SelectFloating
                label="Pay frequency"
                name="pg-freq"
                value={form.frequency}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    frequency: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as PayFrequency,
                  }))
                }
                options={FREQUENCY_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="pg-cut"
                label="Cut-off calendar day"
                value={form.payrollCutoffDay}
                onChange={(e) => setForm((f) => ({ ...f, payrollCutoffDay: e.target.value }))}
                className="h-7 text-xs"
                placeholder="Leave empty for none"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 mt-7 md:mt-8">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Active group
              </label>
            </div>
            <InputFloating
              id="pg-rem"
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
          Pay groups
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No pay groups defined. Groups link employees to calendars when running payroll batches.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Ref</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Name</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Frequency</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Cut-off</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">State</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[96px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono text-xs text-gray-600">{r.groupRef}</TableCell>
                  <TableCell className="font-mono text-sm font-medium">{r.groupCode}</TableCell>
                  <TableCell className="text-sm text-gray-800">{r.name || '—'}</TableCell>
                  <TableCell className="text-sm">
                    {FREQUENCY_OPTIONS.find((f) => f.value === r.frequency)?.label ?? r.frequency}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">{r.payrollCutoffDay > 0 ? r.payrollCutoffDay : '—'}</TableCell>
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
                        if (typeof window !== 'undefined' && window.confirm(`Remove pay group “${r.groupCode}”?`)) {
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
