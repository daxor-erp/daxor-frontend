'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Gauge, Plus, Pencil, Trash2, Save, CheckCircle2, X } from 'lucide-react'
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
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { PayrollUiRecordOrgApprovalCell } from '@/components/payroll-ui-record-org-approval-cell'
import { PAYROLL_UI_CATEGORY } from '@/lib/payroll-ui-category'
import {
  GET_PAYROLL_UI_RECORDS,
  CREATE_PAYROLL_UI_RECORD,
  UPDATE_PAYROLL_UI_RECORD,
  DELETE_PAYROLL_UI_RECORD,
} from '@/gql/queries'

type RunStage =
  | 'INITIALIZED'
  | 'POOL_LOCKED'
  | 'CALCULATED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'POSTED'
  | 'CANCELLED'

type PayrollWorkflowRunRow = {
  id: string
  runRef: string
  title: string
  linkedPayBatchRef: string
  payPeriodStartYmd: string
  payPeriodEndYmd: string
  runStage: RunStage
  runOwnerLabel: string
  linesExpected: number
  remarks: string
  approvalStatus: string
}

const STAGE_OPTIONS: ReadonlyArray<{ value: RunStage; label: string }> = [
  { value: 'INITIALIZED', label: 'Initialized' },
  { value: 'POOL_LOCKED', label: 'Timesheet pool locked' },
  { value: 'CALCULATED', label: 'Calculated' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'POSTED', label: 'Posted' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const STAGE_SELECT = STAGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

function nextRunRef(rows: PayrollWorkflowRunRow[]): string {
  let max = 0
  for (const r of rows) {
    const m = /^PRW-(\d+)$/i.exec((r.runRef || '').trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `PRW-${String(max + 1).padStart(4, '0')}`
}

function stageBadgeClass(stage: RunStage): string {
  switch (stage) {
    case 'INITIALIZED':
      return 'bg-slate-50 text-slate-800 border-slate-200'
    case 'POOL_LOCKED':
      return 'bg-indigo-50 text-indigo-900 border-indigo-200'
    case 'CALCULATED':
      return 'bg-sky-50 text-sky-900 border-sky-200'
    case 'UNDER_REVIEW':
      return 'bg-amber-50 text-amber-900 border-amber-200'
    case 'APPROVED':
      return 'bg-teal-50 text-teal-900 border-teal-200'
    case 'POSTED':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200'
    case 'CANCELLED':
      return 'bg-red-50 text-red-900 border-red-200'
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200'
  }
}

function parseRunRecord(r: { id: string; data: string }): Omit<PayrollWorkflowRunRow, 'approvalStatus'> {
  try {
    const o = JSON.parse(r.data) as Record<string, unknown>
    const runStage =
      typeof o.runStage === 'string' && STAGE_OPTIONS.some((s) => s.value === o.runStage)
        ? (o.runStage as RunStage)
        : 'INITIALIZED'
    return {
      id: r.id,
      runRef: typeof o.runRef === 'string' ? o.runRef : '',
      title: typeof o.title === 'string' ? o.title : '',
      linkedPayBatchRef: typeof o.linkedPayBatchRef === 'string' ? o.linkedPayBatchRef : '',
      payPeriodStartYmd: typeof o.payPeriodStartYmd === 'string' ? o.payPeriodStartYmd : '',
      payPeriodEndYmd: typeof o.payPeriodEndYmd === 'string' ? o.payPeriodEndYmd : '',
      runStage,
      runOwnerLabel: typeof o.runOwnerLabel === 'string' ? o.runOwnerLabel : '',
      linesExpected:
        typeof o.linesExpected === 'number' && Number.isFinite(o.linesExpected)
          ? Math.max(0, Math.floor(o.linesExpected))
          : 0,
      remarks: typeof o.remarks === 'string' ? o.remarks : '',
    }
  } catch {
    return {
      id: r.id,
      runRef: '',
      title: '',
      linkedPayBatchRef: '',
      payPeriodStartYmd: '',
      payPeriodEndYmd: '',
      runStage: 'INITIALIZED',
      runOwnerLabel: '',
      linesExpected: 0,
      remarks: '',
    }
  }
}

function emptyForm() {
  return {
    title: '',
    linkedPayBatchRef: '',
    payPeriodStartYmd: '',
    payPeriodEndYmd: '',
    runStage: 'INITIALIZED' as RunStage,
    runOwnerLabel: '',
    linesExpected: '',
    remarks: '',
  }
}

export default function PayrollRunsWorkflowPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, refetch } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.PAYROLL_RUN_WORKFLOW },
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
        ...parseRunRecord(rec),
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
      setBanner({ ok: true, text: 'Workflow run saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateRec, { loading: updating }] = useMutation(UPDATE_PAYROLL_UI_RECORD, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Workflow run updated.' })
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
    const rawLines = form.linesExpected.trim()
    const lc = rawLines === '' ? 0 : Number.parseInt(rawLines, 10)
    if (rawLines !== '' && (Number.isNaN(lc) || lc < 0)) {
      setBanner({ ok: false, text: 'Expected lines must be a non-negative integer.' })
      return
    }
    if (
      form.payPeriodStartYmd &&
      form.payPeriodEndYmd &&
      form.payPeriodEndYmd < form.payPeriodStartYmd
    ) {
      setBanner({ ok: false, text: 'Pay period end cannot be before start.' })
      return
    }

    const runRef =
      editingId ? rows.find((r) => r.id === editingId)?.runRef ?? nextRunRef(rows) : nextRunRef(rows)

    const payload = {
      runRef,
      title: form.title.trim(),
      linkedPayBatchRef: form.linkedPayBatchRef.trim(),
      payPeriodStartYmd: form.payPeriodStartYmd,
      payPeriodEndYmd: form.payPeriodEndYmd,
      runStage: form.runStage,
      runOwnerLabel: form.runOwnerLabel.trim(),
      linesExpected: lc,
      remarks: form.remarks.trim(),
    }

    const input = {
      organizationId: orgId,
      category: PAYROLL_UI_CATEGORY.PAYROLL_RUN_WORKFLOW,
      code: runRef,
      data: JSON.stringify(payload),
    }
    if (editingId) updateRec({ variables: { id: editingId, input } })
    else createRec({ variables: { input } })
  }

  const openEdit = (r: PayrollWorkflowRunRow) => {
    setEditingId(r.id)
    setForm({
      title: r.title || '',
      linkedPayBatchRef: r.linkedPayBatchRef || '',
      payPeriodStartYmd: r.payPeriodStartYmd || '',
      payPeriodEndYmd: r.payPeriodEndYmd || '',
      runStage: r.runStage,
      runOwnerLabel: r.runOwnerLabel || '',
      linesExpected: r.linesExpected > 0 ? String(r.linesExpected) : '',
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  const funnel = useMemo(() => {
    let openRun = 0
    let inFlight = 0
    let done = 0
    for (const r of rows) {
      const s = r.runStage
      if (s === 'POSTED' || s === 'CANCELLED') done += 1
      else if (s === 'INITIALIZED') openRun += 1
      else inFlight += 1
    }
    return { openRun, inFlight, done }
  }, [rows])

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const pd = (b.payPeriodEndYmd || '').localeCompare(a.payPeriodEndYmd || '')
        if (pd !== 0) return pd
        return (b.runRef || '').localeCompare(a.runRef || '')
      }),
    [rows],
  )

  if (!orgId) {
    return <p className="text-sm text-gray-500">Select an organization to drive payroll workflow runs.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <Gauge className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll · Workflow</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll runs</h1>
          <p className="text-gray-500 mt-1">
            Operational workflow for locking the{' '}
            <Link href="/payroll/workflow/timesheet-pool" className="text-blue-600 hover:underline">
              timesheet pool
            </Link>
            , calculating pay, approving, and posting. Distinct refs from Payroll management (
            <span className="font-mono">PRW-*</span> here). Data is saved per organization on the server.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-9 text-xs">
            <Link href="/payroll-management">Payroll management</Link>
          </Button>
          <Button
            onClick={() => {
              setEditingId(null)
              setForm(emptyForm())
              setOpen(true)
            }}
            className="bg-slate-800 hover:bg-slate-900 text-white h-9 text-xs"
          >
            <Plus className="h-4 w-4 mr-2" /> New workflow run
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">New / initialized</p>
          <p className="text-2xl font-bold tabular-nums text-slate-900">{funnel.openRun}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-amber-900">In progress</p>
          <p className="text-2xl font-bold tabular-nums text-amber-950">{funnel.inFlight}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-emerald-800">Posted / closed</p>
          <p className="text-2xl font-bold tabular-nums text-emerald-950">{funnel.done}</p>
        </div>
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
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit workflow run' : 'New workflow run'}
            </span>
            <button type="button" onClick={closeDialog} className="text-blue-200 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <InputFloating
              id="pr-title"
              label="Run title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="h-7 text-xs"
              placeholder="e.g. April 2026 — production staff"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pr-batchref"
                label="Linked pay batch ref"
                value={form.linkedPayBatchRef}
                onChange={(e) => setForm((f) => ({ ...f, linkedPayBatchRef: e.target.value }))}
                className="h-7 text-xs"
                placeholder="e.g. PB-0001"
              />
              <InputFloating
                id="pr-lines"
                label="Expected pay lines"
                value={form.linesExpected}
                onChange={(e) => setForm((f) => ({ ...f, linesExpected: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFloating
                id="pr-start"
                label="Pay period start"
                type="date"
                value={form.payPeriodStartYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodStartYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pr-end"
                label="Pay period end"
                type="date"
                value={form.payPeriodEndYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodEndYmd: e.target.value }))}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SelectFloating
                label="Workflow stage"
                name="pr-stage"
                value={form.runStage}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    runStage: (typeof v === 'string'
                      ? v
                      : (v as React.ChangeEvent<HTMLSelectElement>).target.value) as RunStage,
                  }))
                }
                options={STAGE_SELECT}
                className="h-7 text-xs"
                placeholder="Select…"
              />
              <InputFloating
                id="pr-owner"
                label="Preparer / owner"
                value={form.runOwnerLabel}
                onChange={(e) => setForm((f) => ({ ...f, runOwnerLabel: e.target.value }))}
                className="h-7 text-xs"
                placeholder="Name or payroll role"
              />
            </div>
            <InputFloating
              id="pr-rem"
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
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
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
          Workflow payroll runs
        </div>
        {!ready ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : sortedRows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No workflow runs yet. Create one to march the period through lock → calculation → reviewer → poster.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap">Run</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Title</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Batch</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Pay period</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Stage</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600">Org approval</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap w-[92px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-mono text-sm font-semibold text-gray-800">{r.runRef}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{r.title || '—'}</div>
                      <div className="text-xs text-gray-500">
                        {r.runOwnerLabel || 'No owner'} {r.linesExpected > 0 ? `· ${r.linesExpected} lines` : null}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{r.linkedPayBatchRef || '—'}</TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {r.payPeriodStartYmd && r.payPeriodEndYmd
                        ? `${r.payPeriodStartYmd} – ${r.payPeriodEndYmd}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={stageBadgeClass(r.runStage)}>
                        {STAGE_OPTIONS.find((s) => s.value === r.runStage)?.label ?? r.runStage}
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
                          if (typeof window !== 'undefined' && window.confirm(`Remove ${r.runRef}?`)) {
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
