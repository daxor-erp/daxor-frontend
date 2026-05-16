'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { format, parseISO } from 'date-fns'
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
import { Plus, Pencil, Trash2, Briefcase, CheckCircle2, X, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_PAYROLL_MANAGEMENTS,
  CREATE_PAYROLL_MANAGEMENT,
  UPDATE_PAYROLL_MANAGEMENT,
  DELETE_PAYROLL_MANAGEMENT,
  SUBMIT_PAYROLL_MANAGEMENT_FOR_APPROVAL,
} from '@/gql/queries'

/** Saved on the document (lifecycle). SUBMITTED = waiting for org approver. */
const WORKFLOW_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Pending approval',
  PENDING_REVIEW: 'Pending approval',
  APPROVAL_DECLINED: 'Approval declined',
  APPROVED: 'Approved',
  PROCESSED: 'Processed',
  CANCELLED: 'Cancelled',
}

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
  if (s === 'SUBMITTED' || s === 'PENDING_REVIEW') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (s === 'APPROVAL_DECLINED') return 'bg-red-50 text-red-800 border-red-200'
  if (s === 'APPROVED') return 'bg-sky-50 text-sky-800 border-sky-200'
  if (s === 'PROCESSED') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (s === 'CANCELLED') return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800'
}

function workflowStatusLabel(status: string) {
  const s = (status || '').toUpperCase()
  return WORKFLOW_STATUS_LABELS[s] ?? status ?? '—'
}

function payrollMgmtCanSendApproval(status: string) {
  const s = (status || '').toUpperCase()
  return s === 'DRAFT' || s === 'APPROVAL_DECLINED' || s === 'PENDING_REVIEW'
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
}

export default function PayrollManagementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({
    title: '',
    docDateYmd: format(new Date(), 'yyyy-MM-dd'),
    payPeriodStartYmd: '',
    payPeriodEndYmd: '',
    remarks: '',
  })

  const { data, loading, refetch } = useQuery(GET_PAYROLL_MANAGEMENTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createPm, { loading: creating }] = useMutation(CREATE_PAYROLL_MANAGEMENT, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Payroll run created.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updatePm, { loading: updating }] = useMutation(UPDATE_PAYROLL_MANAGEMENT, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Payroll run updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [submitPmApproval, { loading: submittingApproval }] = useMutation(
    SUBMIT_PAYROLL_MANAGEMENT_FOR_APPROVAL,
    {
      onCompleted: () => {
        refetch()
        setBanner({ ok: true, text: 'Sent for approval.' })
        setTimeout(() => setBanner(null), 4000)
      },
      onError: (e) => setBanner({ ok: false, text: e.message }),
    },
  )
  const [deletePm] = useMutation(DELETE_PAYROLL_MANAGEMENT, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Payroll run removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const rows: Row[] = (data?.payrollmanagements as Row[] | undefined) ?? []
  const busy = creating || updating

  const closeDialog = () => {
    setOpen(false)
    setEditingId(null)
    setForm({
      title: '',
      docDateYmd: format(new Date(), 'yyyy-MM-dd'),
      payPeriodStartYmd: '',
      payPeriodEndYmd: '',
      remarks: '',
    })
  }

  const buildInput = () => {
    if (!orgId) return null
    const payStart = ymdToIso(form.payPeriodStartYmd)
    const payEnd = ymdToIso(form.payPeriodEndYmd)
    return {
      organizationId: orgId,
      docDate: ymdToIso(form.docDateYmd) || new Date().toISOString(),
      title: form.title.trim() || undefined,
      remarks: form.remarks.trim() || undefined,
      payPeriodStart: payStart,
      payPeriodEnd: payEnd,
    }
  }

  const submit = () => {
    const input = buildInput()
    if (!input) return
    if (editingId) {
      updatePm({ variables: { id: editingId, input } })
    } else {
      createPm({ variables: { input } })
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      title: '',
      docDateYmd: format(new Date(), 'yyyy-MM-dd'),
      payPeriodStartYmd: '',
      payPeriodEndYmd: '',
      remarks: '',
    })
    setOpen(true)
  }

  const openEdit = (r: Row) => {
    setEditingId(r.id)
    setForm({
      title: r.title || '',
      docDateYmd: toYmd(r.docDate) || format(new Date(), 'yyyy-MM-dd'),
      payPeriodStartYmd: toYmd(r.payPeriodStart),
      payPeriodEndYmd: toYmd(r.payPeriodEnd),
      remarks: r.remarks || '',
    })
    setOpen(true)
  }

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization to manage payroll.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <Briefcase className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payroll</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll management</h1>
          <p className="text-gray-500 mt-1">
            Create and track payroll runs: document date, pay period, and workflow status.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-slate-800 hover:bg-slate-900 text-white shrink-0">
          <Plus className="h-4 w-4 mr-2" /> New payroll run
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
              {editingId ? 'Edit payroll run' : 'New payroll run'}
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
                  id="pm-title"
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputFloating
                id="pm-docdate"
                label="Document date"
                type="date"
                value={form.docDateYmd}
                onChange={(e) => setForm((f) => ({ ...f, docDateYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <p className="text-xs text-slate-500 sm:col-span-2 flex items-end pb-1">
                New runs start as Draft. Use &quot;Send for approval&quot; in the list once saved.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                id="pm-pstart"
                label="Pay period start"
                type="date"
                value={form.payPeriodStartYmd}
                onChange={(e) => setForm((f) => ({ ...f, payPeriodStartYmd: e.target.value }))}
                className="h-7 text-xs"
              />
              <InputFloating
                id="pm-pend"
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
                id="pm-remarks"
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
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {busy ? 'Saving…' : editingId ? 'Update' : 'Save payroll run'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold">
          Payroll runs
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No payroll runs yet. Add one to start a period and move it through review and processing.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Document</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Title</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Doc date</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Pay period</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Workflow</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 min-w-[148px]">
                  Org approval
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-mono text-sm font-medium">{r.docNumber}</TableCell>
                  <TableCell className="text-sm text-gray-800">{r.title || '—'}</TableCell>
                  <TableCell className="text-sm">{toYmd(r.docDate) || '—'}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {r.payPeriodStart && r.payPeriodEnd
                      ? `${toYmd(r.payPeriodStart)} – ${toYmd(r.payPeriodEnd)}`
                      : r.payPeriodStart || r.payPeriodEnd
                        ? `${toYmd(r.payPeriodStart) || '…'} – ${toYmd(r.payPeriodEnd) || '…'}`
                        : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadgeClass(r.status)}>
                      {workflowStatusLabel(r.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payrollMgmtCanSendApproval(r.status) ? (
                      <select
                        aria-label="Payroll management approval action"
                        className="h-7 text-xs rounded-md border border-input bg-background px-2 max-w-[180px]"
                        disabled={submittingApproval}
                        defaultValue=""
                        onChange={(e) => {
                          const v = e.target.value
                          e.target.value = ''
                          if (v === 'submit') submitPmApproval({ variables: { id: r.id } })
                        }}
                      >
                        <option value="">Change status…</option>
                        <option value="submit">Send for approval</option>
                      </select>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
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
                        if (confirm(`Remove payroll run “${r.docNumber}”?`)) {
                          deletePm({ variables: { id: r.id } })
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
